import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chunks } from '../db/schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sql } from 'drizzle-orm';

// Conexión a la BBDD (reutilizable)
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

const googleClient = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function findRelevantChunks(query: string, k: number = 3) {
  // 1. Generar el embedding para la pregunta del usuario
  const embeddingModel = googleClient.getGenerativeModel({
    model: 'text-embedding-004',
  });

  const result = await embeddingModel.embedContent(query);
  const embedding = result.embedding.values;

  // 2. Búsqueda de similitud en la base de datos vectorial
  const similarity = sql<number>`1 - (${chunks.embedding} <=> ${JSON.stringify(embedding)})`;
  
  const relevantChunks = await db
    .select({
      content: chunks.content,
      similarity: similarity,
    })
    .from(chunks)
    .where(sql`${similarity} > 0.5`)
    .orderBy((t) => sql`(${t.similarity}) DESC`)
    .limit(k);

  return relevantChunks;
}
