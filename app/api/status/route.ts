import { NextResponse } from 'next/server';
import { getSources, getUpcomingEvents } from '../../lib/db';
import { scrapeState } from '../../lib/scraper';

export async function GET() {
  try {
    const sources = getSources.all();
    const today = new Date().toISOString().slice(0, 10);
    const events = getUpcomingEvents.all(today);
    return NextResponse.json({
      initialized: sources.length > 0,
      sourceCount: sources.length,
      eventCount: events.length,
      scrape: { ...scrapeState },
    });
  } catch {
    return NextResponse.json({
      initialized: false,
      sourceCount: 0,
      eventCount: 0,
      scrape: { running: false, current: 0, total: 0, currentSource: '', completedAt: 0 },
    });
  }
}
