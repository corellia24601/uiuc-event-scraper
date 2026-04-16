import { NextRequest, NextResponse } from 'next/server';
import { getSources, insertSource } from '../../lib/db';
import { Source } from '../../lib/sources';

export async function GET() {
  try {
    const sources = getSources.all() as Source[];
    return NextResponse.json(sources);
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Omit<Source, 'id'> & { id?: number } = await request.json();
    const { id, category, name, url, notes, active } = body;

    if (!category || !name || !url) {
      return NextResponse.json({ error: 'Category, name, and url are required' }, { status: 400 });
    }

    // If id is provided, it's an update; otherwise, insert new
    const newId = id || Date.now(); // Simple ID generation
      insertSource.run(newId, category, name, url, notes || '', active ?? true);
    return NextResponse.json({ id: newId, message: 'Source saved successfully' });
  } catch (error) {
    console.error('Error saving source:', error);
    return NextResponse.json({ error: 'Failed to save source' }, { status: 500 });
  }
}