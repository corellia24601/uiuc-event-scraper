async function findEventData() {
  try {
    const url = 'https://calendars.illinois.edu/list/7';
    console.log('Fetching:', url);
    const res = await fetch(url);
    const html = await res.text();
    
    console.log('Page size:', html.length, 'bytes');
    
    // Search for API endpoints
    const apiMatches = html.match(/https?:\/\/[^\s"'<>]*\/api[^\s"'<>]*/gi) || [];
    if (apiMatches.length > 0) {
      console.log('\nAPI endpoints found:');
      [...new Set(apiMatches)].slice(0, 5).forEach(api => console.log('  ' + api));
    }
    
    // Search for .json files
    const jsonMatches = html.match(/https?:\/\/[^\s"'<>]*\.json[^\s"'<>]*/gi) || [];
    if (jsonMatches.length > 0) {
      console.log('\nJSON URLs found:');
      [...new Set(jsonMatches)].slice(0, 5).forEach(url => console.log('  ' + url));
    }
    
    // Search for service names (data-service attributes)
    const serviceMatches = html.match(/data-service="[^"]*"/gi) || [];
    if (serviceMatches.length > 0) {
      console.log('\nServices found:');
      [...new Set(serviceMatches)].slice(0, 5).forEach(s => console.log('  ' + s));
    }
    
    // Search for calendar IDs or feed URLs
    const feedMatches = html.match(/\/(calendar|feed|events|ics)[^\s"'<>]*/gi) || [];
    if (feedMatches.length > 0) {
      console.log('\nFeed-like URLs:');
      [...new Set(feedMatches)].slice(0, 5).forEach(f => console.log('  ' + f));
    }
    
    // Look for window.__data or similar
    const dataMatches = html.match(/window\.__\w+\s*=\s*\{[^}]{0,100}/g) || [];
    if (dataMatches.length > 0) {
      console.log('\nData assignment patterns found:', dataMatches.length);
      dataMatches.slice(0, 2).forEach(d => console.log('  ' + d.substring(0, 60) + '...'));
    }

    // Try to find embedded JSON
    const jsonStart = html.indexOf('{"');
    if (jsonStart >= 0) {
      const jsonSnippet = html.substring(jsonStart, Math.min(jsonStart + 200, html.length));
      console.log('\nEmbedded JSON found around position', jsonStart);
      console.log('Snippet:', jsonSnippet.substring(0, 100) + '...');
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  }
}

findEventData();
