'use client';
import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';
import { sendGAEvent } from '@next/third-parties/google';

interface EventCardProps {
  href: string;
  title: string;
  dateTimeStr: string;
  location?: string;
  description?: string;
  source: string;
  category: string;
  accentColor: string;
  index: number;
}

export function EventCard({
  href,
  title,
  dateTimeStr,
  location,
  description,
  source,
  category,
  accentColor,
}: EventCardProps) {
  return (
    <Link href={href} className="block group" onClick={() => sendGAEvent('event', 'event_view', { title, category, source })}>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative">
        {/* Left accent strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1 shrink-0" style={{ backgroundColor: accentColor }} />

        {/* Hover tint overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${accentColor}0f, transparent 60%)` }}
        />

        <div className="p-5 pl-6 relative">
          {/* Category badge */}
          <span
            className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentColor,
              fontFamily: 'Montserrat, var(--font-montserrat, sans-serif)',
            }}
          >
            {category}
          </span>

          {/* Title */}
          <h2
            className="text-[15px] font-bold leading-snug mb-3 pr-24 text-slate-900 group-hover:text-[var(--accent)] transition-colors duration-200"
            style={{
              fontFamily: 'Montserrat, var(--font-montserrat, sans-serif)',
              ['--accent' as string]: accentColor,
            }}
          >
            {title}
          </h2>

          {/* Date / time */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
            <span>{dateTimeStr}</span>
          </div>

          {/* Location */}
          {location && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accentColor }} />
              <span className="truncate">{location}</span>
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span
              className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full truncate max-w-[60%] font-medium"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {source}
            </span>
            <span
              className="text-xs font-bold group-hover:translate-x-0.5 transition-transform duration-150"
              style={{ color: accentColor, fontFamily: 'Montserrat, sans-serif' }}
            >
              View Details →
            </span>
          </div>
        </div>

        {/* Animated bottom bar */}
        <div
          className="h-0.5 w-0 group-hover:w-full transition-all duration-300 ease-out"
          style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, ${accentColor}55)` }}
        />
      </div>
    </Link>
  );
}
