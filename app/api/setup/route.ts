import { NextResponse } from 'next/server';
import { getSources, insertSource } from '../../lib/db';
import { initialSources } from '../../lib/sources';
import { runScrape, scrapeState } from '../../lib/scraper';

export async function POST() {
  try {
    // Initialize sources if not already done
    const existing = getSources.all();
    if (existing.length === 0) {
      for (const source of initialSources) {
        insertSource.run(source.id, source.category, source.name, source.url, source.notes || '', source.active);
      }
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
