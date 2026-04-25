'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, ExternalLink, ArrowLeft, Share2, Users, Tag, Globe, Mail } from 'lucide-react';
import { AnimatedBackground } from '../../components/AnimatedBackground';
import { sendGAEvent } from '@next/third-parties/google';
import { generateCategoryColorsMap } from '../../lib/categoryColors';

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

const FF = 'Montserrat, var(--font-montserrat, sans-serif)';

export default function EventDetail() {
  const pathname = usePathname();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => { loadEvent(); }, [pathname]);

  const loadEvent = async () => {
    setLoading(true);
    try {
      const parts = pathname.split('/');
      const eventId = parseInt(parts[parts.length - 1]);
      if (isNaN(eventId)) { setError(`Invalid event ID`); setLoading(false); return; }
      const res = await fetch(`/api/events/${eventId}`);
      if (res.status === 404) { setError(`Event not found`); setLoading(false); return; }
      if (!res.ok) { setError('Failed to load event'); setLoading(false); return; }
      setEvent(await res.json());
      setError('');
    } catch (err) {
      setError('Failed to load event: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
    setLoading(false);
  };

  const parseLocalDate = (d: string) => {
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, m - 1, day);
  };

  const formatDate = (d: string) =>
    parseLocalDate(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const formatTimeRange = (e: Event) => {
    const sameDay = !e.end_date || e.end_date === e.start_date;
    if (!sameDay) return `${formatDate(e.start_date)} – ${formatDate(e.end_date)}`;
    if (!e.start_time) return 'All Day';
    return e.end_time ? `${e.start_time} – ${e.end_time}` : e.start_time;
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const getAccentColor = (category: string) => {
    if (!category) return '#6366f1';
    const map = generateCategoryColorsMap([category]);
    return map[category] || '#6366f1';
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <AnimatedBackground />
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-semibold" style={{ fontFamily: FF }}>
              <ArrowLeft className="w-4 h-4" /> Back to Events
            </Link>
          </div>
        </header>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium" style={{ fontFamily: FF }}>Loading event…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <AnimatedBackground />
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-semibold" style={{ fontFamily: FF }}>
              <ArrowLeft className="w-4 h-4" /> Back to Events
            </Link>
          </div>
        </header>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <p className="text-red-500 font-semibold" style={{ fontFamily: FF }}>{error || 'Event not found'}</p>
            <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline text-sm" style={{ fontFamily: FF }}>← Return to events list</Link>
          </div>
        </div>
      </div>
    );
  }

  const accentColor = getAccentColor(event.category);

  // Parse source links
  let sourceLinks: Array<{ name: string; url: string }> = [];
  try { sourceLinks = JSON.parse(event.source_links || '[]'); } catch {}
  if (sourceLinks.length === 0 && event.url) sourceLinks = [{ name: event.source_name, url: event.url }];

  const sameDay = !event.end_date || event.end_date === event.start_date;

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      <AnimatedBackground />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors text-sm font-semibold group"
            style={{ fontFamily: FF }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Events
          </Link>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-50 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                title="Copy link"
              >
                <Share2 className="w-4 h-4 text-gray-500" />
              </button>
              <AnimatePresence>
                {copied && (
                  <motion.span
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Copied!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            {sourceLinks.length > 0 && (
              <a
                href={sourceLinks[0].url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sendGAEvent('event', 'original_link_click', { title: event.title, url: sourceLinks[0].url })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:opacity-90 relative overflow-hidden group"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, fontFamily: FF }}
              >
                <span>View Original</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ── Left/Main column ── */}
          <div className="md:col-span-2 space-y-5">

            {/* Hero card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Accent top bar */}
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${accentColor}, ${accentColor}60)` }} />

              <div className="p-6 sm:p-8">
                {/* Category + source */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold uppercase"
                    style={{ backgroundColor: `${accentColor}18`, color: accentColor, fontFamily: FF }}
                  >
                    {event.category}
                  </span>
                  <span className="text-xs text-gray-400 font-medium" style={{ fontFamily: FF }}>
                    via {event.source_name}
                  </span>
                </div>

                {/* Title */}
                <h1
                  className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-5"
                  style={{ fontFamily: FF }}
                >
                  {event.title}
                </h1>

                {/* Meta grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}15` }}>
                      <Calendar className="w-5 h-5" style={{ color: accentColor }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5" style={{ fontFamily: FF }}>Date</p>
                      <p className="text-sm text-gray-800 font-medium" style={{ fontFamily: FF }}>{formatDate(event.start_date)}</p>
                      {!sameDay && <p className="text-xs text-gray-500" style={{ fontFamily: FF }}>– {formatDate(event.end_date)}</p>}
                    </div>
                  </div>

                  {event.start_time && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}15` }}>
                        <Clock className="w-5 h-5" style={{ color: accentColor }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5" style={{ fontFamily: FF }}>Time</p>
                        <p className="text-sm text-gray-800 font-medium" style={{ fontFamily: FF }}>{formatTimeRange(event)}</p>
                      </div>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}15` }}>
                        <MapPin className="w-5 h-5" style={{ color: accentColor }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5" style={{ fontFamily: FF }}>Location</p>
                        <p className="text-sm text-gray-800 font-medium" style={{ fontFamily: FF }}>{event.location}</p>
                      </div>
                    </div>
                  )}

                  {event.views > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}15` }}>
                        <Users className="w-5 h-5" style={{ color: accentColor }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5" style={{ fontFamily: FF }}>Views</p>
                        <p className="text-sm text-gray-800 font-medium" style={{ fontFamily: FF }}>{event.views.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA links */}
                {sourceLinks.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {sourceLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sendGAEvent('event', 'original_link_click', { title: event.title, url: link.url })}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md hover:shadow-lg hover:opacity-90 transition-all relative overflow-hidden group"
                        style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`, fontFamily: FF }}
                      >
                        <span>{sourceLinks.length === 1 ? 'View Original Event' : link.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: FF }}>About This Event</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm" style={{ fontFamily: FF }}>
                  {event.description}
                </p>
              </div>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-4">

            {/* Details card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide" style={{ fontFamily: FF }}>Event Details</h3>
              <div className="space-y-3">
                {[
                  event.source_name && { label: 'Source', value: event.source_name, icon: Globe },
                  event.originating_calendar && event.originating_calendar !== event.source_name
                    && { label: 'Calendar', value: event.originating_calendar, icon: Calendar },
                  event.sponsor && { label: 'Sponsor', value: event.sponsor, icon: Tag },
                  event.contact && { label: 'Contact', value: event.contact, icon: Users },
                  event.contact_email && { label: 'Email', value: event.contact_email, icon: Mail, isEmail: true },
                ].filter(Boolean).map((item: any, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <item.icon className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5" style={{ fontFamily: FF }}>{item.label}</p>
                      {item.isEmail ? (
                        <a href={`mailto:${item.value}`} className="text-xs text-blue-600 hover:underline break-all" style={{ fontFamily: FF }}>{item.value}</a>
                      ) : (
                        <p className="text-xs text-gray-700 font-medium break-words" style={{ fontFamily: FF }}>{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Source link card */}
            {sourceLinks.length > 0 && (
              <a
                href={sourceLinks[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1" style={{ fontFamily: FF }}>Original Source</p>
                    <p className="text-sm font-semibold group-hover:text-blue-600 transition-colors" style={{ color: accentColor, fontFamily: FF }}>
                      Visit Source →
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
