// HTML parser to extract events from UIUC calendar pages
// Events are rendered as HTML, not in JSON format

function parseUICCCalendarHTML(html) {
  const events = [];
  
  try {
    // Parse event entries from HTML
    // Events are in <li class="entry ..."> elements within <ul class="event-entries">
    const entryRegex = /<li class="entry[^>]*>[\s\S]*?<\/li>/g;
    const entries = html.match(entryRegex) || [];
    
    entries.forEach((entry, idx) => {
      try {
        // Extract event ID from href="/detail/7?eventId=XXXXX"
        const eventIdMatch = entry.match(/eventId=(\d+)/);
        if (!eventIdMatch) return;
        
        const eventId = eventIdMatch[1];
        
        // Extract title from <h3><a href="...">Title</a></h3>
        const titleMatch = entry.match(/<h3><a[^>]*>([^<]+)/);
        const title = titleMatch ? titleMatch[1].trim() : 'Untitled Event';
        
        // Extract date from <div class="date">...</div>
        // The date text comes after the SVG icon
        const dateMatch = entry.match(/<div class="date">[^<]*<svg[^<]*<\/svg>([^<]+)<\/div>/);
        const dateStr = dateMatch ? dateMatch[1].trim() : '';
        
        // Extract location from <span title="..." class="location">location name</span>
        const locationMatch = entry.match(/<span[^>]*class="location"[^>]*title="([^"]*)"[^>]*>([^<]*)<\/span>/);
        const location = locationMatch ? locationMatch[1] || locationMatch[2] : '';
        
        // Extract event type from <li class="type"><a href="/search/...">Type</a></li>
        const typeMatch = entry.match(/<li class="type"><a[^>]*>([^<]+)<\/a><\/li>/);
        const eventType = typeMatch ? typeMatch[1] : 'General Event';
        
        // Extract summary from <div class="summary"><p>...</p></div>
        const summaryMatch = entry.match(/<div class="summary">\s*<p>([^<]*)<\/p>/);
        const summary = summaryMatch ? summaryMatch[1].trim() : '';
        
        // Parse date string to create start and end dates
        // Format example: "All Day" or "1:00  - 3:00 pm"
        // Date is inferred from the HTML structure (they show "Thursday, May 28, 2026" before each list)
        let startDate = new Date().toISOString().split('T')[0]; // Default to today
        let endDate = startDate;
        
        if (dateStr.includes('All Day')) {
          // This is an all-day event
          // We need to extract the date from the context above the event
          // For now, set it to today
        }
        
        // Create event object
        const event = {
          id: parseInt(eventId),
          title,
          location,
          category: eventType,
          start_date: startDate,
          end_date: endDate,
          start_time: dateStr,
          description: summary,
          source_url: `https://calendars.illinois.edu/detail/7?eventId=${eventId}`,
          source_id: 0 // Will be set by caller
        };
        
        events.push(event);
      } catch (e) {
        console.warn('Error parsing individual event:', e.message);
      }
    });
  } catch (e) {
    console.error('Error parsing calendar HTML:', e.message);
  }
  
  return events;
}

module.exports = { parseUICCCalendarHTML };
