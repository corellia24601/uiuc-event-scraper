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
}

interface DbState {
  sources: SourceRow[];
  events: EventRow[];
}

// Resolve data.json location - check multiple possible locations
const getDbPath = () => {
  const possiblePaths = [
    // Absolute path to project
    'D:\\a_NTU\\CV\\DTX 451\\uiuc-event-scraper\\data.json',
    
    // Try current working directory
    path.join(process.cwd(), 'data.json'),
    
    // Try parent directories
    path.join(process.cwd(), '..', 'data.json'),
    path.join(process.cwd(), '..', '..', 'data.json'),
    path.join(process.cwd(), '..', '..', '..', 'uiuc-event-scraper', 'data.json'),
  ];

  for (const checkPath of possiblePaths) {
    if (fs.existsSync(checkPath)) {
      return checkPath;
    }
  }

  // Default fallback
  return 'D:\\a_NTU\\CV\\DTX 451\\uiuc-event-scraper\\data.json';
};

function readDb(): DbState {
  const dbPath = getDbPath();
  
  if (!fs.existsSync(dbPath)) {
    const initial: DbState = { sources: [], events: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }

  const raw = fs.readFileSync(dbPath, 'utf8');
  try {
    return JSON.parse(raw) as DbState;
  } catch {
    const initial: DbState = { sources: [], events: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

function writeDb(data: DbState) {
  const dbPath = getDbPath();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

function joinEvent(event: EventRow, sources: SourceRow[]) {
  const source = sources.find((s) => s.id === event.source_id);
  return {
    ...event,
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
  run: (title: string, description: string, start_date: string, end_date: string, start_time: string, end_time: string, location: string, url: string, source_id: number) => {
    const db = readDb();
    const nextId = db.events.length > 0 ? Math.max(...db.events.map((event) => event.id), 0) + 1 : 1;
    db.events.push({
      id: nextId,
      title,
      description,
      start_date,
      end_date,
      start_time,
      end_time,
      location,
      url,
      source_id,
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

export const getUpcomingEvents = {
  all: (today: string) => {
    const db = readDb();
    return db.events
      .filter((event) => event.start_date >= today)
      .sort((a, b) => a.start_date.localeCompare(b.start_date))
      .map((event) => joinEvent(event, db.sources));
  },
};

export const searchEvents = {
  all: (titleQuery: string, descriptionQuery: string, today: string) => {
    const db = readDb();
    const query = titleQuery.toLowerCase();
    return db.events
      .filter((event) =>
        event.start_date >= today &&
        (event.title.toLowerCase().includes(query) || event.description.toLowerCase().includes(query))
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
