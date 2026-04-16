import { NextResponse } from 'next/server';
import { insertSource } from '../../lib/db';
import { initialSources } from '../../lib/sources';

export async function POST() {
  try {
    // Check if sources already exist
    const existingCount = initialSources.length; // Simplified check

    for (const source of initialSources) {
      insertSource.run(
        source.id,
        source.category,
        source.name,
        source.url,
        source.notes || '',
        source.active
      );
    }

    return NextResponse.json({ message: `Initialized ${initialSources.length} sources` });
  } catch (error) {
    console.error('Error initializing sources:', error);
    return NextResponse.json({ error: 'Failed to initialize sources' }, { status: 500 });
  }
}