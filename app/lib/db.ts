import fs from 'fs';
import path from 'path';

export interface SourceRow {
  id: number;
  category: string;
  name: string;
  url: string;
  notes: string;
  active: boolean;
}

export interface EventRow {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: string;
  url: string;
  source_id: number;
  // UIUC Calendar-specific attributes (empty string / 0 for other sources)
  sponsor: string;
  contact: string;
  contact_email: string;
  views: number;
  originating_calendar: string;
  /** JSON-encoded Array<{ name: string; url: string }> — all sources this event was found in */
  source_links: string;
}

interface DbState {
  sources: SourceRow[];
  events: EventRow[];
}

const DB_PATH = path.join(process.env.DATA_DIR ?? process.cwd(), 'data.json');

function readDb(): DbState {
  if (!fs.existsSync(DB_PATH)) {
    const initial: DbState = { sources: [], events: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }

  const raw = fs.readFileSync(DB_PATH, 'utf8');
  try {
    return JSON.parse(raw) as DbState;
  } catch {
    const initial: DbState = { sources: [], events: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

function writeDb(data: DbState) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function joinEvent(event: EventRow, sources: SourceRow[]) {
  const source = sources.find((s) => s.id === event.source_id);
  return {
    ...event,
    // Provide defaults for fields that may be missing in older stored records
    sponsor: event.sponsor ?? '',
    contact: event.contact ?? '',
    contact_email: event.contact_email ?? '',
    views: event.views ?? 0,
    originating_calendar: event.originating_calendar ?? '',
    source_links: event.source_links ?? '[]',
    source_name: source?.name || 'Unknown Source',
    category: source?.category || 'Uncategorized',
  };
}

export const getSources = {
  all: () => readDb().sources.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)),
};

export const getActiveSources = {
  all: () => readDb().sources.filter((source) => source.active).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)),
};

export const insertSource = {
  run: (id: number, category: string, name: string, url: string, notes: string, active: boolean) => {
    const db = readDb();
    const existingIndex = db.sources.findIndex((source) => source.id === id);
    const newSource: SourceRow = { id, category, name, url, notes, active };
    if (existingIndex >= 0) {
      db.sources[existingIndex] = newSource;
    } else {
      db.sources.push(newSource);
    }
    writeDb(db);
  },
};

export const updateSource = {
  run: (category: string, name: string, url: string, notes: string, active: boolean, id: number) => {
    const db = readDb();
    const source = db.sources.find((s) => s.id === id);
    if (!source) return;
    source.category = category;
    source.name = name;
    source.url = url;
    source.notes = notes;
    source.active = active;
    writeDb(db);
  },
};

export const deleteSource = {
  run: (id: number) => {
    const db = readDb();
    db.sources = db.sources.filter((source) => source.id !== id);
    writeDb(db);
  },
};

export const insertEvent = {
  run: (
    title: string, description: string,
    start_date: string, end_date: string,
    start_time: string, end_time: string,
    location: string, url: string,
    source_id: number,
    sponsor = '', contact = '', contact_email = '', views = 0, originating_calendar = '',
    source_links = '[]'
  ) => {
    const db = readDb();
    const nextId = db.events.length > 0 ? Math.max(...db.events.map((event) => event.id), 0) + 1 : 1;
    db.events.push({
      id: nextId,
      title, description,
      start_date, end_date,
      start_time, end_time,
      location, url,
      source_id,
      sponsor, contact, contact_email, views, originating_calendar,
      source_links,
    });
    writeDb(db);
  },
};

export const getEvents = {
  all: () => {
    const db = readDb();
    return db.events
      .slice()
      .sort((a, b) => a.start_date.localeCompare(b.start_date))
      .map((event) => joinEvent(event, db.sources));
  },
};

/** An event is "upcoming" if it hasn't fully ended yet.
 *  For multi-day events (start ≠ end) use end_date; otherwise use start_date. */
function isUpcoming(event: EventRow, today: string): boolean {
  const cutoff = event.end_date && event.end_date > event.start_date
    ? event.end_date
    : event.start_date;
  return cutoff >= today;
}

export const getUpcomingEvents = {
  all: (today: string) => {
    const db = readDb();
    return db.events
      .filter((event) => isUpcoming(event, today))
      .sort((a, b) => a.start_date.localeCompare(b.start_date))
      .map((event) => joinEvent(event, db.sources));
  },
};

export const searchEvents = {
  all: (query: string, today: string) => {
    const db = readDb();
    const q = query.toLowerCase();
    return db.events
      .filter((event) =>
        isUpcoming(event, today) &&
        (event.title.toLowerCase().includes(q) || event.description.toLowerCase().includes(q))
      )
      .sort((a, b) => a.start_date.localeCompare(b.start_date))
      .map((event) => joinEvent(event, db.sources));
  },
};

export const deleteEventsBySource = {
  run: (source_id: number) => {
    const db = readDb();
    db.events = db.events.filter((event) => event.source_id !== source_id);
    writeDb(db);
  },
};
