import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { chunks as chunksSchema } from '../src/lib/db/schema';
import { promises as fs } from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Implementar chunking manualmente
function chunkText(text: string, chunkSize: number = 512, overlap: number = 50): string[] {
  const chunks: string[] = [];
  let currentPos = 0;

  while (currentPos < text.length) {
    const chunk = text.slice(currentPos, currentPos + chunkSize);
    chunks.push(chunk);
    currentPos += chunkSize - overlap;
  }

  return chunks;
}

// Función auxiliar para dividir un array en lotes de un tamaño específico
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

async function main() {
  console.log('Iniciando pipeline de ingesta...');

  // 1. Conectar a la base de datos
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('La variable de entorno DATABASE_URL no está definida.');
  }
  const dbClient = postgres(connectionString, { max: 1 });
  const db = drizzle(dbClient);
  console.log('Conectado a la base de datos.');

  // 2. Cargar y Extraer Texto del Documento
  const filePath = path.join(process.cwd(), 'data', 'documento.txt');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  console.log('Documento cargado.');

  // 3. Chunking (División) del Documento
  const textChunks = chunkText(fileContent, 512, 50);
  console.log(`Documento dividido en ${textChunks.length} chunks.`);

  // Define el tamaño del lote
  const BATCH_SIZE = 100;
  const textChunksBatches = chunkArray(textChunks, BATCH_SIZE);

  console.log(`Procesando en ${textChunksBatches.length} lotes de hasta ${BATCH_SIZE} chunks cada uno.`);

  for (let i = 0; i < textChunksBatches.length; i++) {
    const batch = textChunksBatches[i];
    console.log(`Procesando lote ${i + 1}/${textChunksBatches.length} con ${batch.length} chunks...`);

    // 4. Generación de Embeddings para el lote actual
    console.log('Generando embeddings para el lote...');
    const embeddingModel = client.getGenerativeModel({
      model: 'text-embedding-004',
    });

    const embeddings = [];
    for (const text of batch) {
      const result = await embeddingModel.embedContent(text);
      embeddings.push(result.embedding.values);
    }
    console.log(`Se generaron ${embeddings.length} embeddings para el lote.`);

    // 5. Almacenamiento en la Base de Datos Vectorial para el lote actual
    const dataToInsert = batch.map((content, j) => ({
      content,
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
