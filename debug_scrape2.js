(async () => {
  try {
    const response = await fetch('https://calendars.illinois.edu/list/7');
    const html = await response.text();
    
    // Find all h2 tags
    const h2Regex = /<h2[^>]*>[^<]*<\/h2>/g;
    const h2Tags = html.match(h2Regex);
    console.log('H2 tags found:', h2Tags ? h2Tags.length : 0);
    if (h2Tags) {
      console.log('Sample h2 tags:');
      h2Tags.slice(0, 10).forEach(tag => console.log('-', tag.substring(0, 150)));
    }
    
    // Also check h3
    const h3Regex = /<h3[^>]*>[^<]*<\/h3>/g;
    const h3Tags = html.match(h3Regex);
    console.log('\nH3 tags found:', h3Tags ? h3Tags.length : 0);
    if (h3Tags) {
      console.log('Sample h3 tags:');
      h3Tags.slice(0, 5).forEach(tag => console.log('-', tag.substring(0, 150)));
    }
    
    // Check for date-like content
    const dateMatch = html.match(/\b(April|May|June)\s+\d{1,2},?\s+\d{4}\b/g);
    console.log('\nDate strings found:', dateMatch ? dateMatch.length : 0);
    if (dateMatch) {
      console.log('Sample:', dateMatch.slice(0, 5));
    }
    
    // Look for the actual entry structure
    const entryMatch = html.match(/<li class="entry[^>]*>[\s\S]{0,500}<\/li>/);
    if (entryMatch) {
      console.log('\nFirst event entry structure (first 500 chars):');
      console.log(entryMatch[0]);
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
