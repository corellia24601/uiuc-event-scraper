import { NextResponse } from 'next/server';
import { insertSource, getPermanentlyDeletedIds } from '../../lib/db';
import { initialSources } from '../../lib/sources';
import { runScrape, scrapeState } from '../../lib/scraper';

export async function POST() {
  try {
    const deleted = new Set(getPermanentlyDeletedIds.all());
    for (const source of initialSources) {
      if (!deleted.has(source.id)) {
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
