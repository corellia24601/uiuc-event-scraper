(async () => {
  try {
    console.log('Fetching calendar from https://calendars.illinois.edu/list/7...');
    const response = await fetch('https://calendars.illinois.edu/list/7');
    if (!response.ok) {
      console.log('HTTP Error:', response.status, response.statusText);
      return;
    }
    const html = await response.text();
    console.log('✓ Fetched HTML, length:', html.length);
    
    // Look for date headers
    const dateHeaderRegex = /<h[2-3][^>]*>([A-Za-z]+,?\s+[A-Za-z]+\s+\d{1,2},?\s+\d{4})<\/h[2-3]>/g;
    const dateHeaders = html.match(dateHeaderRegex);
    console.log('\nDate headers found:', dateHeaders ? dateHeaders.length : 0);
    if (dateHeaders) {
      console.log('Sample:', dateHeaders.slice(0, 3).map(h => h.replace(/<[^>]+>/g, '')));
    }
    
    // Look for event entries
    const entryRegex = /<li class="entry[^>]*>[\s\S]*?<\/li>/g;
    const entries = html.match(entryRegex);
    console.log('\nEvent entries found:', entries ? entries.length : 0);
    
    // Check for keywords
    console.log('\nKeyword checks:');
    console.log('- Contains "April":', html.includes('April'));
    console.log('- Contains "h2":', html.includes('<h2'));
    console.log('- Contains "<li class=\"entry":', html.includes('<li class="entry'));
    console.log('- Contains "First-Gen":', html.includes('First-Gen'));
    console.log('- Contains "Francophone":', html.includes('Francophone'));
    
    // Show first 2000 chars
    console.log('\nFirst 2000 characters of HTML:');
    console.log(html.substring(0, 2000));
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
