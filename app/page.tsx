'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  const [selectedOriginatingCalendars, setSelectedOriginatingCalendars] = useState<string[]>([]);
  const [uniqueOriginatingCalendars, setUniqueOriginatingCalendars] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'views'>('date');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents('');
    }, 100);
    return () => clearTimeout(timer);
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
      
      // Extract unique sources and originating calendars
      const sources = Array.from(new Set(eventArray.map(e => e.source_name))).sort();
      setUniqueSources(sources);
      const origCals = Array.from(
        new Set(eventArray.map(e => e.originating_calendar).filter(Boolean))
      ).sort() as string[];
      setUniqueOriginatingCalendars(origCals);

      // Apply filters
      applyFilters(eventArray, searchQuery, dateFrom, dateTo, selectedSources, selectedOriginatingCalendars, sortBy);
    } catch (error) {
      console.error('Error fetching events:', error);
      setAllEvents([]);
      setEvents([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const applyFilters = (
    eventsToFilter: Event[],
    search: string,
    from: string,
    to: string,
    sources: string[],
    origCals: string[],
    sort: 'date' | 'views'
  ) => {
    let filtered = eventsToFilter;

    // Apply search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        e =>
          e.title.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query)
      );
    }

    // Apply date range filter using overlap logic:
    // An event is included if its date range overlaps with [from, to].
    // A multi-day event (Apr 16 – Aug 10) overlaps with filter "Aug 1 – Aug 2"
    // because it hasn't ended before Aug 1 and hasn't started after Aug 2.
    if (from || to) {
      filtered = filtered.filter(e => {
        const evEnd = e.end_date || e.start_date;
        if (from && evEnd < from) return false;  // event ends before filter starts
        if (to && e.start_date > to) return false;  // event starts after filter ends
        return true;
      });
    }

    // Apply source filter
    if (sources.length > 0) {
      filtered = filtered.filter(e => sources.includes(e.source_name));
    }

    // Apply originating calendar filter
    if (origCals.length > 0) {
      filtered = filtered.filter(e => origCals.includes(e.originating_calendar));
    }

    // Sort
    if (sort === 'views') {
      filtered = [...filtered].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }

    setEvents(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(allEvents, searchQuery, dateFrom, dateTo, selectedSources, selectedOriginatingCalendars, sortBy);
  };

  const handleDateFromChange = (newDate: string) => {
    setDateFrom(newDate);
    applyFilters(allEvents, searchQuery, newDate, dateTo, selectedSources, selectedOriginatingCalendars, sortBy);
  };

  const handleDateToChange = (newDate: string) => {
    setDateTo(newDate);
    applyFilters(allEvents, searchQuery, dateFrom, newDate, selectedSources, selectedOriginatingCalendars, sortBy);
  };

  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSelectedSources([]);
    setSelectedOriginatingCalendars([]);
    setSortBy('date');
    setSearchQuery('');
    applyFilters(allEvents, '', '', '', [], [], 'date');
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

  // Parse YYYY-MM-DD as local date (avoids UTC off-by-one)
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
      // Multi-day event
      const dateRange = `${formatDate(event.start_date)} – ${formatDate(event.end_date)}`;
      return event.start_time ? `${dateRange}  ·  ${event.start_time}` : dateRange;
    }

    // Single-day event
    const datePart = formatDate(event.start_date);
    if (!event.start_time) return `${datePart}  ·  All Day`;
    const timePart = event.end_time
      ? `${event.start_time} – ${event.end_time}`
      : event.start_time;
    return `${datePart}  ·  ${timePart}`;
  };

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

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                lang="en-US"
                value={dateFrom}
                onChange={(e) => handleDateFromChange(e.target.value)}
                disabled={searching || scraping}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                lang="en-US"
                value={dateTo}
                onChange={(e) => handleDateToChange(e.target.value)}
                disabled={searching || scraping}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Host</label>
              <select
                multiple
                value={selectedSources}
                onChange={(e) => {
                  const newSources = Array.from(e.target.selectedOptions, option => option.value);
                  setSelectedSources(newSources);
                  applyFilters(allEvents, searchQuery, dateFrom, dateTo, newSources, selectedOriginatingCalendars, sortBy);
                }}
                disabled={searching || scraping || uniqueSources.length === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed h-20"
              >
                {uniqueSources.map(source => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
          </div>

          {/* Originating Calendar + Sort By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {uniqueOriginatingCalendars.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Originating Calendar</label>
                <select
                  multiple
                  value={selectedOriginatingCalendars}
                  onChange={(e) => {
                    const newCals = Array.from(e.target.selectedOptions, o => o.value);
                    setSelectedOriginatingCalendars(newCals);
                    applyFilters(allEvents, searchQuery, dateFrom, dateTo, selectedSources, newCals, sortBy);
                  }}
                  disabled={searching || scraping}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed h-24"
                >
                  {uniqueOriginatingCalendars.map(cal => (
                    <option key={cal} value={cal}>{cal}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  const newSort = e.target.value as 'date' | 'views';
                  setSortBy(newSort);
                  applyFilters(allEvents, searchQuery, dateFrom, dateTo, selectedSources, selectedOriginatingCalendars, newSort);
                }}
                disabled={searching || scraping}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="date">Date (Earliest First)</option>
                <option value="views">Views (Most Popular First)</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(dateFrom || dateTo || selectedSources.length > 0 || selectedOriginatingCalendars.length > 0 || sortBy !== 'date' || searchQuery) && (
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
                {(dateFrom || dateTo || selectedSources.length > 0 || searchQuery) && (
                  <span className="block mt-2">
                    Filters active:{' '}
                    {[
                      searchQuery && `Search: "${searchQuery}"`,
                      dateFrom && `From ${dateFrom}`,
                      dateTo && `To ${dateTo}`,
                      selectedSources.length > 0 && `${selectedSources.length} host(s)`,
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
                    {/* Title row */}
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 leading-snug">{event.title}</h3>
                      <span className="shrink-0 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                        {event.category}
                      </span>
                    </div>

                    {/* Date + time */}
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                      <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span className="font-medium">{formatTimeRange(event)}</span>
                    </div>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                        <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                          <circle cx="12" cy="9" r="2.5"/>
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    )}

                    {/* Description */}
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-2 mb-3 line-clamp-2">{event.description}</p>
                    )}

                    {/* Footer */}
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
