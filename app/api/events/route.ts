import { NextRequest, NextResponse } from 'next/server';
import { getEvents, getUpcomingEvents, searchEvents } from '../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const today = new Date().toISOString().slice(0, 10);
    let events;
    if (query && query.trim().length > 0) {
      const searchTerm = query.trim();
      events = searchEvents.all(searchTerm, searchTerm, today);
    } else {
      events = getUpcomingEvents.all(today);
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}