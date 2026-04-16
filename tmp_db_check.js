const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(process.cwd(), 'events.db'), { readonly: true });
const sources = db.prepare('SELECT count(*) as cnt FROM sources').get();
const events = db.prepare('SELECT count(*) as cnt FROM events').get();
console.log('sources', sources.cnt, 'events', events.cnt);
const first = db.prepare('SELECT e.id,e.title,e.start_date,e.description,s.name as source_name FROM events e JOIN sources s ON e.source_id=s.id ORDER BY e.start_date LIMIT 5').all();
console.log(JSON.stringify(first, null, 2));
db.close();
