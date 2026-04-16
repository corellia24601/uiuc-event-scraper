import { NextRequest, NextResponse } from 'next/server';
import { getSources, updateSource, deleteSource, deleteEventsBySource } from '../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const sources = getSources.all() as { id: number; category: string; name: string; url: string; notes: string; active: boolean }[];
    const source = sources.find(s => s.id === parseInt(id));
    if (!source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }
    return NextResponse.json(source);
  } catch (error) {
    console.error('Error fetching source:', error);
    return NextResponse.json({ error: 'Failed to fetch source' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { category, name, url, notes, active } = body;

    if (!category || !name || !url) {
      return NextResponse.json({ error: 'Category, name, and url are required' }, { status: 400 });
    }

    updateSource.run(category, name, url, notes || '', active ?? true, parseInt(id));

    return NextResponse.json({ message: 'Source updated successfully' });
  } catch (error) {
    console.error('Error updating source:', error);
    return NextResponse.json({ error: 'Failed to update source' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Delete associated events first
    deleteEventsBySource.run(parseInt(id));
    // Then delete the source
    deleteSource.run(parseInt(id));

    return NextResponse.json({ message: 'Source deleted successfully' });
  } catch (error) {
    console.error('Error deleting source:', error);
    return NextResponse.json({ error: 'Failed to delete source' }, { status: 500 });
  }
}