import { NextResponse } from 'next/server';
import { runScrape } from '../../lib/scraper';

export async function POST() {
  try {
    const { total, errors } = await runScrape();
    return NextResponse.json({
      message: `Scraping completed. Total events scraped: ${total}`,
      ...(errors.length > 0 && { errors }),
    });
  } catch (error) {
    console.error('Error during scraping:', error);
    return NextResponse.json(
      { error: 'Scraping failed: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
