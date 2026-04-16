'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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

export default function EventDetail() {
  const pathname = usePathname();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvent();
  }, [pathname]);

  const loadEvent = async () => {
    setLoading(true);
    try {
      // Extract event ID from pathname: /events/4208 -> 4208
      const pathParts = pathname.split('/');
      const eventIdStr = pathParts[pathParts.length - 1];
      const eventId = parseInt(eventIdStr);

      if (isNaN(eventId)) {
        setError(`Invalid event ID: ${eventIdStr}`);
        setLoading(false);
        return;
      }

      // Fetch the specific event by ID
      const response = await fetch(`/api/events/${eventId}`);
      if (response.status === 404) {
        setError(`Event #${eventId} not found`);
        setLoading(false);
        return;
      }
      if (!response.ok) {
        setError('Failed to load event');
        setLoading(false);
        return;
      }
      const event: Event = await response.json();
      setEvent(event);
      setError('');
    } catch (err) {
      setError('Failed to load event: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error(err);
    }
    setLoading(false);
  };

  const formatDate = (dateStr: string, timeStr?: string) => {
    // Parse YYYY-MM-DD as local date, not UTC
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    return timeStr ? `${formatted} at ${timeStr}` : formatted;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Events
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-8">Loading event...</div>
        </main>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Events
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-8 text-red-600">{error || 'Event not found'}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Events
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>
            <span className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
              {event.category}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Start Date & Time</h3>
                  <p className="mt-2 text-lg text-gray-900">{formatDate(event.start_date, event.start_time)}</p>
                </div>

                {event.end_date && event.end_date !== event.start_date && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">End Date & Time</h3>
                    <p className="mt-2 text-lg text-gray-900">{formatDate(event.end_date, event.end_time)}</p>
                  </div>
                )}

                {event.end_time && event.end_date === event.start_date && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">End Time</h3>
                    <p className="mt-2 text-lg text-gray-900">{event.end_time}</p>
                  </div>
                )}

                {event.location && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Location</h3>
                    <p className="mt-2 text-lg text-gray-900">{event.location}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Event Source</h3>
                  <p className="mt-2 text-lg text-gray-900">{event.source_name}</p>
                </div>

                {event.originating_calendar && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Originating Calendar</h3>
                    <p className="mt-2 text-lg text-gray-900">{event.originating_calendar}</p>
                  </div>
                )}

                {event.sponsor && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Sponsor</h3>
                    <p className="mt-2 text-lg text-gray-900">{event.sponsor}</p>
                  </div>
                )}

                {event.contact && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact</h3>
                    <p className="mt-2 text-lg text-gray-900">
                      {event.contact}
                      {event.contact_email && (
                        <> · <a href={`mailto:${event.contact_email}`} className="text-blue-600 hover:underline">{event.contact_email}</a></>
                      )}
                    </p>
                  </div>
                )}

                {event.views > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Views</h3>
                    <p className="mt-2 text-lg text-gray-900">{event.views.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {event.description || 'No description available'}
                </p>
              </div>
            </div>
          </div>

          {(() => {
            let links: Array<{ name: string; url: string }> = [];
            try { links = JSON.parse(event.source_links || '[]'); } catch {}
            if (links.length === 0 && event.url) links = [{ name: event.source_name, url: event.url }];
            if (links.length === 0) return null;
            return (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  {links.length === 1 ? 'Original Event' : 'Original Event Sources'}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-medium text-sm"
                    >
                      {links.length === 1 ? 'View Original Event →' : `${link.name} →`}
                    </a>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </main>
    </div>
  );
}
