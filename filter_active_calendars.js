// Reads calendar_scan_results.txt, fetches each URL, and keeps only those
// that actually contain events (not "There are no events for this criteria").

import fs from 'fs';

const CONCURRENCY = 30;
const TIMEOUT_MS = 12000;

const lines = fs.readFileSync('calendar_scan_results.txt', 'utf8')
  .split('\n').filter(Boolean);

// Parse "url   title" lines
const entries = lines.map(line => {
  const parts = line.trim().split(/\s{2,}/);
  return { url: parts[0].trim(), title: parts.slice(1).join('  ').trim() };
}).filter(e => e.url.startsWith('http'));

console.log(`Checking ${entries.length} calendars for active events (concurrency=${CONCURRENCY})...\n`);

const active = [];
let checked = 0;
const start = Date.now();

async function checkOne({ url, title }) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; UIUC-Calendar-Filter/1.0)' },
      redirect: 'follow',
    });
    if (!res.ok) return;
    const html = await res.text();
    // Pages with no events contain this phrase
    const empty =
      html.includes('There are no events for this criteria') ||
      html.includes('no events for this criteria') ||
      html.includes('No events found');
    if (!empty) {
      active.push({ url, title });
      process.stdout.write(`  [ACTIVE] ${title.slice(0, 60)}\n`);
    }
  } catch {
    // timeout or network error — skip
  }
  checked++;
  if (checked % 100 === 0) {
    const pct = (checked / entries.length * 100).toFixed(1);
    const elapsed = ((Date.now() - start) / 1000).toFixed(0);
    process.stdout.write(`  Progress: ${pct}% (${checked}/${entries.length}) — ${elapsed}s — ${active.length} active so far\n`);
  }
}

async function runBatch(batch) {
  await Promise.all(batch.map(checkOne));
}

async function main() {
  for (let i = 0; i < entries.length; i += CONCURRENCY) {
    await runBatch(entries.slice(i, i + CONCURRENCY));
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s. ${active.length} calendars have active events.\n`);

  const out = active
    .map(({ url, title }) => `${url.padEnd(45)}  ${title}`)
    .join('\n');
  fs.writeFileSync('active_calendars.txt', out + '\n');
  console.log('Saved to active_calendars.txt');
}

main().catch(console.error);
