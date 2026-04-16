(async () => {
  try {
    const response = await fetch('https://calendars.illinois.edu/list/7');
    if (!response.ok) {
      console.log('HTTP Error:', response.status, response.statusText);
      return;
    }
    const html = await response.text();
    console.log('Successfully fetched calendar');
    console.log('HTML length:', html.length);
    
    // Check for date headers
    const dateHeaders = html.match(/<h[2-3][^>]*>[A-Za-z]+,?\s+[A-Za-z]+\s+\d{1,2},?\s+\d{4}<\/h[2-3]>/g);
    console.log('Date headers found:', dateHeaders ? dateHeaders.length : 0);
    if (dateHeaders) console.log('Sample:', dateHeaders.slice(0, 3));
    
    // Check for April 15 specifically
    if (html.includes('April 15')) console.log('✓ Contains April 15');
    if (html.includes('First-Gen')) console.log('✓ Contains First-Gen event');
    
    // Find First-Gen event context
    const idx = html.indexOf('First-Gen');
    if (idx > 0) {
      console.log('\nFirst-Gen context (500 chars around):');
      console.log(html.substring(Math.max(0, idx - 250), Math.min(html.length, idx + 250)));
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
