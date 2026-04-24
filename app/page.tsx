'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { sendGAEvent } from '@next/third-parties/google';

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

  // Exact full phrase
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
  const [semanticReady, setSemanticReady] = useState(false);

  const [setupPhase, setSetupPhase] = useState<SetupPhase>('checking');
  const [initProgress, setInitProgress] = useState(0);
  const [scrapeProgress, setScrapeProgress] = useState<ScrapeProgress>({ running: false, current: 0, total: 0, currentSource: '' });
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
        } catch { /* ignore transient errors */ }
      }, 1500);
    }

    checkAndSetup();
    return () => {
      clearTimeout(animFrame);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async (query: string = '') => {
    setSearching(true);
    setLoading(true);
    try {
      const url = query.trim()
        ? `/api/events?q=${encodeURIComponent(query)}`
        : '/api/events';
      const response = await fetch(url);
      if (!response.ok) {
        console.error('API error:', response.status);
        setAllEvents([]);
        setEvents([]);
        return;
      }
      const data = await response.json();
      const eventArray = Array.isArray(data) ? data : [];
      setAllEvents(eventArray);

      // Extract unique source names for Event Host filter
      const sources = Array.from(new Set(eventArray.map((e: Event) => e.source_name))).sort() as string[];
      setUniqueSources(sources);

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

      // Build display-label → real source names map, applying merge rules for Colleges & Schools
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
          // Unmerged sources keep their own name
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

  const applyFilters = (
    eventsToFilter: Event[],
    search: string,
    from: string,
    to: string,
    sources: string[],
    categories: string[],
    origCals: string[],
    sort: 'date' | 'views' | 'relevance'
  ) => {
    let filtered = eventsToFilter;
    let relevanceScores: Map<number, number> | null = null;

    if (search.trim()) {
      const queryLower = search.trim().toLowerCase();
      const terms = queryLower.split(/\s+/).filter(t => t.length >= 2);

      const scored = filtered.map(e => {
        const kw = scoreEvent(e, terms, queryLower);
        const sem = semanticScores.get(e.id) ?? 0;
        // Normalise keyword score to 0–1 (cap at 300), blend 40% kw + 60% semantic
        const kwNorm = Math.min(kw, 300) / 300;
        const combined = sem * 60 + kwNorm * 40;
        return { event: e, kw, sem, combined };
      }).filter(r => r.kw > 0 || r.sem >= 0.3);  // include if keyword OR semantic match

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

    // Event Category filter: expand merged display labels to real source names, then OR
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
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();

    if (!q) {
      setSemanticScores(new Map());
      setSemanticReady(false);
      applyFilters(allEvents, '', dateFrom, dateTo, selectedSources, selectedCategories, selectedOriginatingCalendars, sortBy);
      return;
    }

    setSearching(true);

    // Fetch semantic scores from Cohere in parallel with keyword filtering
    let semScores = new Map<number, number>();
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json() as { id: number; score: number }[];
        semScores = new Map(data.map(r => [r.id, r.score]));
      }
    } catch {
      // Non-fatal: fall back to keyword-only
    }

    setSemanticScores(semScores);
    setSemanticReady(true);
    setSearching(false);
    sendGAEvent('event', 'search', { search_term: q, semantic_hits: semScores.size });
    applyFilters(allEvents, q, dateFrom, dateTo, selectedSources, selectedCategories, selectedOriginatingCalendars, sortBy);
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
    // 'relevance' option disappears when query is cleared — no stale sort state
  };

  const handleScrape = async () => {
    setScraping(true);
    setScrapStatus('Starting scrape...');
    try {
      const response = await fetch('/api/scrape', { method: 'POST' });
      if (response.ok) {
        setScrapStatus('Scrape completed! Loading events...');
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchEvents();
      } else {
        setScrapStatus('Scrape failed. Check console for details.');
      }
    } catch (error) {
      setScrapStatus('Error during scrape: ' + (error instanceof Error ? error.message : 'Unknown error'));
      console.error('Scrape error:', error);
    } finally {
      setScraping(false);
      setTimeout(() => setScrapStatus(''), 2000);
    }
  };

  const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (dateStr: string) => {
    return parseLocalDate(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
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

  const categoryFilterCount = selectedCategories.length + selectedOriginatingCalendars.length;

  // ── Setup / loading screens ──────────────────────────────────────────────
  if (setupPhase === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl animate-spin mb-4">⏳</div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (setupPhase === 'initializing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7M9 11h6M12 8v6"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Initializing Event Source Pool</h2>
            <p className="text-sm text-gray-500">Loading 30+ UIUC event sources...</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-orange-500 transition-all duration-200 ease-out"
              style={{ width: `${initProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{initProgress}%</p>
        </div>
      </div>
    );
  }

  if (setupPhase === 'scraping') {
    const pct = scrapeProgress.total > 0
      ? Math.round((scrapeProgress.current / scrapeProgress.total) * 100)
      : 0;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 15A9 9 0 1 0 4.582 9"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Scraping Events</h2>
            <p className="text-sm text-gray-500 min-h-[1.25rem]">
              {scrapeProgress.currentSource
                ? `Fetching: ${scrapeProgress.currentSource}...`
                : 'Starting up...'}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {scrapeProgress.total > 0
              ? `${scrapeProgress.current} / ${scrapeProgress.total} sources  ·  ${pct}%`
              : 'Preparing sources...'}
          </p>
          <p className="text-xs text-gray-400 mt-4">This takes 3–5 minutes on first run.</p>
        </div>
      </div>
    );
  }

  // ── Normal events feed ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">UIUC Event Scraper</h1>
            <div className="flex space-x-4">
              <Link
                href="/sources"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Manage Sources
              </Link>
              <button
                onClick={handleScrape}
                disabled={scraping || loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {scraping ? (
                  <>
                    <span className="inline-block animate-spin">⏳</span>
                    Scraping...
                  </>
                ) : (
                  'Scrape Events'
                )}
              </button>
            </div>
          </div>
          {scrapStatus && (
            <div className={`mt-3 text-sm ${scrapStatus.includes('failed') || scrapStatus.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {scrapStatus}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSearch} className="mb-8">
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              disabled={searching || scraping}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-white text-black placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={searching || scraping}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {searching ? (
                <>
                  <span className="inline-block animate-spin">⏳</span>
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>

          {/* Date Range + Sort By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                {dateFrom && (
                  <button type="button" onClick={() => handleDateFromChange('')}
                    className="text-xs text-gray-400 hover:text-red-500">
                    Clear ×
                  </button>
                )}
              </div>
              <input
                type="date" lang="en-US" value={dateFrom}
                onChange={(e) => handleDateFromChange(e.target.value)}
                disabled={searching || scraping}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">End Date</label>
                {dateTo && (
                  <button type="button" onClick={() => handleDateToChange('')}
                    className="text-xs text-gray-400 hover:text-red-500">
                    Clear ×
                  </button>
                )}
              </div>
              <input
                type="date" lang="en-US" value={dateTo}
                onChange={(e) => handleDateToChange(e.target.value)}
                disabled={searching || scraping}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  const newSort = e.target.value as 'date' | 'views' | 'relevance';
                  setSortBy(newSort);
                  sendGAEvent('event', 'sort_change', { sort_by: newSort });
                  applyFilters(allEvents, searchQuery, dateFrom, dateTo, selectedSources, selectedCategories, selectedOriginatingCalendars, newSort);
                }}
                disabled={searching || scraping}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="date">Date (Earliest First)</option>
                <option value="views">Views (Most Popular First)</option>
                {searchQuery.trim() && <option value="relevance">Relevance</option>}
              </select>
            </div>
          </div>

          {/* Event Host + Event Category — checkbox filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Event Host */}
            {uniqueSources.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Event Host
                    <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {uniqueSources.length}
                    </span>
                    {selectedSources.length > 0 && (
                      <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {selectedSources.length} selected
                      </span>
                    )}
                  </label>
                  {selectedSources.length > 0 && (
                    <button type="button"
                      onClick={() => { setSelectedSources([]); applyFilters(allEvents, searchQuery, dateFrom, dateTo, [], selectedCategories, selectedOriginatingCalendars, sortBy); }}
                      className="text-xs text-gray-400 hover:text-red-500">
                      Clear ×
                    </button>
                  )}
                </div>
                <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto bg-white divide-y divide-gray-100">
                  {uniqueSources.map(source => (
                    <label key={source}
                      className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm select-none transition-colors ${selectedSources.includes(source) ? 'bg-blue-50 text-blue-800' : 'hover:bg-gray-50 text-gray-800'}`}>
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(source)}
                        onChange={() => handleSourceToggle(source)}
                        disabled={searching || scraping}
                        className="accent-blue-600 w-4 h-4 shrink-0"
                      />
                      {source}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">Check one or more hosts to filter</p>
              </div>
            )}

            {/* Event Category (hierarchical) */}
            {Object.keys(categoryCalendars).length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category
                    <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {Object.values(categoryCalendars).reduce((sum, arr) => sum + arr.length, 0)}
                    </span>
                    {categoryFilterCount > 0 && (
                      <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {categoryFilterCount} selected
                      </span>
                    )}
                  </label>
                  {categoryFilterCount > 0 && (
                    <button type="button"
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedOriginatingCalendars([]);
                        applyFilters(allEvents, searchQuery, dateFrom, dateTo, selectedSources, [], [], sortBy);
                      }}
                      className="text-xs text-gray-400 hover:text-red-500">
                      Clear ×
                    </button>
                  )}
                </div>
                <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto bg-white divide-y divide-gray-100">
                  {Object.keys(categoryCalendars).sort().map(cat => {
                    const cals = categoryCalendars[cat];
                    const isExpanded = expandedCategories.has(cat);
                    const catChecked = selectedCategories.includes(cat);

                    return (
                      <div key={cat}>
                        {/* Primary row */}
                        <div className={`flex items-center gap-2 px-3 py-2 ${catChecked ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                          <input
                            type="checkbox"
                            checked={catChecked}
                            onChange={() => handleCategoryToggle(cat)}
                            disabled={searching || scraping}
                            className="accent-blue-600 w-4 h-4 shrink-0"
                          />
                          <span
                            className={`flex-1 text-sm cursor-pointer select-none flex items-center gap-1.5 ${catChecked ? 'text-blue-800 font-medium' : 'text-gray-800'}`}
                            onClick={() => handleCategoryToggle(cat)}
                          >
                            {cat}
                            {cals.length > 0 && (
                              <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full font-normal">
                                {cals.length}
                              </span>
                            )}
                          </span>
                          {cals.length > 0 && (
                            <button
                              type="button"
                              onClick={() => toggleCategoryExpand(cat)}
                              className="text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center rounded text-xs shrink-0"
                            >
                              {isExpanded ? '▼' : '▶'}
                            </button>
                          )}
                        </div>

                        {/* Secondary rows — originating calendars */}
                        {isExpanded && cals.map(cal => {
                          const calChecked = selectedOriginatingCalendars.includes(cal);
                          return (
                            <label key={cal}
                              className={`flex items-center gap-3 pl-9 pr-3 py-1.5 cursor-pointer text-sm select-none transition-colors border-t border-gray-50 ${calChecked ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-500'}`}>
                              <input
                                type="checkbox"
                                checked={calChecked}
                                onChange={() => handleOrigCalToggle(cal)}
                                disabled={searching || scraping}
                                className="accent-blue-600 w-4 h-4 shrink-0"
                              />
                              {cal}
                            </label>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-1">Select a category or expand ▶ to filter by specific source</p>
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          {(dateFrom || dateTo || selectedSources.length > 0 || categoryFilterCount > 0 || sortBy !== 'date' || searchQuery) && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {searching && (
            <div className="flex items-center gap-2 text-blue-600">
              <span className="inline-block animate-spin text-lg">○</span>
              <span>Searching events...</span>
            </div>
          )}
        </form>

        {loading ? (
          <div className="text-center py-12 text-gray-600">
            <div className="inline-block">
              <div className="animate-spin text-3xl mb-2">⏳</div>
              <p>{scraping ? 'Scraping events...' : 'Loading events...'}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6 text-sm text-gray-600">
              <p>
                Showing <span className="font-semibold text-gray-900">{events.length}</span> of{' '}
                <span className="font-semibold text-gray-900">{allEvents.length}</span> events
                {(dateFrom || dateTo || selectedSources.length > 0 || categoryFilterCount > 0 || searchQuery) && (
                  <span className="block mt-2">
                    Filters active:{' '}
                    {[
                      searchQuery && `Search: "${searchQuery}"`,
                      dateFrom && `From ${dateFrom}`,
                      dateTo && `To ${dateTo}`,
                      selectedSources.length > 0 && `${selectedSources.length} host(s)`,
                      selectedCategories.length > 0 && `${selectedCategories.length} categor${selectedCategories.length === 1 ? 'y' : 'ies'}`,
                      selectedOriginatingCalendars.length > 0 && `${selectedOriginatingCalendars.length} calendar(s)`,
                      sortBy === 'views' && 'Sorted by views',
                    ].filter(Boolean).join(', ')}
                  </span>
                )}
              </p>
            </div>

            <div className="grid gap-6">
            {events && events.length > 0 ? (
              events.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 leading-snug">{event.title}</h3>
                      <span className="shrink-0 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                        {event.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                      <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span className="font-medium">{formatTimeRange(event)}</span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                        <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                          <circle cx="12" cy="9" r="2.5"/>
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    )}

                    {event.description && (
                      <p className="text-sm text-gray-500 mt-2 mb-3 line-clamp-2">{event.description}</p>
                    )}

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">{event.source_name}</span>
                      <span className="text-sm text-blue-600 hover:text-blue-800 font-medium">View Details →</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No events found. Initialize sources and click "Scrape Events" to load upcoming events, or adjust your search.
              </div>
            )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
