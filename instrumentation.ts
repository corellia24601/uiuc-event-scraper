// instrumentation.ts — runs once when the Next.js server starts.
// Schedules the event scraper to run immediately on startup, then every hour.

declare global {
  // Prevents duplicate timers across Next.js hot-reloads in development.
  var __scraperTimerStarted: boolean | undefined;
}

export async function register() {
  // Only run in the Node.js runtime (not Edge).
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  // Guard: Next.js may call register() more than once during HMR in dev mode.
  if (global.__scraperTimerStarted) return;
  global.__scraperTimerStarted = true;

  // Defer startup scrape by 3 s to let the server finish initialising.
  setTimeout(async () => {
    try {
      const { runScrape } = await import('./app/lib/scraper');
      console.log('[Scraper] Running startup scrape…');
      await runScrape();
    } catch (err) {
      console.error('[Scraper] Startup scrape failed:', err);
    }

    // Hourly scrapes thereafter.
    setInterval(async () => {
      try {
        const { runScrape } = await import('./app/lib/scraper');
        console.log('[Scraper] Running hourly scrape…');
        await runScrape();
      } catch (err) {
        console.error('[Scraper] Hourly scrape failed:', err);
      }
    }, 60 * 60 * 1000);
  }, 3000);
}
