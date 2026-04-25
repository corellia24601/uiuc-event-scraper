'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Search, Sparkles, X, ChevronDown, ChevronRight, Calendar, SlidersHorizontal } from 'lucide-react';
import { sendGAEvent } from '@next/third-parties/google';
import { AnimatedBackground } from './components/AnimatedBackground';
import { ScrapingLoader } from './components/ScrapingLoader';
import { EventCard } from './components/EventCard';
import { generateCategoryColorsMap } from './lib/categoryColors';

// ── Search scoring ────────────────────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 99;
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  const curr = new Array(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      curr[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

function scoreEvent(event: Event, terms: string[], queryLower: string): number {
  const title = event.title.toLowerCase();
  const desc = (event.description || '').toLowerCase();
  let score = 0;

  if (title.includes(queryLower)) score += 200;
  else if (desc.includes(queryLower)) score += 60;

  const titleWords = title.split(/\W+/).filter(Boolean);
  const descWords = desc.split(/\W+/).filter(Boolean);
  let titleHits = 0, anyHits = 0;

  for (const term of terms) {
    const maxDist = term.length >= 8 ? 2 : term.length >= 5 ? 1 : 0;
    let inTitle = false, hit = false;

    if (title.includes(term)) {
      score += 40; inTitle = true; hit = true;
    } else if (desc.includes(term)) {
      score += 10; hit = true;
    } else if (titleWords.some(w => w.startsWith(term) || (term.length >= 4 && term.startsWith(w) && w.length >= 4))) {
      score += 20; inTitle = true; hit = true;
    } else if (descWords.some(w => w.startsWith(term) || (term.length >= 4 && term.startsWith(w) && w.length >= 4))) {
      score += 5; hit = true;
    } else if (maxDist > 0) {
      if (titleWords.some(w => levenshtein(w, term) <= maxDist)) { score += 15; inTitle = true; hit = true; }
      else if (descWords.some(w => levenshtein(w, term) <= maxDist)) { score += 3; hit = true; }
    }

    if (inTitle) titleHits++;
    if (hit) anyHits++;
  }

  if (terms.length > 1) {
    if (titleHits === terms.length) score += 60;
    else if (anyHits === terms.length) score += 20;
  }

  return score;
}

// ─────────────────────────────────────────────────────────────────────────────

const COLLEGE_MERGE_RULES: { label: string; match: (n: string) => boolean }[] = [
  { label: 'ACES',         match: (n) => n.includes('ACES') },
  { label: 'Business',     match: (n) => n.includes('Business') || n.includes('Gies') },
  { label: 'Engineering',  match: (n) => n.includes('Engineering') },
  { label: 'LAS',          match: (n) => n.includes('LAS') },
  { label: 'Mathematics',  match: (n) => n.includes('Mathematics') },
  { label: 'Medicine',     match: (n) => n.includes('Medicine') },
  { label: 'Physics',      match: (n) => n.includes('Physics') },
  { label: 'Social Work',  match: (n) => n.includes('Social Work') },
];

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: string;
  url: string;
  source_name: string;
  category: string;
  sponsor: string;
  contact: string;
  contact_email: string;
  views: number;
  originating_calendar: string;
  source_links: string;
}

type SetupPhase = 'checking' | 'initializing' | 'scraping' | 'ready';

interface ScrapeProgress {
  running: boolean;
  current: number;
  total: number;
  currentSource: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [scrapStatus, setScrapStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [uniqueSources, setUniqueSources] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOriginatingCalendars, setSelectedOriginatingCalendars] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [categoryCalendars, setCategoryCalendars] = useState<Record<string, string[]>>({});
  const [displayToSources, setDisplayToSources] = useState<Map<string, string[]>>(new Map());
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'relevance'>('date');
  const [semanticScores, setSemanticScores] = useState<Map<number, number>>(new Map());
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [setupPhase, setSetupPhase] = useState<SetupPhase>('checking');
  const [initProgress, setInitProgress] = useState(0);
  const [scrapeProgress, setScrapeProgress] = useState<ScrapeProgress>({ running: false, current: 0, total: 0, currentSource: '' });
  const [showScrapeModal, setShowScrapeModal] = useState(false);
  const [scrapeModalStatus, setScrapeModalStatus] = useState<'scraping' | 'success' | 'error'>('scraping');
  const [scrapeModalProgress, setScrapeModalProgress] = useState(0);
  const [scrapeModalSource, setScrapeModalSource] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let animFrame: ReturnType<typeof setTimeout>;

    async function checkAndSetup() {
      try {
        const res = await fetch('/api/status');
        const status = await res.json();

        if (status.eventCount > 0 && !status.scrape.running) {
          setSetupPhase('ready');
          fetchEvents('');
          fetchSources();
          return;
        }

        if (status.scrape.running) {
          setSetupPhase('scraping');
          setScrapeProgress(status.scrape);
          startPolling();
          return;
        }

        if (!status.initialized) {
          setSetupPhase('initializing');
          let pct = 0;
          const tick = () => {
            pct = Math.min(pct + 12, 85);
            setInitProgress(pct);
            if (pct < 85) animFrame = setTimeout(tick, 60);
          };
          tick();
        } else {
          setSetupPhase('scraping');
        }

        await fetch('/api/setup', { method: 'POST' });

        clearTimeout(animFrame);
        setInitProgress(100);
        await new Promise(r => setTimeout(r, 400));
        setSetupPhase('scraping');
        startPolling();
      } catch {
        setSetupPhase('ready');
        fetchEvents('');
        fetchSources();
      }
    }

    function startPolling() {
      pollRef.current = setInterval(async () => {
        try {
          const r = await fetch('/api/status');
          const s = await r.json();
          setScrapeProgress(s.scrape);
          if (!s.scrape.running) {
            clearInterval(pollRef.current!);
            pollRef.current = null;
            setSetupPhase('ready');
            fetchEvents('');
            fetchSources();
          }
        } catch { /* ignore transient */ }
      }, 1500);
    }

    checkAndSetup();
    return () => {
      clearTimeout(animFrame);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll depth tracking
  useEffect(() => {
    const milestones = new Set<number>();
    const handleScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((window.scrollY / scrollable) * 100);
      for (const m of [25, 50, 75, 100]) {
        if (pct >= m && !milestones.has(m)) {
          milestones.add(m);
          sendGAEvent('event', 'scroll_depth', { depth: m });
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exit / last-state tracking
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        sendGAEvent('event', 'page_exit', {
          search_query: searchQuery || '(none)',
          results_shown: events.length,
          sort_by: sortBy,
          filters_active: hasActiveFilters ? 'yes' : 'no',
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [searchQuery, events.length, sortBy, hasActiveFilters]);

  const fetchEvents = async (query: string = '') => {
    setSearching(true);
    setLoading(true);
    try {
      const url = query.trim()
        ? `/api/events?q=${encodeURIComponent(query)}`
        : '/api/events';
      const response = await fetch(url);
      if (!response.ok) {
        setAllEvents([]);
        setEvents([]);
        return;
      }
      const data = await response.json();
      const eventArray: Event[] = Array.isArray(data) ? data : [];
      setAllEvents(eventArray);

      const sources = Array.from(new Set(eventArray.map((e: Event) => e.source_name))).sort() as string[];
      setUniqueSources(sources);

      // Build category color map from unique event categories
      const uniqueCats = Array.from(new Set(eventArray.map((e: Event) => e.category).filter(Boolean))).sort();
      setCategoryColors(generateCategoryColorsMap(uniqueCats));

      applyFilters(eventArray, searchQuery, dateFrom, dateTo, selectedSources, selectedCategories, selectedOriginatingCalendars, sortBy);
    } catch (error) {
      console.error('Error fetching events:', error);
      setAllEvents([]);
      setEvents([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const fetchSources = async () => {
    try {
      const res = await fetch('/api/sources');
      if (!res.ok) return;
      const sources: { category: string; name: string; active: boolean }[] = await res.json();
      const catMap: Record<string, string[]> = {};
      for (const s of sources) {
        if (!s.active) continue;
        if (!catMap[s.category]) catMap[s.category] = [];
        catMap[s.category].push(s.name);
      }
      for (const cat in catMap) catMap[cat].sort();

      const dtSources = new Map<string, string[]>();
      for (const cat in catMap) {
        if (cat === 'Colleges & Schools') {
          const used = new Set<string>();
          const mergedEntries = new Map<string, string[]>();
          for (const rule of COLLEGE_MERGE_RULES) {
            const matching = catMap[cat].filter(rule.match);
            if (matching.length > 0) {
              mergedEntries.set(rule.label, matching);
              matching.forEach(n => used.add(n));
            }
          }
          for (const name of catMap[cat]) {
            if (!used.has(name)) mergedEntries.set(name, [name]);
          }
          catMap[cat] = Array.from(mergedEntries.keys()).sort();
          for (const [label, names] of mergedEntries) dtSources.set(label, names);
        } else {
          for (const name of catMap[cat]) dtSources.set(name, [name]);
        }
      }

      setDisplayToSources(dtSources);
      setCategoryCalendars(catMap);
    } catch (e) {
      console.error('Error fetching sources:', e);
    }
  };

  const applyFilters = useCallback((
    eventsToFilter: Event[],
    search: string,
    from: string,
    to: string,
    sources: string[],
    categories: string[],
    origCals: string[],
    sort: 'date' | 'views' | 'relevance',
    semScoresOverride?: Map<number, number>
  ) => {
    let filtered = eventsToFilter;
    let relevanceScores: Map<number, number> | null = null;
    const activeSemScores = semScoresOverride ?? semanticScores;

    if (search.trim()) {
      const queryLower = search.trim().toLowerCase();
      const terms = queryLower.split(/\s+/).filter(t => t.length >= 2);

      const scored = filtered.map(e => {
        const kw = scoreEvent(e, terms, queryLower);
        const sem = activeSemScores.get(e.id) ?? 0;
        const kwNorm = Math.min(kw, 300) / 300;
        const combined = sem * 60 + kwNorm * 40;
        return { event: e, kw, sem, combined };
      }).filter(r => r.kw > 0 || r.sem >= 0.3);

      filtered = scored.map(r => r.event);
      relevanceScores = new Map(scored.map(r => [r.event.id, r.combined]));
    }

    if (from || to) {
      filtered = filtered.filter(e => {
        const evEnd = e.end_date || e.start_date;
        if (from && evEnd < from) return false;
        if (to && e.start_date > to) return false;
        return true;
      });
    }

    if (sources.length > 0) {
      filtered = filtered.filter(e => sources.includes(e.source_name));
    }

    if (categories.length > 0 || origCals.length > 0) {
      const sourceNamesSet = new Set<string>();
      for (const label of origCals) {
        const names = displayToSources.get(label);
        if (names) names.forEach(n => sourceNamesSet.add(n));
        else sourceNamesSet.add(label);
      }
      filtered = filtered.filter(e =>
        categories.includes(e.category) ||
        sourceNamesSet.has(e.source_name)
      );
    }

    if (sort === 'relevance' && relevanceScores) {
      filtered = [...filtered].sort((a, b) =>
        (relevanceScores!.get(b.id) ?? 0) - (relevanceScores!.get(a.id) ?? 0) ||
        a.start_date.localeCompare(b.start_date)
      );
    } else if (sort === 'views') {
      filtered = [...filtered].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }

    setEvents(filtered);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayToSources, semanticScores]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();

    if (!q) {
      setSemanticScores(new Map());
      setSortBy('date');
      applyFilters(allEvents, '', dateFrom, dateTo, selectedSources, selectedCategories, selectedOriginatingCalendars, 'date');
      return;
    }

    setSearching(true);

    let semScores = new Map<number, number>();
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json() as { id: number; score: number }[];
        semScores = new Map(data.map(r => [r.id, r.score]));
      }
    } catch {
      // fall back to keyword-only
    }

    setSemanticScores(semScores);
    setSearching(false);
    setSortBy('relevance');
    sendGAEvent('event', 'search', { search_term: q, semantic_hits: semScores.size });
    applyFilters(allEvents, q, dateFrom, dateTo, selectedSources, selectedCategories, selectedOriginatingCalendars, 'relevance', semScores);
  };

  const handleDateFromChange = (newDate: string) => {
    setDateFrom(newDate);
    if (newDate) sendGAEvent('event', 'filter_date', { date_from: newDate });
    applyFilters(allEvents, searchQuery, newDate, dateTo, selectedSources, selectedCategories, selectedOriginatingCalendars, sortBy);
  };

  const handleDateToChange = (newDate: string) => {
    setDateTo(newDate);
    if (newDate) sendGAEvent('event', 'filter_date', { date_to: newDate });
    applyFilters(allEvents, searchQuery, dateFrom, newDate, selectedSources, selectedCategories, selectedOriginatingCalendars, sortBy);
  };

  const handleSourceToggle = (source: string) => {
    const next = selectedSources.includes(source)
      ? selectedSources.filter(s => s !== source)
      : [...selectedSources, source];
    if (!selectedSources.includes(source)) sendGAEvent('event', 'filter_host', { host: source });
    setSelectedSources(next);
    applyFilters(allEvents, searchQuery, dateFrom, dateTo, next, selectedCategories, selectedOriginatingCalendars, sortBy);
  };

  const handleCategoryToggle = (category: string) => {
    const next = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    if (!selectedCategories.includes(category)) sendGAEvent('event', 'filter_category', { category });
    setSelectedCategories(next);
    applyFilters(allEvents, searchQuery, dateFrom, dateTo, selectedSources, next, selectedOriginatingCalendars, sortBy);
  };

  const handleOrigCalToggle = (cal: string) => {
    const next = selectedOriginatingCalendars.includes(cal)
      ? selectedOriginatingCalendars.filter(c => c !== cal)
      : [...selectedOriginatingCalendars, cal];
    if (!selectedOriginatingCalendars.includes(cal)) sendGAEvent('event', 'filter_source', { source: cal });
    setSelectedOriginatingCalendars(next);
    applyFilters(allEvents, searchQuery, dateFrom, dateTo, selectedSources, selectedCategories, next, sortBy);
  };

  const toggleCategoryExpand = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSelectedSources([]);
    setSelectedCategories([]);
    setSelectedOriginatingCalendars([]);
    setSortBy('date');
    setSearchQuery('');
    applyFilters(allEvents, '', '', '', [], [], [], 'date');
  };

  const handleScrapeClick = async () => {
    setShowScrapeModal(true);
    setScrapeModalStatus('scraping');
    setScrapeModalProgress(0);
    setScrapeModalSource('');
    setScraping(true);
    setScrapStatus('');

    try {
      const response = await fetch('/api/scrape', { method: 'POST' });
      if (response.ok) {
        setScrapeModalStatus('success');
        await fetchEvents();
      } else {
        setScrapeModalStatus('error');
      }
    } catch {
      setScrapeModalStatus('error');
    } finally {
      setScraping(false);
    }
  };

  const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (dateStr: string) => {
    return parseLocalDate(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
    });
  };

  const formatTimeRange = (event: Event) => {
    const sameDay = !event.end_date || event.end_date === event.start_date;
    if (!sameDay) {
      const dateRange = `${formatDate(event.start_date)} – ${formatDate(event.end_date)}`;
      return event.start_time ? `${dateRange}  ·  ${event.start_time}` : dateRange;
    }
    const datePart = formatDate(event.start_date);
    if (!event.start_time) return `${datePart}  ·  All Day`;
    const timePart = event.end_time
      ? `${event.start_time} – ${event.end_time}`
      : event.start_time;
    return `${datePart}  ·  ${timePart}`;
  };

  const getAccentColor = (category: string) => {
    return categoryColors[category] || '#6366f1';
  };

  const categoryFilterCount = selectedCategories.length + selectedOriginatingCalendars.length;
  const hasActiveFilters = !!(dateFrom || dateTo || selectedSources.length > 0 || categoryFilterCount > 0 || sortBy !== 'date' || searchQuery);
  const isSetupActive = setupPhase !== 'ready';

  const setupProgress = setupPhase === 'initializing'
    ? initProgress
    : setupPhase === 'scraping' && scrapeProgress.total > 0
      ? Math.round((scrapeProgress.current / scrapeProgress.total) * 100)
      : 0;

  // ── Sidebar JSX (reused in both desktop and mobile) ───────────────────────

  const renderSidebar = () => (
    <div className="space-y-4">
      {/* Sort */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>Sort By</p>
        <select
          value={sortBy}
          onChange={(e) => {
            const newSort = e.target.value as 'date' | 'views' | 'relevance';
            setSortBy(newSort);
            sendGAEvent('event', 'sort_change', { sort_by: newSort });
            applyFilters(allEvents, searchQuery, dateFrom, dateTo, selectedSources, selectedCategories, selectedOriginatingCalendars, newSort);
          }}
          disabled={searching || scraping}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 cursor-pointer"
          style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}
        >
          <option value="date">Date (Earliest First)</option>
          <option value="views">Views (Most Popular)</option>
          <option value="relevance" disabled={!searchQuery.trim()}>
            {searchQuery.trim() ? 'Relevance' : 'Relevance (search first)'}
          </option>
        </select>
      </div>

      {/* Date range */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>Date Range</p>
        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>From</label>
              {dateFrom && (
                <button type="button" onClick={() => handleDateFromChange('')}
                  className="text-[11px] text-gray-400 hover:text-red-500 transition-colors">Clear ×</button>
              )}
            </div>
            <input type="date" lang="en-US" value={dateFrom}
              onChange={(e) => handleDateFromChange(e.target.value)}
              disabled={searching || scraping}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>To</label>
              {dateTo && (
                <button type="button" onClick={() => handleDateToChange('')}
                  className="text-[11px] text-gray-400 hover:text-red-500 transition-colors">Clear ×</button>
              )}
            </div>
            <input type="date" lang="en-US" value={dateTo}
              onChange={(e) => handleDateToChange(e.target.value)}
              disabled={searching || scraping}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Category filter */}
      {Object.keys(categoryCalendars).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Category
              {categoryFilterCount > 0 && (
                <span className="normal-case font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full text-[10px]">
                  {categoryFilterCount}
                </span>
              )}
            </p>
            {categoryFilterCount > 0 && (
              <button type="button"
                onClick={() => { setSelectedCategories([]); setSelectedOriginatingCalendars([]); applyFilters(allEvents, searchQuery, dateFrom, dateTo, selectedSources, [], [], sortBy); }}
                className="text-[11px] text-gray-400 hover:text-red-500 transition-colors">
                Clear
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#E5E7EB #F9FAFB' }}>
            {Object.keys(categoryCalendars).sort().map(cat => {
              const cals = categoryCalendars[cat];
              const isExpanded = expandedCategories.has(cat);
              const catChecked = selectedCategories.includes(cat);
              const dotColor = getAccentColor(cat);
              return (
                <div key={cat}>
                  <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${catChecked ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <input type="checkbox" checked={catChecked}
                      onChange={() => handleCategoryToggle(cat)}
                      disabled={searching || scraping}
                      className="w-3.5 h-3.5 shrink-0 cursor-pointer rounded accent-blue-500"
                    />
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                    <span
                      className={`flex-1 text-xs select-none ${catChecked ? 'text-blue-700 font-semibold' : 'text-gray-700 font-medium'}`}
                      onClick={() => handleCategoryToggle(cat)}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {cat}
                      <span className="ml-1 text-gray-400 font-normal text-[10px]">({cals.length})</span>
                    </span>
                    {cals.length > 0 && (
                      <button type="button" onClick={() => toggleCategoryExpand(cat)}
                        className="text-gray-300 hover:text-gray-600 transition-colors w-4 h-4 flex items-center justify-center shrink-0">
                        {isExpanded
                          ? <ChevronDown className="w-3 h-3" />
                          : <ChevronRight className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                  {isExpanded && cals.map(cal => {
                    const calChecked = selectedOriginatingCalendars.includes(cal);
                    return (
                      <label key={cal}
                        className={`flex items-center gap-2 pl-8 pr-2 py-1 rounded-lg cursor-pointer text-xs select-none transition-colors ${calChecked ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50 text-gray-500'}`}
                        style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        <input type="checkbox" checked={calChecked}
                          onChange={() => handleOrigCalToggle(cal)}
                          disabled={searching || scraping}
                          className="accent-blue-500 w-3 h-3 shrink-0"
                        />
                        {cal}
                      </label>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event Host filter */}
      {uniqueSources.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Event Host
              {selectedSources.length > 0 && (
                <span className="normal-case font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full text-[10px]">
                  {selectedSources.length}
                </span>
              )}
            </p>
            {selectedSources.length > 0 && (
              <button type="button"
                onClick={() => { setSelectedSources([]); applyFilters(allEvents, searchQuery, dateFrom, dateTo, [], selectedCategories, selectedOriginatingCalendars, sortBy); }}
                className="text-[11px] text-gray-400 hover:text-red-500 transition-colors">
                Clear
              </button>
            )}
          </div>
          <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#E5E7EB #F9FAFB' }}>
            {uniqueSources.map(source => (
              <label key={source}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-xs select-none transition-colors ${selectedSources.includes(source) ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50 text-gray-600'}`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <input type="checkbox" checked={selectedSources.includes(source)}
                  onChange={() => handleSourceToggle(source)}
                  disabled={searching || scraping}
                  className="accent-blue-500 w-3.5 h-3.5 shrink-0 cursor-pointer"
                />
                {source}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Clear all */}
      {hasActiveFilters && (
        <motion.button
          type="button"
          onClick={handleClearFilters}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl border-2 border-gray-200 hover:border-red-300 transition-all duration-150"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <X className="w-3.5 h-3.5" />
          Clear All Filters
        </motion.button>
      )}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-x-hidden">
      <AnimatedBackground />

      {/* ── Setup overlay (checking / initializing / scraping) ── */}
      <ScrapingLoader
        isOpen={isSetupActive}
        onClose={() => {}}
        status={setupPhase as 'checking' | 'initializing' | 'scraping'}
        progress={setupProgress}
        currentSource={scrapeProgress.currentSource}
        message={
          setupPhase === 'scraping' && scrapeProgress.total > 0
            ? `${scrapeProgress.current} / ${scrapeProgress.total} sources`
            : undefined
        }
      />

      {/* ── Manual scrape modal ── */}
      <ScrapingLoader
        isOpen={showScrapeModal}
        onClose={() => setShowScrapeModal(false)}
        status={scrapeModalStatus}
        progress={scrapeModalProgress}
        currentSource={scrapeModalSource}
        eventsFound={scrapeModalStatus === 'success' ? events.length : 0}
        message={
          scrapeModalStatus === 'success' ? 'Successfully scraped new events!' :
          scrapeModalStatus === 'error' ? 'Failed to scrape. Please try again.' : undefined
        }
      />

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Brand */}
            <motion.div
              className="flex items-center gap-3 min-w-0"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <h1
                  className="text-xl sm:text-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent truncate"
                  style={{ fontFamily: 'Montserrat, var(--font-montserrat, sans-serif)', fontWeight: 800 }}
                >
                  UIUC Event Scraper
                </h1>
                <p className="text-[11px] text-gray-400 hidden sm:block whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  · Discover events at UIUC
                </p>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex items-center gap-2 shrink-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            >
              <Link
                href="/sources"
                className="hidden sm:inline-flex items-center gap-2 bg-white border-2 border-blue-200 text-blue-600 px-4 py-2 rounded-full text-sm shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-200 font-semibold"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Manage Sources
              </Link>
              <motion.button
                onClick={handleScrapeClick}
                disabled={scraping || loading}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.4 }}
                />
                <Sparkles className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{scraping ? 'Scraping…' : 'Scrape Events'}</span>
              </motion.button>

            </motion.div>
          </div>
        </div>
      </header>

      {/* ── Search bar ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative flex gap-2 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events by topic, keyword, or description…"
                  disabled={searching || scraping}
                  className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-0 focus:border-blue-400 transition-all duration-200 disabled:opacity-60"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                />
              </div>
              <motion.button
                type="submit"
                disabled={searching || scraping}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 relative overflow-hidden group whitespace-nowrap"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.4 }}
                />
                <span className="relative z-10">{searching ? 'Searching…' : 'Search'}</span>
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* ── Main layout ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-20">
            {renderSidebar()}
          </aside>

          {/* ── Mobile filters (inline, between search and results) ── */}
          <div className="lg:hidden w-full">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(prev => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm mb-3"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <SlidersHorizontal className="w-4 h-4 text-blue-500" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {[
                      selectedCategories.length,
                      selectedOriginatingCalendars.length,
                      selectedSources.length,
                      dateFrom ? 1 : 0,
                      dateTo ? 1 : 0,
                    ].reduce((a, b) => a + b, 0)}
                  </span>
                )}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileFiltersOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {mobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-4 overflow-hidden"
              >
                {renderSidebar()}
              </motion.div>
            )}
          </div>

          {/* ── Events list ── */}
          <div className="flex-1 min-w-0">

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <div className="w-10 h-10 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin mb-4" />
                <p className="text-sm font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {scraping ? 'Scraping events…' : 'Loading events…'}
                </p>
              </div>
            ) : (
              <>
                {/* Results bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      <span className="font-bold text-gray-800">
                        {events.length}
                      </span>
                      <span className="text-gray-400"> / </span>
                      <span className="font-semibold text-gray-600">{allEvents.length}</span>
                      <span className="ml-1 text-gray-400">events</span>
                    </p>
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        <Search className="w-3 h-3" />
                        &ldquo;{searchQuery}&rdquo;
                      </span>
                    )}
                    {selectedCategories.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'}
                      </span>
                    )}
                    {selectedOriginatingCalendars.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {selectedOriginatingCalendars.length} source{selectedOriginatingCalendars.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {selectedSources.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {selectedSources.length} host{selectedSources.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {(dateFrom || dateTo) && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {dateFrom && dateTo ? `${dateFrom} → ${dateTo}` : dateFrom ? `From ${dateFrom}` : `Until ${dateTo}`}
                      </span>
                    )}
                  </div>

                  {/* Sort tabs — always visible; Relevance enabled only when searching */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 shrink-0">
                    {([
                      { value: 'relevance', label: '✦ Relevance' },
                      { value: 'date',      label: 'Date' },
                      { value: 'views',     label: 'Popular' },
                    ] as const).map(({ value, label }) => {
                      const isRelevance = value === 'relevance';
                      const disabled = isRelevance && !searchQuery.trim();
                      return (
                        <button
                          key={value}
                          onClick={() => {
                            if (disabled) return;
                            setSortBy(value);
                            sendGAEvent('event', 'sort_change', { sort_by: value });
                            applyFilters(allEvents, searchQuery, dateFrom, dateTo, selectedSources, selectedCategories, selectedOriginatingCalendars, value);
                          }}
                          title={disabled ? 'Enter a search query first' : undefined}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                            disabled
                              ? 'text-gray-300 cursor-not-allowed'
                              : sortBy === value
                                ? 'bg-white text-blue-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 cursor-pointer'
                          }`}
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Event cards */}
                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event, idx) => (
                      <EventCard
                        key={event.id}
                        href={`/events/${event.id}`}
                        title={event.title}
                        dateTimeStr={formatTimeRange(event)}
                        location={event.location || undefined}
                        description={event.description || undefined}
                        source={event.source_name}
                        category={event.category}
                        accentColor={getAccentColor(event.category)}
                        index={idx}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 border border-gray-200">
                      <Search className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="font-bold text-gray-700 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>No events found</p>
                    <p className="text-sm text-gray-400 max-w-xs leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Try adjusting your search or filters. On a fresh install, click{' '}
                      <span className="font-semibold text-blue-500">Scrape Events</span> to load upcoming events.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F9FAFB; border-radius: 3px; }
        ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}</style>
    </div>
  );
}
