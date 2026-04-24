# UIUC Event Scraper

A Next.js web app that aggregates upcoming events from 900+ UIUC sources into one searchable, filterable feed. Events are scraped automatically on startup and refreshed every hour.

**Live demo:** [*(add your Railway URL here once deployed)*](https://uiucevent.up.railway.app/)

---

## Features

- **950+ active sources** — central calendars, colleges, departments, student organizations, research centers, arts venues, athletics, libraries, and more
- **Semantic search** — powered by Cohere embeddings; finds events related to your query even when the exact words don't appear in the title or description
- **Multi-term keyword search** — exact phrase, per-word, prefix, and fuzzy (Levenshtein) matching with relevance scoring
- **Sort by date or relevance** — relevance sort blends semantic similarity (60%) and keyword score (40%)
- **Hierarchical Category filter** — primary level = source category (e.g. Colleges & Schools, Arts & Culture); secondary level = individual sources within that category
- **Event Host filter** — filter by originating website
- **Date range filter**
- **Cross-source deduplication** — the same event appearing on multiple sites is merged into one card, with links to all original pages
- **Auto-scrape** — runs 3 seconds after server start, then every hour
- **Source pool management** — add, edit, enable/disable, or permanently delete sources at `/sources`
- **Playwright browser rendering** — Beckman Institute and Krannert Art Museum use a headless Chromium browser to scrape JavaScript-rendered pages

---

## Local Development

### Prerequisites
- Node.js 20+
- npm
- (Optional) A [Cohere](https://cohere.com) API key for semantic search

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
| `DATA_DIR` | project root | Directory where `data.json` and `embeddings.json` are stored. Set to a persistent volume path in production. |
| `COHERE_API_KEY` | *(none)* | Enables semantic search. Get a free key at [cohere.com](https://cohere.com). If unset, semantic search is silently skipped and only keyword search is used. |

Copy `.env.example` to `.env.local` and edit as needed for local overrides.

---

## Deployment (Railway — recommended)

Railway runs the app as a persistent Node.js process, which means:
- `data.json` and `embeddings.json` can be stored on a persistent **Volume** (survives redeploys)
- Playwright/Chromium works (no serverless size limits)
- The hourly scrape timer in `instrumentation.node.ts` runs continuously

### Steps

1. **Create a Railway account** at [railway.app](https://railway.app) (free tier available)

2. **Deploy via Railway CLI** (recommended — GitHub webhook auto-deploy requires additional setup):
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up --detach
   ```

3. **Add a Volume** so scraped data survives redeploys:
   - In your Railway service → **Volumes** → Add Volume
   - Mount path: `/data`

4. **Set environment variables** in Railway → **Variables**:
   ```
   DATA_DIR=/data
   COHERE_API_KEY=your-key-here
   ```

5. Railway will automatically use the build command from `railway.toml`:
   ```
   npm ci && npx playwright install chromium --with-deps && npm run build
   ```
   and start with `npm start`.

6. Once deployed, open the Railway URL, click **Initialize Sources**, then **Scrape Events**.

> **Note:** The first scrape takes 3–5 minutes. After scraping completes, embeddings are built automatically if `COHERE_API_KEY` is set (batched Cohere API calls, ~90 events per request).

To redeploy after code changes:
```bash
railway up --detach
```

---

## Architecture

```
app/
  lib/
    db.ts                # Flat-file JSON database (data.json)
    scraper.ts           # All scrapers + deduplication + embedding trigger
    sources.ts           # Initial source pool (~959 sources, 958 active)
    embeddings.ts        # Cohere embedding helpers (build, query, cosine similarity)
  api/
    events/              # GET /api/events, GET /api/events/[id]
    scrape/              # POST /api/scrape
    search/              # GET /api/search?q=... (semantic search)
    sources/             # GET/POST /api/sources, PATCH/DELETE /api/sources/[id]
    setup/               # POST /api/setup (seed source pool)
  page.tsx               # Main events feed
  events/[id]/           # Event detail page
  sources/               # Source pool management page
instrumentation.node.ts  # Startup + hourly scrape timer (Node.js only)
```

### Source Pool

~959 raw sources across 11 categories (source will be deleted if events duplicate):

| Category | Sources |
|---|---|
| Other UIUC Calendars | 494 |
| Colleges & Schools | 214 |
| Student Life & Cultural Centers | 75 |
| Research Centers & Labs | 67 |
| Campus Recreation & Wellness | 35 |
| Graduate & Academic Support | 26 |
| Arts & Performance | 21 |
| Libraries | 11 |
| Athletics | 9 |
| Central Calendars | 4 |
| Design & Innovation | 3 |

### Scraper Parsers

| Parser | Detected by | Used for |
|---|---|---|
| **UIUC Calendar** | `calendars.illinois.edu` URL | ~700+ sources routed through the campus calendar system |
| **Illinois WordPress Theme** | `event-card-content__date` or `featured-event__date` CSS class | music.illinois.edu, faa.illinois.edu, and similar WP sites |
| **Drupal Event Articles** | `class="event-date"` + `/event/YYYY/MM/DD/` URL pattern | giesbusiness.illinois.edu, education.illinois.edu |
| **Krannert Center** | `krannertcenter.com/calendar` URL | Fetches detail pages for venue and performance times |
| **iCal / LibCal** | `libcal.library.illinois.edu/ical` URL | Library event feeds |
| **RSS Feed** | `.rss` or `feed=rss` URL pattern | Department news/event RSS feeds |
| **Grainger** | `grainger.illinois.edu/calendars` URL | Engineering college event listings |
| **iSchool** | `ischool.illinois.edu/news-events/events` URL | Scrapes 12 months automatically |
| **State Farm Center** | `statefarmcenter.com/events` URL | Major venue — static HTML listing |
| **Spurlock Museum** | `spurlock.illinois.edu/events` URL | Museum programs and exhibitions |
| **Beckman Institute** | `beckman.illinois.edu/visit/events` URL | Playwright (headless Chromium) — Angular app |
| **Krannert Art Museum** | `kam.illinois.edu` URL | Playwright (headless Chromium) — JS-rendered Drupal |

### Database

Two flat files are used for persistence:

- **`data.json`** — sources, scraped events, and permanent deletion blacklist:
  ```json
  { "sources": [...], "events": [...], "permanently_deleted_ids": [...] }
  ```
- **`embeddings.json`** — Cohere vector embeddings keyed by event ID:
  ```json
  { "42": [0.12, -0.04, ...], "43": [...] }
  ```

No migrations or setup required. To reset all scraped events, delete `data.json` and restart.

### Semantic Search

After each scrape, all events are batch-embedded using Cohere's `embed-english-light-v3.0` model and stored in `embeddings.json`. When a user searches:

1. The query is embedded via `/api/search`
2. Cosine similarity is computed against all upcoming event embeddings
3. Events scoring ≥ 0.3 are included as semantic matches
4. The frontend blends semantic score (60%) + keyword score (40%) for the **Relevance** sort

If `COHERE_API_KEY` is not set, semantic search is silently skipped and only keyword search runs.

### Source Deletion

Sources can be **permanently deleted** from `/sources`. Permanently deleted source IDs are stored in `permanently_deleted_ids` inside `data.json` and are excluded from the auto-seed step on every restart, so they will not reappear.

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
