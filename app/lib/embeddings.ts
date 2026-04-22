import fs from 'fs';
import path from 'path';

const EMB_PATH = path.join(process.env.DATA_DIR ?? process.cwd(), 'embeddings.json');
const COHERE_URL = 'https://api.cohere.com/v2/embed';
const MODEL = 'embed-english-light-v3.0';
const BATCH_SIZE = 90;

type EmbeddingStore = Record<string, number[]>;

function readStore(): EmbeddingStore {
  try {
    if (!fs.existsSync(EMB_PATH)) return {};
    return JSON.parse(fs.readFileSync(EMB_PATH, 'utf8')) as EmbeddingStore;
  } catch {
    return {};
  }
}

function writeStore(store: EmbeddingStore): void {
  fs.writeFileSync(EMB_PATH, JSON.stringify(store), 'utf8');
}

async function cohereEmbed(
  texts: string[],
  inputType: 'search_document' | 'search_query'
): Promise<number[][]> {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) throw new Error('COHERE_API_KEY not set');

  const res = await fetch(COHERE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      input_type: inputType,
      texts,
      embedding_types: ['float'],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cohere ${res.status}: ${body}`);
  }

  const data = await res.json();
  return (data.embeddings?.float ?? []) as number[][];
}

/** Re-embed all events after each scrape. Called from runScrape(). */
export async function buildEmbeddings(
  events: { id: number; title: string; description: string }[]
): Promise<void> {
  if (!process.env.COHERE_API_KEY) {
    console.log('[Embeddings] No COHERE_API_KEY — skipping');
    return;
  }

  const store: EmbeddingStore = {};

  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const batch = events.slice(i, i + BATCH_SIZE);
    const texts = batch.map(e => `${e.title}\n${e.description || ''}`);

    try {
      const embeddings = await cohereEmbed(texts, 'search_document');
      for (let j = 0; j < batch.length; j++) {
        store[String(batch[j].id)] = embeddings[j];
      }
      console.log(`[Embeddings] ${Math.min(i + BATCH_SIZE, events.length)}/${events.length}`);
    } catch (err) {
      console.error(`[Embeddings] Batch ${i} failed:`, err);
    }

    // Respect Cohere free-tier rate limits
    if (i + BATCH_SIZE < events.length) {
      await new Promise(r => setTimeout(r, 700));
    }
  }

  writeStore(store);
  console.log(`[Embeddings] Stored ${Object.keys(store).length} embeddings`);
}

export function getEmbeddingMap(): Map<number, number[]> {
  const store = readStore();
  return new Map(
    Object.entries(store).map(([k, v]) => [parseInt(k), v])
  );
}

export async function embedQuery(query: string): Promise<number[]> {
  const results = await cohereEmbed([query], 'search_query');
  return results[0] ?? [];
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}
