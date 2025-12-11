import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chunks as chunksSchema } from '../src/lib/db/schema';
import { promises as fs } from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const CHUNK_SIZE = 512;
const CHUNK_OVERLAP = 50;
const BATCH_SIZE = 100;

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_API_KEY not configured');
}

const googleClient = new GoogleGenerativeAI(apiKey);
const embeddingModel = googleClient.getGenerativeModel({
  model: 'text-embedding-004',
});

function chunkText(text: string, size: number = CHUNK_SIZE, overlap: number = CHUNK_OVERLAP): string[] {
  const chunks: string[] = [];
  let pos = 0;

  while (pos < text.length) {
    chunks.push(text.slice(pos, pos + size));
    pos += size - overlap;
  }

  return chunks;
}

function batchArray<T>(array: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    batches.push(array.slice(i, i + size));
  }
  return batches;
}

async function ingestDocument() {
  console.log('Starting ingestion pipeline...\n');

  // 1. Database connection
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL not configured');
  }

  const dbClient = postgres(dbUrl, { max: 1 });
  const db = drizzle(dbClient);
  console.log('✓ Connected to database');

  // 2. Load document
  const filePath = path.join(process.cwd(), 'data', 'documento.txt');
  const content = await fs.readFile(filePath, 'utf-8');
  console.log('✓ Document loaded');

  // 3. Chunk text
  const textChunks = chunkText(content);
  console.log(`✓ Document split into ${textChunks.length} chunks\n`);

  // 4. Process in batches
  const batches = batchArray(textChunks, BATCH_SIZE);
  console.log(`Processing ${batches.length} batches...\n`);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Batch ${i + 1}/${batches.length} (${batch.length} chunks)`);

    // Generate embeddings
    const embeddings = [];
    for (const text of batch) {
      const result = await embeddingModel.embedContent(text);
      embeddings.push(result.embedding.values);
    }
    console.log(`  ✓ Generated ${embeddings.length} embeddings`);

    // Store in database
    const records = batch.map((content, idx) => ({
      content,
      embedding: embeddings[idx],
    }));

    await db.insert(chunksSchema).values(records);
    console.log(`  ✓ Stored in database\n`);
  }

  console.log('✓ Ingestion complete!');
  await dbClient.end();
}

ingestDocument().catch(console.error);
      embedding: embeddings[j],
    }));
    console.log('Insertando chunks y embeddings del lote en la base de datos...');
    await db.insert(chunksSchema).values(dataToInsert);
    console.log(`¡Inserción del lote ${i + 1} completada!`);
  }

  // Cerrar la conexión
  await dbClient.end();
  console.log('Pipeline de ingesta finalizada con éxito.');
}

main().catch((error) => {
  console.error('Ha ocurrido un error en la pipeline de ingesta:', error);
  process.exit(1);
});
