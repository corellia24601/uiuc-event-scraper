import { NextRequest, NextResponse } from 'next/server';
import { getUpcomingEvents } from '../../lib/db';
import { embedQuery, getEmbeddingMap, cosineSimilarity } from '../../lib/embeddings';

const SEMANTIC_THRESHOLD = 0.3;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!q) return NextResponse.json([]);

  const today = new Date().toISOString().split('T')[0];

  try {
    const [queryEmbedding, embeddingMap] = await Promise.all([
      embedQuery(q),
      Promise.resolve(getEmbeddingMap()),
    ]);

    if (queryEmbedding.length === 0) {
      return NextResponse.json({ error: 'Embedding failed' }, { status: 500 });
    }

    const events = getUpcomingEvents.all(today);
    const results = events
      .map(e => ({
        id: e.id,
        score: embeddingMap.has(e.id)
          ? cosineSimilarity(queryEmbedding, embeddingMap.get(e.id)!)
          : 0,
      }))
      .filter(r => r.score >= SEMANTIC_THRESHOLD)
      .sort((a, b) => b.score - a.score);

    return NextResponse.json(results);
  } catch (err) {
    console.error('[Search] Semantic search failed:', err);
    return NextResponse.json({ error: 'Semantic search unavailable' }, { status: 500 });
  }
}
