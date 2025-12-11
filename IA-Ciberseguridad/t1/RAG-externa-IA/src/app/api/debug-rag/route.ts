import { findRelevantChunks } from '@/lib/ai/rag';

export const maxDuration = 15;

export async function POST(req: Request) {
  try {
    const { query, k = 5 } = await req.json();
    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'query requerido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const chunks = await findRelevantChunks(query, k);

    return new Response(
      JSON.stringify({
        count: chunks.length,
        chunks: chunks.map((c: any) => ({ id: c.id, content: c.content, similarity: c.similarity ?? null })),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? 'Unexpected error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
