import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chunks } from '../db/schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sql } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL not configured');
}

const client = postgres(connectionString);
const db = drizzle(client);

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_API_KEY not configured');
}

const googleClient = new GoogleGenerativeAI(apiKey);
const embeddingModel = googleClient.getGenerativeModel({ model: 'text-embedding-004' });

const SIMILARITY_THRESHOLD = 0.5;

export async function findRelevantChunks(query: string, k: number = 3) {
  // 1. Generate embedding for query
  const result = await embeddingModel.embedContent(query);
  const embedding = result.embedding.values;

  // 2. Vector similarity search in pgvector
  const similarity = sql<number>`1 - (${chunks.embedding} <=> ${JSON.stringify(embedding)})`;
  
  const relevantChunks = await db
    .select({
      id: chunks.id,
      content: chunks.content,
      similarity,
    })
    .from(chunks)
    .where(sql`${similarity} > ${SIMILARITY_THRESHOLD}`)
    .orderBy((t) => sql`${t.similarity} DESC`)
    .limit(k);

  return relevantChunks;
}
