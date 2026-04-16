async function testCalendarFeed() {
  const url = 'https://calendars.illinois.edu/list/7';
  console.log('Fetching:', url);
  
  const res = await fetch(url);
  const text = await res.text();
  
  // Find any .ics URLs
  const icsMatches = text.match(/https?:\/\/[^\s"'<>]*\.ics[^\s"'<>]*/gi);
  if (icsMatches) {
    console.log('\nFound iCal URLs:');
    [...new Set(icsMatches.slice(0, 3))].forEach(url => console.log('  ' + url));
    
    // Try fetching the first one
    if (icsMatches.length > 0) {
      const feedUrl = icsMatches[0];
      console.log('\nTrying first feed:', feedUrl);
      const feedRes = await fetch(feedUrl);
      console.log('Feed status:', feedRes.status);
      if (feedRes.ok) {
        const feedText = await feedText();
        const eventCount = (feedText.match(/BEGIN:VEVENT/g) || []).length;
        console.log('Events found:', eventCount);
      }
    }
  } else {
    console.log('\nNo iCal URLs found');
    // Look for other patterns
    const allUrls = text.match(/https?:\/\/[^\s"'<>]+/gi) || [];
    console.log('Sample URLs in page:', [...new Set(allUrls.slice(0, 5))]);
  }
}

testCalendarFeed().catch(e => console.error('Error:', e.message));
