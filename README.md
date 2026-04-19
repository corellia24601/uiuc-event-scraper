# UIUC Event Scraper

A Next.js web app that aggregates upcoming events from 30+ UIUC sources into one searchable, filterable feed. Events are scraped automatically on startup and refreshed every hour.

**Live demo:** *(add your Railway URL here once deployed)*

---

## Features

- **30+ active sources** — central calendars, colleges, arts venues, research centers, athletics, libraries, and more
- **Full-text search** across title and description
- **Filters** — date range, event host, originating calendar; sort by date or popularity
- **Cross-source deduplication** — the same event appearing on multiple sites is merged into one card, with links to all original pages
- **Auto-scrape** — runs 3 seconds after server start, then every hour
- **Source pool management** — add, edit, enable/disable sources at `/sources`
- **Playwright browser rendering** — Beckman Institute and Krannert Art Museum use a headless Chromium browser to scrape JavaScript-rendered pages

---

## Local Development

### Prerequisites
- Node.js 20+
- npm

### Setup

```bash
git clone https://github.com/corellia24601/uiuc-event-scraper.git
cd uiuc-event-scraper
npm install
npx playwright install chromium   # one-time: downloads the headless browser
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On first run the source pool is empty — click **Initialize Sources** to populate it, then **Scrape Events** to fetch events. The scraper also runs automatically 3 seconds after the server starts.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATA_DIR` | project root | Directory where `data.json` is stored. Set to a persistent volume path in production. |

Copy `.env.example` to `.env.local` and edit as needed for local overrides.

---

## Deployment (Railway — recommended)

Railway runs the app as a persistent Node.js process, which means:
- `data.json` can be stored on a persistent **Volume** (survives redeploys)
- Playwright/Chromium works (no serverless size limits)
- The hourly scrape timer in `instrumentation.ts` runs continuously

### Steps

1. **Create a Railway account** at [railway.app](https://railway.app) (free tier available)

2. **New project → Deploy from GitHub repo** — connect your fork of this repo

3. **Add a Volume** so scraped data survives redeploys:
   - In your Railway service → **Volumes** → Add Volume
   - Mount path: `/data`

4. **Set environment variables** in Railway → **Variables**:
   ```
   DATA_DIR=/data
   ```

5. Railway will automatically use the build command from `railway.toml`:
   ```
   npm ci && npx playwright install chromium --with-deps && npm run build
   ```
   and start with `npm start`.

6. Once deployed, open the Railway URL, click **Initialize Sources**, then **Scrape Events**.

> **Note:** The first scrape takes 3–5 minutes because it fetches a detail page for every UIUC Calendar event to extract descriptions and accurate end dates.

---

## Architecture

```
app/
  lib/
    db.ts          # Flat-file JSON database (data.json)
    scraper.ts     # All scrapers + cross-source deduplication
    sources.ts     # Initial source pool (50 sources, 30 active)
  api/
    events/        # GET /api/events, GET /api/events/[id]
    scrape/        # POST /api/scrape
    sources/       # GET/POST /api/sources, PATCH/DELETE /api/sources/[id]
  page.tsx         # Main events feed
  events/[id]/     # Event detail page
  sources/         # Source pool management page
instrumentation.ts # Startup + hourly scrape timer
```

### Scraper Parsers

| Parser | Sites |
|---|---|
| UIUC Calendar (`calendars.illinois.edu`) | 20+ sources via the campus calendar system |
| Illinois WordPress Theme | music.illinois.edu, faa.illinois.edu |
| Drupal Event Articles | giesbusiness.illinois.edu, education.illinois.edu |
| Krannert Center | krannertcenter.com (fetches detail pages for venue/time) |
| Beckman Institute | beckman.illinois.edu (Playwright — Angular app) |
| Krannert Art Museum | kam.illinois.edu (Playwright — JS-rendered Drupal) |

### Database

`data.json` is a plain JSON file:
```json
{ "sources": [...], "events": [...] }
```

No migrations or setup required. To reset all scraped events, delete `data.json` and restart.

---

## Adding a New Source

1. Go to `/sources` → **Add Source**
2. Fill in category, name, and URL
3. The scraper auto-detects the parser (UIUC Calendar, WP Theme, Drupal) from the URL/HTML
4. If the source needs JavaScript rendering, add a Playwright-based parser in `app/lib/scraper.ts` and register it in `scrapeSource()`

---

## Contributing

Pull requests welcome. Key files:

- **New parser** — add a function in `app/lib/scraper.ts` and register it in `scrapeSource()`
- **New source** — add to `initialSources` in `app/lib/sources.ts`
- **UI changes** — `app/page.tsx` (feed), `app/events/[id]/page.tsx` (detail)
