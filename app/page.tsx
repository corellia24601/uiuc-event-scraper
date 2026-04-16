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
      
      // Extract unique sources
      const sources = Array.from(new Set(eventArray.map(e => e.source_name))).sort();
      setUniqueSources(sources);
      
      // Apply filters
      applyFilters(eventArray, '', dateFrom, dateTo, selectedSources);
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
    sources: string[]
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

    // Apply date range filter
    if (from) {
      filtered = filtered.filter(e => e.start_date >= from);
    }
    if (to) {
      filtered = filtered.filter(e => e.start_date <= to);
    }

    // Apply source filter
    if (sources.length > 0) {
      filtered = filtered.filter(e => sources.includes(e.source_name));
    }

    setEvents(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(allEvents, searchQuery, dateFrom, dateTo, selectedSources);
  };

  const handleDateFromChange = (newDate: string) => {
    setDateFrom(newDate);
    applyFilters(allEvents, searchQuery, newDate, dateTo, selectedSources);
  };

  const handleDateToChange = (newDate: string) => {
    setDateTo(newDate);
    applyFilters(allEvents, searchQuery, dateFrom, newDate, selectedSources);
  };

  const handleSourceToggle = (source: string) => {
    const newSources = selectedSources.includes(source)
      ? selectedSources.filter(s => s !== source)
      : [...selectedSources, source];
    setSelectedSources(newSources);
    applyFilters(allEvents, searchQuery, dateFrom, dateTo, newSources);
  };

  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSelectedSources([]);
    setSearchQuery('');
    applyFilters(allEvents, '', '', '', []);
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

  const formatDate = (dateStr: string, timeStr?: string) => {
    // Parse YYYY-MM-DD as local date, not UTC
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    return timeStr ? `${formatted} at ${timeStr}` : formatted;
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
                  applyFilters(allEvents, searchQuery, dateFrom, dateTo, newSources);
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

          {/* Clear Filters Button */}
          {(dateFrom || dateTo || selectedSources.length > 0 || searchQuery) && (
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
                    Filters active: {searchQuery && `Search: "${searchQuery}"${dateFrom || dateTo || selectedSources.length > 0 ? ', ' : ''}`}
                    {dateFrom && `From ${dateFrom}${dateTo || selectedSources.length > 0 ? ', ' : ''}`}
                    {dateTo && `To ${dateTo}${selectedSources.length > 0 ? ', ' : ''}`}
                    {selectedSources.length > 0 && `${selectedSources.length} host(s) selected`}
                  </span>
                )}
              </p>
            </div>

            <div className="grid gap-6">
            {events && events.length > 0 ? (
              events.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {event.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{event.description}</p>
                    <div className="text-sm text-gray-500 mb-2">
                      <strong>Start:</strong> {formatDate(event.start_date, event.start_time)}
                      {event.end_date && event.end_date !== event.start_date && (
                        <> <strong>End:</strong> {formatDate(event.end_date, event.end_time)}</>
                      )}
                      {event.end_time && event.end_date === event.start_date && (
                        <> <strong>to</strong> {event.end_time}</>
                      )}
                    </div>
                    {event.location && (
                      <div className="text-sm text-gray-500 mb-2">
                        <strong>Location:</strong> {event.location}
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mb-4">
                      <strong>Source:</strong> {event.source_name}
                    </div>
                    <div className="text-blue-600 hover:text-blue-800 font-medium">
                      View Details →
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
