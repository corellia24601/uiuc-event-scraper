# UIUC Event Scraper

A web application for scraping and searching events from University of Illinois Urbana-Champaign (UIUC) and its affiliates. Built with Next.js, featuring a searchable event database and an editable source pool.

## Features

- **Event Search**: Search through scraped events with a user-friendly interface
- **Source Management**: Add, edit, and manage event sources from official UIUC calendars
- **Automatic Scraping**: Scrape events from iCal feeds and HTML pages
- **Database Storage**: Persistent storage using SQLite

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Database Setup

The application uses SQLite for data storage. The database file (`events.db`) will be created automatically when the application starts.

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

### Initial Setup

1. Go to the Sources page (`/sources`)
2. Click "Initialize Sources" to load the default UIUC event sources
3. Click "Scrape Events" to fetch events from active sources
4. Return to the home page to search through the events

## Usage

### Searching Events

- Use the search bar on the home page to find events by title or description
- Events are displayed with date, location, and source information
- Click on event links to view more details

### Managing Sources

- Visit `/sources` to view and manage event sources
- Add new sources by clicking "Add Source"
- Edit existing sources by clicking "Edit"
- Toggle sources on/off using the Active checkbox
- Delete sources if no longer needed

### Scraping Events

- Click "Scrape Events" on the home page to update the event database
- The scraper processes all active sources and updates the database
- This may take some time depending on the number of sources

## API Endpoints

- `GET /api/events` - Retrieve events (with optional search query)
- `POST /api/scrape` - Trigger event scraping
- `GET /api/sources` - Get all sources
- `POST /api/sources` - Create a new source
- `GET /api/sources/[id]` - Get a specific source
- `PUT /api/sources/[id]` - Update a source
- `DELETE /api/sources/[id]` - Delete a source
- `POST /api/init` - Initialize default sources

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with better-sqlite3
- **Scraping**: node-ical for iCal feeds, cheerio for HTML parsing
- **Search**: Fuse.js for fuzzy search

## Contributing

1. Add new sources through the web interface
2. Improve scraping logic for additional calendar formats
3. Enhance the search functionality
4. Add more event metadata

## License

This project is for educational purposes. Please respect the terms of service of the scraped websites.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
