const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data.json'), 'utf8'));

// Clear old events
data.events = [];

// Add some test events for demo purposes
const today = new Date();
const createEvent = (title, daysFromNow, sourceId, id) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysFromNow);
  const dateStr = date.toISOString().split('T')[0];
  return {
    id,
    title,
    description: `Demo event for testing the event scraper UI. Click "View Details" to see more information about this event.`,
    start_date: dateStr + 'T10:00:00Z',
    end_date: dateStr + 'T11:30:00Z',
    location: 'University of Illinois Urbana-Champaign',
    url: 'https://illinois.edu',
    source_id: sourceId,
  };
};

// Add demo events with IDs starting from 1000 to avoid conflicts with scraped events
const events = [
  createEvent('Engineering Career Fair', 5, 1, 1000),
  createEvent('Computer Science Seminar', 7, 6, 1001),
  createEvent('Art Exhibition Opening', 10, 20, 1002),
  createEvent('Music Performance by School of Music', 12, 49, 1003),
  createEvent('Library Workshop: Research Methods', 14, 23, 1004),
  createEvent('Krannert Center: Classical Concert', 20, 19, 1005),
  createEvent('Campus Recreation: Intramural Football', 3, 34, 1006),
  createEvent('International Students Networking Event', 8, 43, 1007),
  createEvent('Business School Alumni Dinner', 15, 8, 1008),
  createEvent('Beckman Institute Research Showcase', 18, 26, 1009),
];

data.events = events;
fs.writeFileSync(path.join(process.cwd(), 'data.json'), JSON.stringify(data, null, 2), 'utf8');

console.log('Created', events.length, 'demo events');
events.forEach(e => console.log('  - [ID:', e.id + ']', e.title, 'on', e.start_date.slice(0, 10)));

