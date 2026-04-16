import { NextResponse } from 'next/server';
import { getActiveSources, insertEvent, deleteEventsBySource } from '../../lib/db';

interface EventData {
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  start_time: string;
  end_time: string;
  location?: string;
  url?: string;
}

function normalizeUrl(url: string): string {
  return url.replace(/\s+/g, '').replace(/\/+$/g, '');
}

function getListUrl(url: string): string {
  const normalized = normalizeUrl(url);
  const match = normalized.match(/(https?:\/\/[^/]+\/)?(?:calendar\/)?list\/(\d+)/i);
  if (match) {
    return `https://calendars.illinois.edu/list/${match[2]}`;
  }
  return normalized;
}

function parseCalendarHTML(html: string): EventData[] {
  const events: EventData[] = [];
  
  try {
    // Decode HTML entities like &nbsp;
    const decodedHtml = html
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    
    // Split by date headers - look for h2 tags like "<h2>Tuesday, April 7, 2026</h2>"
    const dateHeaderRegex = /<h2[^>]*>([A-Za-z]+,\s+[A-Za-z]+\s+\d{1,2},\s+\d{4})<\/h2>/g;
    const entries = decodedHtml.split(dateHeaderRegex);
    
    let currentDate: Date | null = null;
    
    for (let i = 0; i < entries.length; i++) {
      const section = entries[i];
      
      // If this looks like a date string (from the split), parse it
      if (i % 2 === 1) {
        try {
          // Parse date like "Tuesday, April 7, 2026" or "Wednesday, April 15, 2026"
          const dateStr = section.trim();
          currentDate = new Date(dateStr);
        } catch (e) {
          currentDate = null;
        }
        continue;
      }
      
      if (!currentDate) continue;
      
      // Extract events from this section
      const entryRegex = /<li class="entry[^>]*>[\s\S]*?<\/li>/g;
      const sectionEntries = section.match(entryRegex) || [];
      
      sectionEntries.forEach((entry) => {
        try {
          // Extract event ID
          const eventIdMatch = entry.match(/eventId=(\d+)/);
          if (!eventIdMatch) return;
          
          // Extract title from <h3><a href="...">Title</a></h3>
          const titleMatch = entry.match(/<h3><a[^>]*>([^<]+)/);
          const title = titleMatch ? titleMatch[1].trim() : 'Untitled Event';
          
          // Extract location from <span class="location" title="...">
          const locationMatch = entry.match(/<span[^>]*class="location"[^>]*title="([^"]*)"/);
          const location = locationMatch ? locationMatch[1] : '';
          
          // Extract summary
          const summaryMatch = entry.match(/<div class="summary">\s*<p>([^<]*)<\/p>/);
          const summary = summaryMatch ? summaryMatch[1].trim() : '';
          
          // Extract date/time span to check for multi-day events and get times
          const dateSpanMatch = entry.match(/<div class="date">[^<]*<svg[^<]*<\/svg>([^<]+)<\/div>/);
          const dateSpanStr = dateSpanMatch ? dateSpanMatch[1].trim() : '';
          
          let startTime = '';
          let endTime = '';
          
          // Parse time from dateSpanStr
          // Patterns: "All Day", "1:00  - 3:00 pm", "6:00 - 8:00 pm", "6:30 pm"
          if (dateSpanStr.toLowerCase().includes('all day')) {
            startTime = '';
            endTime = '';
          } else {
            // Try to extract time range
            const timeMatch = dateSpanStr.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})\s*(am|pm)?/i);
            if (timeMatch) {
              const startHour = timeMatch[1];
              const startMin = timeMatch[2];
              const endHour = timeMatch[3];
              const endMin = timeMatch[4];
              const period = timeMatch[5] || (dateSpanStr.includes('pm') ? 'pm' : 'am');
              
              startTime = `${startHour}:${startMin} ${period}`;
              endTime = `${endHour}:${endMin} ${period}`;
            } else {
              // Try to extract single time
              const singleTimeMatch = dateSpanStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
              if (singleTimeMatch) {
                const hour = singleTimeMatch[1];
                const min = singleTimeMatch[2];
                const period = singleTimeMatch[3] || (dateSpanStr.includes('pm') ? 'pm' : 'am');
                startTime = `${hour}:${min} ${period}`;
                endTime = '';
              }
            }
          }
          
          // currentDate is guaranteed to exist here due to the continue above
          const safeCurrentDate = currentDate as Date;
          let endDate = new Date(safeCurrentDate.getTime());
          
          // Check if it's a multi-day event (contains "to" or date range)
          if (dateSpanStr.toLowerCase().includes('to ')) {
            // Try to parse end date from span
            const toMatch = dateSpanStr.match(/to\s+([A-Za-z]+\s+\d{1,2})/i);
            if (toMatch) {
              const endDateStr = toMatch[1] + ' ' + safeCurrentDate.getFullYear();
              endDate = new Date(endDateStr);
            }
          }
          
          const event: EventData = {
            title,
            description: summary,
            start: safeCurrentDate,
            end: endDate,
            start_time: startTime,
            end_time: endTime,
            location,
            url: `https://calendars.illinois.edu/detail/7?eventId=${eventIdMatch[1]}`,
          };
          
          events.push(event);
        } catch (e) {
          // Skip malformed entries
        }
      });
    }
  } catch (e) {
    console.error('Error parsing calendar HTML:', e);
  }
  
  return events;
}

async function scrapeCalendarHTML(url: string): Promise<EventData[]> {
  try {
    const listUrl = getListUrl(url);
    const response = await fetch(listUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`Unable to fetch calendar page from ${listUrl}: ${response.status}`);
      return [];
    }

    const html = await response.text();
    return parseCalendarHTML(html);
  } catch (error) {
    console.error(`Error scraping calendar from ${url}:`, error);
    return [];
  }
}

export async function POST() {
  try {
    const sources = getActiveSources.all() as { id: number; name: string; url: string }[];
    let totalScraped = 0;
    const errors: string[] = [];

    for (const source of sources) {
      try {
        console.log(`Scraping source: ${source.name}`);
        deleteEventsBySource.run(source.id);

        const events = await scrapeCalendarHTML(source.url);

        for (const event of events) {
          try {
            insertEvent.run(
              event.title,
              event.description || '',
              event.start.toISOString().split('T')[0],
              event.end?.toISOString().split('T')[0] || event.start.toISOString().split('T')[0],
              event.start_time,
              event.end_time,
              event.location || '',
              event.url || '',
              source.id
            );
            totalScraped++;
          } catch (error) {
            console.error(`Error inserting event ${event.title}:`, error);
          }
        }

        if (events.length === 0) {
          console.log(`No events found for ${source.name}`);
        } else {
          console.log(`Inserted ${events.length} events from ${source.name}`);
        }
      } catch (error) {
        const msg = `Error scraping ${source.name}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(msg);
        errors.push(msg);
      }
    }

    return NextResponse.json({
      message: `Scraping completed. Total events scraped: ${totalScraped}`,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error during scraping:', error);
    return NextResponse.json(
      { error: 'Scraping failed: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}