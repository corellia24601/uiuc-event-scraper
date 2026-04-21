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

  async function syncSourcesAndScrape(label: string) {
    try {
      const { insertSource } = await import('./app/lib/db');
      const { initialSources } = await import('./app/lib/sources');
      for (const s of initialSources) {
        insertSource.run(s.id, s.category, s.name, s.url, s.notes || '', s.active);
      }
    } catch (err) {
      console.error(`[Scraper] Source sync failed (${label}):`, err);
    }
    try {
      const { runScrape } = await import('./app/lib/scraper');
      console.log(`[Scraper] Running ${label} scrape…`);
      await runScrape();
    } catch (err) {
      console.error(`[Scraper] ${label} scrape failed:`, err);
    }
  }

  // Defer startup scrape by 3 s to let the server finish initialising.
  setTimeout(() => syncSourcesAndScrape('startup'), 3000);

  // Hourly scrapes thereafter.
  setInterval(() => syncSourcesAndScrape('hourly'), 60 * 60 * 1000);
}
