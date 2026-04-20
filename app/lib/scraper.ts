import { getActiveSources, insertEvent, deleteEventsBySource } from './db';

export interface EventData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: string;
  url: string;
  // UIUC Calendar-specific attributes
  sponsor: string;
  contact: string;
  contact_email: string;
  views: number;
  originating_calendar: string;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

const MONTH_MAP: Record<string, string> = {
  January: '01', February: '02', March: '03', April: '04',
  May: '05', June: '06', July: '07', August: '08',
  September: '09', October: '10', November: '11', December: '12',
};
const MONTH_ABBR_MAP: Record<string, string> = {
  JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
  JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12',
};

/** "Tuesday, April 7, 2026" or "dummy, April 7, 2026" → "2026-04-07" */
function parseLongDateToISO(dateStr: string): string | null {
  const m = dateStr.match(/\w+,\s+(\w+)\s+(\d{1,2}),\s+(\d{4})/);
  if (!m) return null;
  const mm = MONTH_MAP[m[1]];
  return mm ? `${m[3]}-${mm}-${m[2].padStart(2, '0')}` : null;
}

/** "April 14, 2026" → "2026-04-14" */
function parseShortDateToISO(s: string): string | null {
  const m = s.trim().match(/(\w+)\s+(\d{1,2}),\s+(\d{4})/);
  if (!m) return null;
  const mm = MONTH_MAP[m[1]];
  return mm ? `${m[3]}-${mm}-${m[2].padStart(2, '0')}` : null;
}

/** "Apr 14, 2026" or "April 14, 2026" → "2026-04-14" (handles both full and abbreviated months) */
function parseAnyDateToISO(s: string): string | null {
  const m = s.trim().match(/(\w+)\s+(\d{1,2}),\s*(\d{4})/);
  if (!m) return null;
  const mm = MONTH_MAP[m[1]] || MONTH_ABBR_MAP[m[1].toUpperCase().slice(0, 3)];
  return mm ? `${m[3]}-${mm}-${m[2].padStart(2, '0')}` : null;
}

/**
 * Parses WP-theme date strings → { start, end }
 * Handles:
 *   "April 14, 2026"            → same-day
 *   "April 10-18, 2026"         → same-month range
 *   "April 30 - May 3, 2026"    → cross-month range
 */
function parseWPDateRange(dateText: string): { start: string; end: string } | null {
  const s = dateText.trim();

  // Cross-month range: "April 30 - May 3, 2026"
  const cross = s.match(/([A-Za-z]+)\s+(\d{1,2})\s*[-–]\s*([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  if (cross) {
    const smm = MONTH_MAP[cross[1]]; const emm = MONTH_MAP[cross[3]];
    if (!smm || !emm) return null;
    return {
      start: `${cross[5]}-${smm}-${cross[2].padStart(2, '0')}`,
      end:   `${cross[5]}-${emm}-${cross[4].padStart(2, '0')}`,
    };
  }

  // Same-month range: "April 10-18, 2026" or "April 10 - 18, 2026"
  const same = s.match(/([A-Za-z]+)\s+(\d{1,2})\s*[-–]\s*(\d{1,2}),\s*(\d{4})/);
  if (same) {
    const mm = MONTH_MAP[same[1]];
    if (!mm) return null;
    return {
      start: `${same[4]}-${mm}-${same[2].padStart(2, '0')}`,
      end:   `${same[4]}-${mm}-${same[3].padStart(2, '0')}`,
    };
  }

  // Single date: "April 14, 2026"
  const iso = parseShortDateToISO(s);
  return iso ? { start: iso, end: iso } : null;
}

/**
 * Parses time span strings → { startTime, endTime }
 * Handles: "All Day", "1:00 - 3:00 pm", "11:00 am - 1:00 pm", "6:30 pm", "11:00 AM - 1:00 PM"
 */
function parseTimeSpan(s: string): { startTime: string; endTime: string } {
  s = s.trim();
  if (!s || s.toLowerCase().includes('all day')) return { startTime: '', endTime: '' };

  // Range: "HH:MM [am/pm] - HH:MM [am/pm]"
  const range = s.match(/(\d{1,2}):(\d{2})\s*(am|pm)?\s*[-–]\s*(\d{1,2}):(\d{2})\s*(am|pm)?/i);
  if (range) {
    const [, sh, sm, sp, eh, em, ep] = range;
    const ep2 = (ep ?? (s.toLowerCase().includes('pm') ? 'pm' : '')).toLowerCase();
    const sp2 = (sp ?? ep2).toLowerCase();
    return {
      startTime: sp2 ? `${sh}:${sm} ${sp2}` : `${sh}:${sm}`,
      endTime:   ep2 ? `${eh}:${em} ${ep2}` : `${eh}:${em}`,
    };
  }

  // Single: "6:30 pm"
  const single = s.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
  if (single) {
    const [, h, m, p] = single;
    return { startTime: `${h}:${m} ${p.toLowerCase()}`, endTime: '' };
  }

  return { startTime: '', endTime: '' };
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; UIUC-Event-Scraper/1.0)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error(`[Scraper] HTTP ${res.status} for ${url}`);
      return null;
    }
    return res.text();
  } catch (e) {
    console.error(`[Scraper] Fetch error for ${url}:`, e);
    return null;
  }
}

/**
 * Runs async tasks with at most `concurrency` running at once.
 * Results are returned in the same order as the input array.
 */
async function pooledMap<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i]);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

// ─── 1. Parser: calendars.illinois.edu ───────────────────────────────────────

function isUIUCCalendarUrl(url: string): boolean {
  return /calendars\.illinois\.edu\/list\/\d+/i.test(url) ||
    /illinois\.edu\/calendar\/list\/\d+/i.test(url);
}

function toCanonicalListUrl(url: string): string {
  const m = url.match(/(?:https?:\/\/[^/]+\/)?(?:calendar\/)?list\/(\d+)/i);
  return m ? `https://calendars.illinois.edu/list/${m[1]}` : url;
}

function parseUIUCCalendarHTML(html: string): EventData[] {
  // Use a Map to deduplicate events by eventId.
  // Multi-day or long-running events (exhibitions, semesters-long events) appear as a
  // separate list entry for every day they span — we collapse them to one entry.
  // start_date = first (earliest) occurrence on the list page (i.e. the next upcoming day).
  // end_date   = last occurrence visible on the list page; the detail-page enricher
  //              will overwrite this with the true end date later.
  const eventMap = new Map<string, EventData>();
  const order: string[] = [];

  const decoded = html
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  // Split on date-header h2 elements; capturing group interleaves date strings
  const parts = decoded.split(/<h2[^>]*>([A-Za-z]+,\s+[A-Za-z]+\s+\d{1,2},\s+\d{4})<\/h2>/g);
  let currentDateISO: string | null = null;

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      currentDateISO = parseLongDateToISO(parts[i].trim());
      continue;
    }
    if (!currentDateISO) continue;

    const entries = parts[i].match(/<li class="entry[^>]*>[\s\S]*?<\/li>/g) ?? [];
    for (const entry of entries) {
      const idMatch = entry.match(/eventId=(\d+)/);
      if (!idMatch) continue;
      const eventId = idMatch[1];

      // Duplicate: same eventId already seen — just extend end_date if this day is later
      if (eventMap.has(eventId)) {
        const existing = eventMap.get(eventId)!;
        if (currentDateISO > existing.end_date) existing.end_date = currentDateISO;
        continue;
      }

      // First occurrence — parse all fields
      const titleMatch = entry.match(/<h3><a[^>]*>([^<]+)/);
      const title = titleMatch ? titleMatch[1].trim() : 'Untitled Event';

      // Location: actual HTML has title="..." BEFORE class="location"
      const spanTag = entry.match(/<span[^>]*class="location"[^>]*>/);
      const location = spanTag
        ? (spanTag[0].match(/title="([^"]*)"/) ?? ['', ''])[1]
        : '';

      // Extract all text from the summary div (may be multi-paragraph or empty)
      const summaryMatch = entry.match(/<div class="summary">([\s\S]*?)<\/div>/);
      const description = summaryMatch
        ? summaryMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        : '';

      const dateSpanMatch = entry.match(/<div class="date">[^<]*<svg[\s\S]*?<\/svg>([^<]+)<\/div>/);
      const dateSpanStr = dateSpanMatch ? dateSpanMatch[1].trim() : '';
      const { startTime, endTime } = parseTimeSpan(dateSpanStr);

      let endDateISO = currentDateISO;
      if (dateSpanStr.toLowerCase().includes(' to ')) {
        const toMatch = dateSpanStr.match(/to\s+([A-Za-z]+\s+\d{1,2}(?:,?\s+\d{4})?)/i);
        if (toMatch) {
          const endStr = toMatch[1].includes(',')
            ? toMatch[1]
            : `${toMatch[1]}, ${currentDateISO.slice(0, 4)}`;
          const parsed = parseLongDateToISO(`dummy, ${endStr}`);
          if (parsed) endDateISO = parsed;
        }
      }

      const event: EventData = {
        title, description,
        start_date: currentDateISO, end_date: endDateISO,
        start_time: startTime, end_time: endTime,
        location,
        url: `https://calendars.illinois.edu/detail/7?eventId=${eventId}`,
        sponsor: '', contact: '', contact_email: '', views: 0, originating_calendar: '',
      };
      eventMap.set(eventId, event);
      order.push(eventId);
    }
  }

  return order.map(id => eventMap.get(id)!);
}

/** Extract a named attribute from UIUC Calendar detail page dt/dd pairs. */
function extractUIUCAttr(html: string, label: string): string {
  const re = new RegExp(
    `<dt[^>]*>\\s*${label}\\s*:?\\s*<\\/dt>\\s*<dd[^>]*>([\\s\\S]*?)<\\/dd>`, 'i'
  );
  const m = html.match(re);
  return m ? m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

interface UIUCDetails {
  description: string;
  sponsor: string;
  contact: string;
  contact_email: string;
  views: number;
  originating_calendar: string;
  /** True end date of the event from the detail page (may be far in the future). */
  end_date: string | null;
}

async function fetchUIUCEventDetails(eventUrl: string): Promise<UIUCDetails> {
  const html = await fetchHtml(eventUrl);
  if (!html) return { description: '', sponsor: '', contact: '', contact_email: '', views: 0, originating_calendar: '', end_date: null };

  // Description is in <dd class="ws-description">
  const descM = html.match(/class="ws-description"[^>]*>([\s\S]*?)<\/dd>/);
  const description = descM ? descM[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

  const sponsor = extractUIUCAttr(html, 'Sponsor');
  const contact = extractUIUCAttr(html, 'Contact');
  const contact_email = extractUIUCAttr(html, 'E-Mail') || extractUIUCAttr(html, 'Email');
  const viewsStr = extractUIUCAttr(html, 'Views').replace(/,/g, '');
  const views = parseInt(viewsStr) || 0;
  const originating_calendar = extractUIUCAttr(html, 'Originating Calendar');

  // Extract the true end date so multi-day/long-running events show the full range.
  // The detail page uses the same clock-icon div as the list page:
  //   <div class="date"><svg…/>Sep 19, 2025 - Aug 10, 2026 &nbsp; All Day </div>
  let end_date: string | null = null;

  const dateDivM = html.match(/<div class="date">[^<]*<svg[\s\S]*?<\/svg>([^<]+)/);
  if (dateDivM) {
    const dateText = dateDivM[1].replace(/&nbsp;/g, ' ').trim();
    // "Sep 19, 2025 - Aug 10, 2026   All Day" → extract the part after the dash
    const rangeM = dateText.match(/[-–]\s*([A-Za-z]+\s+\d{1,2},\s*\d{4})/);
    if (rangeM) end_date = parseAnyDateToISO(rangeM[1].trim());
  }

  return { description, sponsor, contact, contact_email, views, originating_calendar, end_date };
}

async function scrapeUIUCCalendar(url: string): Promise<EventData[]> {
  const html = await fetchHtml(toCanonicalListUrl(url));
  if (!html) return [];
  const events = parseUIUCCalendarHTML(html);

  // Fetch detail pages for all events to get description, attributes, and true end date
  // (10 parallel at a time)
  await pooledMap(events, 10, async (event) => {
    const details = await fetchUIUCEventDetails(event.url);
    event.description = details.description;
    event.sponsor = details.sponsor;
    event.contact = details.contact;
    event.contact_email = details.contact_email;
    event.views = details.views;
    event.originating_calendar = details.originating_calendar;
    // Overwrite end_date with the authoritative value from the detail page.
    // This is critical for long-running events (exhibitions, multi-week shows) where
    // the list page only shows a partial window of the full date span.
    if (details.end_date && details.end_date > event.start_date) {
      event.end_date = details.end_date;
    }
  });

  return events;
}

// ─── 2. Parser: Drupal "event-date" article template ─────────────────────────
// Used by: giesbusiness.illinois.edu, education.illinois.edu, and any other
// Illinois Drupal site with the same theme.
// Detection: articles contain class="event-date" and URLs like /event/YYYY/MM/DD/

function isDrupalEventArticleFormat(html: string): boolean {
  return html.includes('class="event-date"') &&
    /\/event\/\d{4}\/\d{2}\/\d{2}\//.test(html);
}

function parseDrupalEventArticles(html: string): EventData[] {
  const events: EventData[] = [];
  const articles = html.match(/<article[\s\S]*?<\/article>/g) ?? [];

  for (const article of articles) {
    // URL contains year/month/day: /event/2026/04/20/...
    const urlMatch = article.match(/href="(https?:\/\/[^"]+\/event\/(\d{4})\/(\d{2})\/(\d{2})\/[^"]+)"/);
    if (!urlMatch) continue;
    const [, eventUrl, year, month, day] = urlMatch;
    const startDateISO = `${year}-${month}-${day}`;

    const titleMatch = article.match(/href="[^"]*">(.*?)<\/a>/s);
    const title = titleMatch
      ? titleMatch[1].replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim()
      : 'Untitled Event';

    // Time: extract from <time class="event-time">
    const timeTagMatch = article.match(/<time[^>]*class="event-time"[^>]*>([\s\S]*?)<\/time>/);
    let startTime = '';
    let endTime = '';
    if (timeTagMatch) {
      const timeText = timeTagMatch[1].replace(/<[^>]+>/g, '').trim();
      ({ startTime, endTime } = parseTimeSpan(timeText));
    }

    // Location: look for location field or venue info
    const locMatch =
      article.match(/class="[^"]*location[^"]*"[^>]*>\s*([^<]+)/) ??
      article.match(/class="[^"]*venue[^"]*"[^>]*>\s*([^<]+)/);
    const location = locMatch ? locMatch[1].trim() : '';

    events.push({
      title,
      description: '',
      start_date: startDateISO, end_date: startDateISO,
      start_time: startTime, end_time: endTime,
      location,
      url: eventUrl.replace(/&amp;/g, '&'),
      sponsor: '', contact: '', contact_email: '', views: 0, originating_calendar: '',
    });
  }

  return events;
}

// ─── 3. Parser: Illinois WordPress event theme ───────────────────────────────
// Used by music.illinois.edu, faa.illinois.edu/about/events, and other sites
// built on the Illinois base WordPress theme.
// Two flavours:
//   - event-card-content__date / event-card-content__time  (music.illinois.edu)
//   - featured-event__date     / featured-event__time      (faa.illinois.edu)

function isIllinoisWPTheme(html: string): boolean {
  return html.includes('event-card-content__date') ||
    html.includes('featured-event__date');
}

function parseIllinoisWPTheme(html: string): EventData[] {
  const seen = new Set<string>();
  const events: EventData[] = [];
  const articles = html.match(/<article[\s\S]*?<\/article>/g) ?? [];

  for (const article of articles) {
    // Capture full text content of date element (handles single dates AND ranges)
    const dateMatch =
      article.match(/class="event-card-content__date[^"]*"[^>]*>\s*([^<]+)/) ??
      article.match(/class="featured-event__date[^"]*"[^>]*>\s*([^<]+)/);
    if (!dateMatch) continue;
    const dates = parseWPDateRange(dateMatch[1]);
    if (!dates) continue;

    // Title inside <h2> → <a> (strip trailing SVG icon span)
    const titleMatch = article.match(/<h2[^>]*>[\s\S]*?<a[^>]*>\s*([\s\S]*?)<span/);
    const title = titleMatch
      ? titleMatch[1].replace(/<[^>]+>/g, '').trim()
      : (article.match(/<a[^>]*href[^>]*>\s*([^<]{3,})/)?.[1].trim() ?? '');
    if (!title) continue;

    // Deduplicate (some WP pages render each event card twice)
    const key = `${title}|${dates.start}`;
    if (seen.has(key)) continue;
    seen.add(key);

    // Event URL (any https link in the article)
    const urlMatch = article.match(/<a[^>]*href="(https?:\/\/[^"]+)"/);
    const eventUrl = urlMatch ? urlMatch[1].replace(/&#038;/g, '&') : '';

    // Time: "Tuesday, 11:00 AM - 1:00 PM" — strip leading weekday
    const timeMatch =
      article.match(/class="event-card-content__time[^"]*"[^>]*>[\s\S]*?<\/div>/) ??
      article.match(/class="featured-event__time[^"]*"[^>]*>[\s\S]*?<\/div>/);
    let startTime = '';
    let endTime = '';
    if (timeMatch) {
      const raw = timeMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      ({ startTime, endTime } = parseTimeSpan(raw.replace(/^\w+,\s*/, '')));
    }

    // Location: look for common location field patterns
    const locMatch =
      article.match(/class="event-card-content__location[^"]*"[^>]*>\s*([^<]+)/) ??
      article.match(/class="featured-event__location[^"]*"[^>]*>\s*([^<]+)/) ??
      article.match(/class="[^"]*location[^"]*"[^>]*>\s*([^<]+)/);
    const location = locMatch ? locMatch[1].trim() : '';

    events.push({
      title, description: '',
      start_date: dates.start, end_date: dates.end,
      start_time: startTime, end_time: endTime,
      location,
      url: eventUrl,
      sponsor: '', contact: '', contact_email: '', views: 0, originating_calendar: '',
    });
  }

  return events;
}

// ─── 4. Parser: krannertcenter.com ───────────────────────────────────────────

function parseKrannertDate(s: string): { start: string; end: string } | null {
  const t = s.trim().toUpperCase();
  // "APR 24-MAY 2, 2026" — cross-month range
  const cross = t.match(/([A-Z]{3})\s+(\d{1,2})-([A-Z]{3})\s+(\d{1,2}),\s+(\d{4})/);
  if (cross) {
    const smm = MONTH_ABBR_MAP[cross[1]], emm = MONTH_ABBR_MAP[cross[3]];
    if (!smm || !emm) return null;
    return {
      start: `${cross[5]}-${smm}-${cross[2].padStart(2, '0')}`,
      end:   `${cross[5]}-${emm}-${cross[4].padStart(2, '0')}`,
    };
  }
  // "APR 10-18, 2026" — same-month range
  const range = t.match(/([A-Z]{3})\s+(\d{1,2})-(\d{1,2}),\s+(\d{4})/);
  if (range) {
    const mm = MONTH_ABBR_MAP[range[1]];
    if (!mm) return null;
    return {
      start: `${range[4]}-${mm}-${range[2].padStart(2, '0')}`,
      end:   `${range[4]}-${mm}-${range[3].padStart(2, '0')}`,
    };
  }
  // "APR 14, 2026" — single day
  const single = t.match(/([A-Z]{3})\s+(\d{1,2}),\s+(\d{4})/);
  if (single) {
    const mm = MONTH_ABBR_MAP[single[1]];
    if (!mm) return null;
    const iso = `${single[3]}-${mm}-${single[2].padStart(2, '0')}`;
    return { start: iso, end: iso };
  }
  return null;
}

/** Parse all events from one Krannert calendar month page. */
function parseKrannertCalendarPage(html: string, seen: Set<string>): EventData[] {
  const events: EventData[] = [];
  // Calendar grid uses class="calendar-item" blocks containing date/title/url
  const items = html.match(/<div class="calendar-item[^"]*"[\s\S]*?(?=<div class="calendar-item|<\/td>)/g) ?? [];

  for (const item of items) {
    const dateText = (item.match(/class="calendar-date">([^<]+)/) ?? [])[1]?.trim();
    const titleRaw  = (item.match(/class="calendar-title">([^<]+)/) ?? [])[1]?.trim();
    const urlMatch  = item.match(/href="(\/events\/[^"]+)"/);
    if (!dateText || !titleRaw || !urlMatch) continue;

    const dates = parseKrannertDate(dateText);
    if (!dates) continue;

    const title = titleRaw
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .trim();
    const eventUrl = `https://krannertcenter.com${urlMatch[1]}`;

    // Deduplicate across months (cross-month events appear on two calendar pages)
    const key = `${title}|${dates.start}`;
    if (seen.has(key)) continue;
    seen.add(key);

    events.push({
      title, description: '',
      start_date: dates.start, end_date: dates.end,
      start_time: '', end_time: '',
      location: 'Krannert Center for the Performing Arts',
      url: eventUrl,
      sponsor: '', contact: '', contact_email: '', views: 0, originating_calendar: '',
    });
  }

  return events;
}

async function scrapeKrannertWithDetails(_url: string): Promise<EventData[]> {
  // Scrape current month + next 2 months to cover the full upcoming calendar
  const now = new Date();
  const monthsToFetch: string[] = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    monthsToFetch.push(`${d.getFullYear()}-${mm}`);
  }

  const seen = new Set<string>();
  const allEvents: EventData[] = [];
  for (const month of monthsToFetch) {
    const html = await fetchHtml(`https://krannertcenter.com/calendar?date=${month}`);
    if (html) allEvents.push(...parseKrannertCalendarPage(html, seen));
  }

  // Enrich each unique event with venue + time from its detail page (parallel, 8 at a time)
  await pooledMap(allEvents, 8, async (event) => {
    try {
      const detailHtml = await fetchHtml(event.url);
      if (!detailHtml) return;

      // Venue
      const venueMatch = detailHtml.match(/field--name-field-display-venue[^>]*>[\s\S]*?<div[^>]*class="field__item[^>]*>\s*([^<]+)/);
      if (venueMatch) event.location = venueMatch[1].trim();

      // Start time from structured ticket-dates (avoids Rose Bowl dinner boilerplate)
      const ticketTime = detailHtml.match(/class='event-date'>[^<]+-\s*(\d{1,2}:\d{2}(?:am|pm))\s*CT/i);
      if (ticketTime) event.start_time = ticketTime[1].toLowerCase();

      // End time from event body text only
      const bodyBlock = detailHtml.match(/field--name-body[\s\S]*?field__item[^>]*>([\s\S]*?)<\/div>/);
      if (bodyBlock) {
        const bodyText = bodyBlock[1].replace(/<[^>]+>/g, ' ');
        const rangeM = bodyText.match(/(\d{1,2}):(\d{2})\s*(am|pm)?\s*[-–]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
        if (rangeM) {
          const endH = rangeM[4], endM = rangeM[5] ?? '00', endP = rangeM[6].toLowerCase();
          const startP = (rangeM[3] ?? endP).toLowerCase();
          event.start_time = `${rangeM[1]}:${rangeM[2]}${startP}`;
          event.end_time   = `${endH}:${endM}${endP}`;
        }
      }
    } catch { /* silently skip */ }
  });

  return allEvents;
}

// ─── Detail-page enrichers ────────────────────────────────────────────────────

/** Fetches each WP-theme event's detail page in parallel and fills in `location`. */
async function enrichWPThemeLocations(events: EventData[]): Promise<EventData[]> {
  const needsLoc = events.filter(e => !e.location && e.url);
  await pooledMap(needsLoc, 8, async (event) => {
    try {
      const detail = await fetchHtml(event.url);
      if (!detail) return;
      const m = detail.match(/class="event-summary__location"[^>]*>\s*([^<]+)/);
      if (m) event.location = m[1].trim();
    } catch { /* silently skip */ }
  });
  return events;
}

/** Fetches each Drupal event's detail page in parallel and fills in `location`. */
async function enrichDrupalLocations(events: EventData[]): Promise<EventData[]> {
  const needsLoc = events.filter(e => !e.location && e.url);
  await pooledMap(needsLoc, 8, async (event) => {
    try {
      const detail = await fetchHtml(event.url);
      if (!detail) return;
      // education.illinois.edu: <address>…email…</address></div><p>LOCATION</p>
      const m = detail.match(/<address>[\s\S]*?<\/address>\s*<\/div>\s*<p>\s*([^<]+)\s*<\/p>/);
      if (m) event.location = m[1].trim();
    } catch { /* silently skip */ }
  });
  return events;
}

// ─── 5. Browser-based fetching (Playwright) ──────────────────────────────────

let _browser: import('playwright').Browser | null = null;

async function fetchHtmlWithBrowser(url: string): Promise<string | null> {
  try {
    const { chromium } = await import('playwright');
    if (!_browser || !_browser.isConnected()) {
      _browser = await chromium.launch({ headless: true });
    }
    const page = await _browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const html = await page.content();
    await page.close();
    return html;
  } catch (e) {
    console.error(`[Scraper] Browser fetch error for ${url}:`, e);
    return null;
  }
}

async function closeBrowser(): Promise<void> {
  if (_browser) { await _browser.close().catch(() => {}); _browser = null; }
}

// ─── 6. Parser: Beckman Institute (Angular) ───────────────────────────────────
// Page: beckman.illinois.edu/visit/events-at-beckman
// Each event is an <li class="event-card"> with an <add-to-calendar-button>
// element that carries ISO startdate/enddate/starttime/endtime attributes.

function parseBeckmanHTML(html: string): EventData[] {
  const events: EventData[] = [];
  // Split on li.event-card boundaries
  const cards = html.match(/<li[^>]*class="[^"]*event-card[^"]*"[\s\S]*?(?=<li[^>]*class="[^"]*event-card|<\/ul>)/g) ?? [];

  const to12h = (t: string): string => {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')}${h >= 12 ? 'pm' : 'am'}`;
  };

  for (const card of cards) {
    const title = (card.match(/<h2[^>]*class="event--title"[^>]*>([^<]+)/) ??
                   card.match(/\btitle="([^"]+)"/))?.[1]?.trim() ?? '';
    if (!title) continue;

    const startdate = card.match(/\bstartdate="(\d{4}-\d{2}-\d{2})"/)?.[1];
    if (!startdate) continue;
    const enddate   = card.match(/\benddate="(\d{4}-\d{2}-\d{2})"/)?.[1] ?? startdate;
    const start_time = to12h(card.match(/\bstarttime="(\d{2}:\d{2})"/)?.[1] ?? '');
    const end_time   = to12h(card.match(/\bendtime="(\d{2}:\d{2})"/)?.[1] ?? '');
    const location   = card.match(/<p[^>]*class="event--location"[^>]*>([^<]+)/)?.[1]?.trim() ?? '';

    events.push({
      title, description: '',
      start_date: startdate, end_date: enddate,
      start_time, end_time, location,
      url: 'https://beckman.illinois.edu/visit/events-at-beckman',
      sponsor: '', contact: '', contact_email: '', views: 0, originating_calendar: '',
    });
  }
  return events;
}

// ─── 7. Parser: Krannert Art Museum (Drupal views) ───────────────────────────
// Page: kam.illinois.edu/exhibitions-events/events
// Events in <div class="views-row"> with event-time "Apr 23, 5:30–7 pm"

function parseKAMHTML(html: string): EventData[] {
  const events: EventData[] = [];
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const rows = html.match(/<div class="views-row">[\s\S]*?(?=<div class="views-row">|$)/g) ?? [];

  for (const row of rows) {
    const href = row.match(/href="(\/event\/[^"]+)"/)?.[1];
    if (!href) continue;

    const title = row.match(/<div class="views-field views-field-title">[\s\S]*?<span class="field-content">([^<]+)/)?.[1]?.trim() ?? '';
    if (!title) continue;

    const eventTimeText = row.match(/<div class="event-time">([^<]+)/)?.[1]?.trim() ?? '';
    // Format: "Apr 23, 5:30–7 pm" or "May 1, 5:30–7 am"
    const dateMatch = eventTimeText.match(/^([A-Za-z]{3})\s+(\d{1,2})/);
    if (!dateMatch) continue;
    const mm = MONTH_ABBR_MAP[dateMatch[1].toUpperCase()];
    if (!mm) continue;

    let year = today.getFullYear();
    let start_date = `${year}-${mm}-${dateMatch[2].padStart(2, '0')}`;
    if (start_date < todayStr) start_date = `${year + 1}-${mm}-${dateMatch[2].padStart(2, '0')}`;

    // Time: "5:30–7 pm" — end time may have no minutes
    let start_time = '', end_time = '';
    const raw = eventTimeText.replace(/^[A-Za-z]+ \d+,\s*/, '');
    const tMatch = raw.match(/(\d{1,2}):(\d{2})\s*(am|pm)?\s*[-–]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
    if (tMatch) {
      const [, sh, sm, sp, eh, em, ep] = tMatch;
      const ep2 = ep.toLowerCase(), sp2 = (sp ?? ep2).toLowerCase();
      start_time = `${sh}:${sm}${sp2}`;
      end_time   = `${eh}:${em ?? '00'}${ep2}`;
    }

    events.push({
      title, description: '',
      start_date, end_date: start_date,
      start_time, end_time,
      location: 'Krannert Art Museum',
      url: `https://kam.illinois.edu${href}`,
      sponsor: '', contact: '', contact_email: '', views: 0, originating_calendar: '',
    });
  }
  return events;
}

// ─── RSS parser (Fighting Illini Athletics + generic Sidearm RSS) ─────────────

function parseRSSFeed(xml: string): EventData[] {
  const events: EventData[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;

  const tag = (block: string, name: string) =>
    block.match(new RegExp(`<${name}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${name}>`))?.[1]?.trim() ||
    block.match(new RegExp(`<${name}[^>]*>([^<]*)<\\/${name}>`))?.[1]?.trim() || '';

  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const title = tag(block, 'title');
    const link  = tag(block, 'link') || tag(block, 'guid');
    const desc  = tag(block, 'description');
    if (!title) continue;

    // Prefer s:localstartdate (already local), fall back to ev:startdate
    const startRaw = tag(block, 's:localstartdate') || tag(block, 'ev:startdate');
    const endRaw   = tag(block, 's:localenddate')   || tag(block, 'ev:enddate');
    const location = tag(block, 'ev:location');

    const parseISOLocal = (iso: string): { date: string; time: string } => {
      // "2026-03-19T11:00:00" or "2026-03-19T11:00:00-05:00" or "2026-03-19T16:00:00Z"
      const dMatch = iso.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/);
      if (!dMatch) return { date: '', time: '' };
      let h = parseInt(dMatch[2], 10);
      const min = dMatch[3];
      // If UTC (ends with Z), shift to CT (approximate: -5h)
      if (iso.endsWith('Z')) {
        h = (h - 5 + 24) % 24;
        // If hour crosses midnight, adjust date (rare for sports events)
      }
      const ampm = h >= 12 ? 'pm' : 'am';
      const h12  = h % 12 || 12;
      return {
        date: dMatch[1],
        time: min === '00' ? `${h12}:00 ${ampm}` : `${h12}:${min} ${ampm}`,
      };
    };

    const { date: start_date, time: start_time } = parseISOLocal(startRaw);
    const { date: end_date,   time: end_time   } = parseISOLocal(endRaw);
    if (!start_date) continue;

    events.push({
      title,
      description: desc,
      start_date,
      end_date: end_date || start_date,
      start_time,
      end_time,
      location,
      url: link,
      sponsor: '', contact: '', contact_email: '', views: 0, originating_calendar: '',
    });
  }
  return events;
}

// ─── iCal parser (TLAS LibCal) ────────────────────────────────────────────────

function parseICalFeed(text: string): EventData[] {
  // Unfold folded lines (CRLF + space/tab)
  const unfolded = text.replace(/\r?\n[ \t]/g, '');
  const events: EventData[] = [];
  const veventRe = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
  let m: RegExpExecArray | null;

  const field = (block: string, name: string) => {
    const re = new RegExp(`^${name}(?:;[^:]*)?:(.*)$`, 'm');
    return block.match(re)?.[1]?.trim() || '';
  };

  const parseDT = (val: string, paramStr: string): { date: string; time: string } => {
    // All-day: VALUE=DATE or 8-digit only
    if (paramStr.includes('VALUE=DATE') || /^\d{8}$/.test(val)) {
      const d = val.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');
      return { date: d, time: '' };
    }
    // Local or UTC datetime: 20260420T130000[Z]
    const dtm = val.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
    if (!dtm) return { date: '', time: '' };
    let h = parseInt(dtm[4], 10);
    const min = dtm[5];
    if (val.endsWith('Z')) h = (h - 5 + 24) % 24; // approx CT
    const ampm = h >= 12 ? 'pm' : 'am';
    const h12  = h % 12 || 12;
    return {
      date: `${dtm[1]}-${dtm[2]}-${dtm[3]}`,
      time: `${h12}:${min} ${ampm}`,
    };
  };

  while ((m = veventRe.exec(unfolded)) !== null) {
    const block = m[1];
    const summary   = field(block, 'SUMMARY');
    const url       = field(block, 'URL');
    const location  = field(block, 'LOCATION');
    const desc      = field(block, 'DESCRIPTION').replace(/\\n/g, ' ').replace(/\\,/g, ',');

    // Extract DTSTART param string (e.g., "TZID=America/Chicago")
    const dtStartLine = block.match(/^(DTSTART[^:]*):(.*)$/m);
    const dtEndLine   = block.match(/^(DTEND[^:]*):(.*)$/m);
    const { date: start_date, time: start_time } = parseDT(dtStartLine?.[2]?.trim() ?? '', dtStartLine?.[1] ?? '');
    const { date: end_date,   time: end_time   } = parseDT(dtEndLine?.[2]?.trim()   ?? '', dtEndLine?.[1]   ?? '');

    if (!summary || !start_date) continue;
    events.push({
      title: summary, description: desc,
      start_date, end_date: end_date || start_date,
      start_time, end_time,
      location, url,
      sponsor: '', contact: '', contact_email: '', views: 0, originating_calendar: '',
    });
  }
  return events;
}

// ─── Spurlock Museum ──────────────────────────────────────────────────────────

function parseSpurlockHTML(html: string): EventData[] {
  const events: EventData[] = [];
  const currentYear = new Date().getFullYear();

  // Each event: <a href="event.php?ID=NNN"> ... title ... </a>
  // Surrounding context has the date and time
  // Split on event anchor boundaries
  const blocks = html.split(/<a\s+href="event\.php\?ID=\d+"/i);

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    // Extract URL (ID)
    const idMatch = html.match(/href="(event\.php\?ID=\d+)"/g)?.[i - 1];
    const relUrl = idMatch?.match(/href="([^"]+)"/)?.[1] ?? '';
    const url = relUrl ? `https://www.spurlock.illinois.edu/events/${relUrl}` : '';

    // Title: text inside the <a> tag
    const titleMatch = block.match(/^[^>]*>([^<]+)</);
    const title = titleMatch?.[1]?.trim() || '';
    if (!title) continue;

    // Date: look for "Mon Apr 20" or "Apr 20" or similar in the 600 chars after the link
    const context = block.slice(0, 600).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const dateMatch = context.match(
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2})(?:,?\s*(\d{4}))?/i
    );
    if (!dateMatch) continue;
    const mm = MONTH_ABBR_MAP[dateMatch[1].toUpperCase().slice(0, 3)];
    if (!mm) continue;
    const year = dateMatch[3] ? parseInt(dateMatch[3]) : currentYear;
    const start_date = `${year}-${mm}-${dateMatch[2].padStart(2, '0')}`;

    // Time: "7:00 pm–8:00 pm" or "7:00 pm - 8:00 pm"
    const { startTime, endTime } = parseTimeSpan(
      context.match(/\d{1,2}:\d{2}\s*(?:am|pm)[^<]*/i)?.[0] ?? ''
    );

    events.push({
      title, description: '',
      start_date, end_date: start_date,
      start_time: startTime, end_time: endTime,
      location: '', url,
      sponsor: '', contact: '', contact_email: '', views: 0, originating_calendar: '',
    });
  }
  return events;
}

// ─── State Farm Center ────────────────────────────────────────────────────────

function parseStateFarmCenterHTML(html: string): EventData[] {
  const events: EventData[] = [];

  // Cards: <a href="/events/detail/[slug]">...</a>
  const cardRe = /<a\s+href="(\/events\/detail\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;

  while ((m = cardRe.exec(html)) !== null) {
    const relUrl = m[1];
    const inner  = m[2];
    const url = `https://www.statefarmcenter.com${relUrl}`;

    // Title: inside <h3>
    const title = inner.match(/<h3[^>]*>([^<]+)<\/h3>/i)?.[1]?.trim() ?? '';
    if (!title) continue;

    // Strip all tags to get plain text for date/time extraction
    const text = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    // Date: "Apr. 26, 2026" or "April 26, 2026"
    const dateMatch = text.match(
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2}),\s*(\d{4})/i
    );
    if (!dateMatch) continue;
    const mm = MONTH_ABBR_MAP[dateMatch[1].toUpperCase().slice(0, 3)];
    if (!mm) continue;
    const start_date = `${dateMatch[3]}-${mm}-${dateMatch[2].padStart(2, '0')}`;

    // Time
    const { startTime, endTime } = parseTimeSpan(text.match(/\d{1,2}:\d{2}\s*(?:am|pm)[^$]*/i)?.[0] ?? '');

    // Location: anything after the date that looks like a venue
    const locMatch = text.match(/(?:at|@|venue:?)\s*([A-Z][^.]+)/i);
    const location = locMatch?.[1]?.trim() ?? '';

    events.push({
      title, description: '',
      start_date, end_date: start_date,
      start_time: startTime, end_time: endTime,
      location, url,
      sponsor: '', contact: '', contact_email: '', views: 0, originating_calendar: '',
    });
  }
  return events;
}

// ─── Grainger College of Engineering (direct site) ───────────────────────────

function parseGraingerHTML(html: string): EventData[] {
  const events: EventData[] = [];

  // Events rendered as list items; links point to calendars.illinois.edu/detail/2568
  // Pattern: <a href="...calendars.illinois.edu/detail/...">Title</a>
  // Followed by date/time and location as plain text
  const linkRe = /<a\s+[^>]*href="([^"]*calendars\.illinois\.edu\/detail\/[^"]+)"[^>]*>([\s\S]*?)<\/a>([\s\S]{0,400}?)(?=<a\s+[^>]*href="[^"]*calendars\.illinois\.edu|<\/[uo]l>|$)/gi;
  let m: RegExpExecArray | null;

  while ((m = linkRe.exec(html)) !== null) {
    const url   = m[1].startsWith('http') ? m[1] : `https:${m[1]}`;
    const title = m[2].replace(/<[^>]+>/g, '').trim();
    if (!title) continue;

    const context = m[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    // Date: "Monday, Apr 20, 2026" or "Apr 20, 2026"
    const dateMatch = context.match(
      /(?:\w+,\s+)?(\w+)\s+(\d{1,2}),\s*(\d{4})/
    );
    if (!dateMatch) continue;
    const mm = MONTH_MAP[dateMatch[1]] || MONTH_ABBR_MAP[dateMatch[1].toUpperCase().slice(0, 3)];
    if (!mm) continue;
    const start_date = `${dateMatch[3]}-${mm}-${dateMatch[2].padStart(2, '0')}`;

    // Time: "3:30 PM" or "3:30 PM - 5:00 PM"
    const { startTime, endTime } = parseTimeSpan(
      context.match(/\d{1,2}:\d{2}\s*(?:AM|PM)[\s\S]{0,40}/i)?.[0]?.slice(0, 40) ?? ''
    );

    // Location: text after time, strip "HYBRID:" prefix
    const locMatch = context.match(/HYBRID:\s*(.+)|(?:Room|Hall|Lab|Center|Building|Auditorium)[^,\n]*/i);
    const location = (locMatch?.[1] || locMatch?.[0] || '').trim();

    events.push({
      title, description: '',
      start_date, end_date: start_date,
      start_time: startTime, end_time: endTime,
      location, url,
      sponsor: '', contact: '', contact_email: '', views: 0, originating_calendar: '',
    });
  }
  return events;
}

// ─── iSchool (month-by-month pages) ──────────────────────────────────────────

function parseISchoolHTML(html: string, yyyymm: string): EventData[] {
  const events: EventData[] = [];
  const year  = parseInt(yyyymm.slice(0, 4), 10);
  const month = yyyymm.slice(4, 6);

  // Date headers: <h3>April 1 Wednesday</h3>  (or similar)
  // Event links: <a href="/news-events/events/YYYY/MM/DD/slug">Title</a>
  // Time: plain text near the link

  // Build a flat representation: split on date headers then on event links
  const sections = html.split(/<h3[^>]*>/i);

  for (const section of sections.slice(1)) {
    // Extract day from header text "April 1 Wednesday" → day "01"
    const headerText = section.match(/^([^<]+)/)?.[1]?.trim() ?? '';
    const dayMatch = headerText.match(/\b(\d{1,2})\b/);
    if (!dayMatch) continue;
    const day = dayMatch[1].padStart(2, '0');
    const start_date = `${year}-${month}-${day}`;

    // Find event links in this section (up to next h3)
    const sectionContent = section.match(/^[\s\S]*?(?=<h3|$)/)?.[0] ?? section;
    const linkRe = /<a\s+href="(\/news-events\/events\/\d{4}\/\d{2}\/\d{2}\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let lm: RegExpExecArray | null;

    while ((lm = linkRe.exec(sectionContent)) !== null) {
      const relUrl = lm[1];
      const title  = lm[2].replace(/<[^>]+>/g, '').trim();
      if (!title) continue;
      const url = `https://ischool.illinois.edu${relUrl}`;

      // Time: "1:00 - 3:00 PM" somewhere after the link
      const afterLink = sectionContent.slice(lm.index + lm[0].length, lm.index + lm[0].length + 300);
      const timeText  = afterLink.replace(/<[^>]+>/g, ' ').match(/\d{1,2}:\d{2}\s*[-–]?\s*\d{0,2}:?\d{0,2}\s*(?:AM|PM)/i)?.[0] ?? '';
      const { startTime, endTime } = parseTimeSpan(timeText);

      events.push({
        title, description: '',
        start_date, end_date: start_date,
        start_time: startTime, end_time: endTime,
        location: '', url,
        sponsor: '', contact: '', contact_email: '', views: 0, originating_calendar: '',
      });
    }
  }
  return events;
}

async function scrapeISchoolMultiMonth(baseUrl: string): Promise<EventData[]> {
  const now  = new Date();
  const all: EventData[] = [];

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const yyyymm = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
    const url = `https://ischool.illinois.edu/news-events/events/${yyyymm}?tag=All`;
    try {
      const html = await fetchHtml(url);
      if (html) all.push(...parseISchoolHTML(html, yyyymm));
    } catch (err) {
      console.error(`[iSchool] Error fetching ${yyyymm}:`, err);
    }
  }
  return all;
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

async function scrapeSource(url: string): Promise<EventData[]> {
  const u = url.replace(/\s+/g, '').replace(/\/+$/, '');

  // Known parsers by URL pattern
  if (isUIUCCalendarUrl(u)) return scrapeUIUCCalendar(u);
  if (/krannertcenter\.com\/calendar/i.test(u)) return scrapeKrannertWithDetails(u);
  if (/beckman\.illinois\.edu\/visit\/events/i.test(u)) {
    const html = await fetchHtmlWithBrowser(u);
    return html ? parseBeckmanHTML(html) : [];
  }
  if (/kam\.illinois\.edu\/exhibitions-events\/events/i.test(u)) {
    const html = await fetchHtmlWithBrowser(u);
    return html ? parseKAMHTML(html) : [];
  }
  if (/ischool\.illinois\.edu\/news-events\/events/i.test(u)) {
    return scrapeISchoolMultiMonth(u);
  }
  if (/fightingillini\.com.*\.rss/i.test(u)) {
    const xml = await fetchHtml(u);
    return xml ? parseRSSFeed(xml) : [];
  }
  if (/libcal\.library\.illinois\.edu.*ical/i.test(u)) {
    const ical = await fetchHtml(u);
    return ical ? parseICalFeed(ical) : [];
  }
  if (/spurlock\.illinois\.edu\/events/i.test(u)) {
    const html = await fetchHtml(u);
    return html ? parseSpurlockHTML(html) : [];
  }
  if (/statefarmcenter\.com\/events/i.test(u)) {
    const html = await fetchHtml(u);
    return html ? parseStateFarmCenterHTML(html) : [];
  }
  if (/grainger\.illinois\.edu\/calendars/i.test(u)) {
    const html = await fetchHtml(u);
    return html ? parseGraingerHTML(html) : [];
  }

  // Auto-detect by fetching and examining the HTML
  const html = await fetchHtml(u);
  if (!html) return [];

  if (isIllinoisWPTheme(html)) return enrichWPThemeLocations(parseIllinoisWPTheme(html));
  if (isDrupalEventArticleFormat(html)) return enrichDrupalLocations(parseDrupalEventArticles(html));

  console.log(`[Scraper] No matching parser for: ${u}`);
  return [];
}

// ─── Cross-source deduplication ───────────────────────────────────────────────

interface CollectedEvent extends EventData {
  source_id: number;
  source_name: string;
}

/**
 * Deduplicates events collected from all sources.
 *
 * Matching rules (all case-insensitive, trimmed):
 *   - title must match
 *   - start_date must match
 *   - start_time must match
 *   - location must match when BOTH events have a non-empty location;
 *     if either side has no location, the location field is treated as a wildcard
 *     (e.g. "Commencement" from a source without location data still merges with
 *      "Commencement at Memorial Stadium" from a source that has it)
 *
 * When multiple events are merged, the combined record picks the best available
 * data from every duplicate and records all source URLs for the detail page.
 */
function deduplicateEvents(events: CollectedEvent[]): Array<CollectedEvent & { source_links: string }> {
  // General string normaliser
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

  // Time normaliser: collapse the space before am/pm so "7:30 pm" and "7:30pm" match
  const normTime = (s: string) => norm(s).replace(/(\d)\s+(am|pm)/gi, '$1$2');

  // Location normaliser: strip comma-delimited suffixes for comparison only
  // "Foellinger Great Hall, Krannert Center" → "foellinger great hall"
  // This lets a venue listed with and without its parent building still match.
  const normLoc = (s: string) => norm(s.split(',')[0]);

  // ── Step 1: group by title + date + normalised time ───────────────────────
  const keyMap = new Map<string, CollectedEvent[]>();
  for (const event of events) {
    const key = [norm(event.title), event.start_date, normTime(event.start_time)].join('|||');
    if (!keyMap.has(key)) keyMap.set(key, []);
    keyMap.get(key)!.push(event);
  }

  // ── Step 2: within each group split on location when values conflict ──────
  // Uses normLoc so "Foellinger Great Hall, Krannert Center" and
  // "Foellinger Great Hall" are treated as the same venue.
  // Empty location is treated as a wildcard (merges with any location group).
  const mergeSets: CollectedEvent[][] = [];

  for (const group of keyMap.values()) {
    const nonEmptyNormLocs = [...new Set(group.map(e => normLoc(e.location)).filter(Boolean))];

    if (nonEmptyNormLocs.length <= 1) {
      mergeSets.push(group);
    } else {
      const buckets = new Map<string, CollectedEvent[]>();
      const noLoc: CollectedEvent[] = [];
      for (const e of group) {
        const l = normLoc(e.location);
        if (!l) { noLoc.push(e); continue; }
        if (!buckets.has(l)) buckets.set(l, []);
        buckets.get(l)!.push(e);
      }
      const allBuckets = [...buckets.values()];
      const largest = allBuckets.reduce((a, b) => (a.length >= b.length ? a : b));
      largest.push(...noLoc);
      allBuckets.forEach(b => mergeSets.push(b));
    }
  }

  // ── Step 3: build one merged record per merge set ─────────────────────────
  return mergeSets.map(group => {
    const primary = group[0];

    const description = group
      .map(e => e.description).filter(Boolean)
      .sort((a, b) => b.length - a.length)[0] ?? '';

    const end_date = group
      .map(e => e.end_date || e.start_date).sort().at(-1) ?? primary.end_date;

    // First non-empty value wins for most fields
    const pick = <K extends keyof CollectedEvent>(field: K): CollectedEvent[K] =>
      (group.find(e => e[field])?.[field]) ?? primary[field];

    const sponsor              = pick('sponsor') as string;
    const contact              = pick('contact') as string;
    const contact_email        = pick('contact_email') as string;
    const originating_calendar = pick('originating_calendar') as string;
    // For location, prefer the most specific (longest) non-empty value
    const location = group.map(e => e.location).filter(Boolean)
      .sort((a, b) => b.length - a.length)[0] ?? primary.location;
    const views = Math.max(...group.map(e => e.views ?? 0));

    const seenUrls = new Set<string>();
    const sourceLinks: Array<{ name: string; url: string }> = [];
    for (const e of group) {
      if (e.url && !seenUrls.has(e.url)) {
        seenUrls.add(e.url);
        sourceLinks.push({ name: e.source_name, url: e.url });
      }
    }

    return {
      ...primary,
      description, end_date, location,
      sponsor, contact, contact_email, views, originating_calendar,
      source_links: JSON.stringify(sourceLinks),
    };
  });
}

// ─── Scrape progress (polled by /api/status) ─────────────────────────────────

export const scrapeState = {
  running: false,
  current: 0,
  total: 0,
  currentSource: '',
  completedAt: 0,
};

// ─── Main orchestrator ────────────────────────────────────────────────────────

export async function runScrape(): Promise<{ total: number; errors: string[] }> {
  if (scrapeState.running) return { total: 0, errors: ['Scrape already in progress'] };

  const sources = getActiveSources.all();
  const collected: CollectedEvent[] = [];
  const errors: string[] = [];

  scrapeState.running = true;
  scrapeState.current = 0;
  scrapeState.total = sources.length;
  scrapeState.currentSource = '';

  // ── Phase 1: scrape every active source ──────────────────────────────────
  for (const source of sources) {
    scrapeState.currentSource = source.name;
    try {
      const events = await scrapeSource(source.url);
      for (const e of events) {
        collected.push({ ...e, source_id: source.id, source_name: source.name });
      }
      console.log(`[Scraper] ${source.name}: ${events.length} events`);
    } catch (error) {
      const msg = `Error scraping ${source.name}: ${error instanceof Error ? error.message : String(error)}`;
      console.error(`[Scraper] ${msg}`);
      errors.push(msg);
    }
    scrapeState.current += 1;
  }

  // ── Phase 2: deduplicate across all sources ───────────────────────────────
  const merged = deduplicateEvents(collected);
  console.log(
    `[Scraper] Deduplication: ${collected.length} raw → ${merged.length} unique events`
  );

  // ── Phase 3: replace DB contents for all active sources ──────────────────
  for (const source of sources) {
    deleteEventsBySource.run(source.id);
  }
  for (const event of merged) {
    insertEvent.run(
      event.title, event.description,
      event.start_date, event.end_date,
      event.start_time, event.end_time,
      event.location, event.url,
      event.source_id,
      event.sponsor, event.contact, event.contact_email, event.views, event.originating_calendar,
      event.source_links
    );
  }

  await closeBrowser();
  scrapeState.running = false;
  scrapeState.currentSource = '';
  scrapeState.completedAt = Date.now();
  console.log(`[Scraper] Done. Total unique events stored: ${merged.length}`);
  return { total: merged.length, errors };
}
