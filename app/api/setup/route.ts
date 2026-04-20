import { NextResponse } from 'next/server';
import { getSources, insertSource } from '../../lib/db';
import { initialSources } from '../../lib/sources';
import { runScrape, scrapeState } from '../../lib/scraper';

export async function POST() {
  try {
    // Upsert all sources from initialSources so new entries added to sources.ts
    // are synced into the database on every setup call, not only on first init.
    for (const source of initialSources) {
      insertSource.run(source.id, source.category, source.name, source.url, source.notes || '', source.active);
    }

    // Fire scrape in background if not already running
    if (!scrapeState.running) {
      runScrape().catch((err) => console.error('[Setup] Scrape failed:', err));
    }

    return NextResponse.json({ started: true });
  } catch (error) {
    console.error('[Setup] Error:', error);
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 });
  }
}
