// Scans calendars.illinois.edu/list/0 through /list/9999 for valid calendar pages.
// Runs 25 requests concurrently; writes results to calendar_scan_results.txt.

const CONCURRENCY = 25;
const BASE = 'https://calendars.illinois.edu/list/';
const TIMEOUT_MS = 10000;

const valid = [];
const errors = [];

async function check(id) {
  const url = `${BASE}${id}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; UIUC-Calendar-Scanner/1.0)' },
    });
    if (res.status === 200) {
      const text = await res.text();
      // A real calendar page has a <title> with the calendar name, not a generic error page
      const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch?.[1]?.replace(/\s+/g, ' ').trim() ?? '';
      // Skip generic "Page Not Found" or empty titles
      if (title && !title.toLowerCase().includes('not found') && !title.toLowerCase().includes('error')) {
        valid.push({ id, url, title });
        process.stdout.write(`\r[${id.toString().padStart(4, '0')}] FOUND: ${title.slice(0, 60)}\n`);
      }
    }
  } catch {
    // timeout or network error — skip silently
  }
}

async function runBatch(ids) {
  await Promise.all(ids.map(id => check(id)));
}

async function main() {
  const total = 10000;
  console.log(`Scanning ${BASE}0 through ${BASE}${total - 1} with concurrency ${CONCURRENCY}...`);
  console.log('(This will take a few minutes)\n');

  const start = Date.now();

  for (let i = 0; i < total; i += CONCURRENCY) {
    const batch = [];
    for (let j = i; j < Math.min(i + CONCURRENCY, total); j++) batch.push(j);
    await runBatch(batch);

    if ((i + CONCURRENCY) % 500 === 0) {
      const elapsed = ((Date.now() - start) / 1000).toFixed(0);
      const pct = ((i + CONCURRENCY) / total * 100).toFixed(1);
      process.stdout.write(`  Progress: ${pct}% (${i + CONCURRENCY}/${total}) — ${elapsed}s elapsed — ${valid.length} found so far\n`);
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s. Found ${valid.length} valid calendars.\n`);

  const lines = valid
    .sort((a, b) => a.id - b.id)
    .map(v => `${v.url.padEnd(45)}  ${v.title}`)
    .join('\n');

  const fs = await import('fs');
  fs.writeFileSync('calendar_scan_results.txt', lines + '\n');
  console.log('Results saved to calendar_scan_results.txt');
  console.log('\nSample:\n' + lines.split('\n').slice(0, 10).join('\n'));
}

main().catch(console.error);
