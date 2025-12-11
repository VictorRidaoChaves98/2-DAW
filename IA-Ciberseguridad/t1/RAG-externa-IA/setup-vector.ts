import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_3E8nKviaRXcq@ep-divine-waterfall-agyorrkp.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function enableVector() {
  try {
    const client = postgres(connectionString);
    await client`CREATE EXTENSION IF NOT EXISTS vector`;
    console.log('✅ pgvector extension habilitada!');
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

enableVector();
