import { findRelevantChunks } from '@/lib/ai/rag';

export const maxDuration = 30;

const NO_INFO_MESSAGE = 'No tengo suficiente información en mi base de conocimientos para responder a esa pregunta.';
const SYSTEM_PROMPT_BASE = 'Eres un asistente experto y honesto. Usa solo el contexto proporcionado. Si la respuesta no está en el contexto, responde con el mensaje exacto: "No tengo suficiente información en mi base de conocimientos para responder a esa pregunta."';

function extractUserMessage(msg: any): string {
  if (typeof msg.content === 'string') return msg.content;
  if (Array.isArray(msg.parts)) {
    return msg.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('');
  }
  return '';
}

async function callGitHubModel(model: string, prompt: string): Promise<Response> {
  const githubToken = process.env.GITHUB_MODELS_TOKEN;
  if (!githubToken) {
    throw new Error('GITHUB_MODELS_TOKEN not configured');
  }

  return fetch(
    'https://models.inference.ai.azure.com/chat/completions?api-version=2024-08-01-preview',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT_BASE },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      }),
    }
  );
}

function createResponse(content: string, status: number = 200): Response {
  return new Response(
    JSON.stringify({
      id: Date.now().toString(),
      role: 'assistant',
      content,
    }),
    { headers: { 'Content-Type': 'application/json' }, status }
  );
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages?.length) {
      return createResponse('Por favor, envía un mensaje válido.', 400);
    }

    const lastUserMessage = messages[messages.length - 1];
    const userText = extractUserMessage(lastUserMessage);

    if (!userText.trim()) {
      return createResponse('Por favor, escribe una pregunta válida.', 400);
    }

    // Recuperar contexto relevante
    const relevantChunks = await findRelevantChunks(userText, 5);
    const context = relevantChunks.map(c => c.content).join('\n---\n');

    // Si no hay contexto, responder inmediatamente
    if (!context?.trim()) {
      return createResponse(NO_INFO_MESSAGE);
    }

    // Construir prompt aumentado
    const ragPrompt = `Contexto:\n---\n${context}\n---\n\nPregunta del usuario: ${userText}`;

    // Intentar gpt-4o-mini, fallback a gpt-4o
    let response = await callGitHubModel('gpt-4o-mini', ragPrompt);
    if (!response.ok && [404, 400, 422].includes(response.status)) {
      response = await callGitHubModel('gpt-4o', ragPrompt);
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`Model error: ${JSON.stringify(errData)}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'No se pudo generar una respuesta.';

    return createResponse(content);
      const errorData = await response.json();
  } catch (error) {
    console.error('RAG API error:', error);
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return createResponse(`Error: ${message}`, 500);
  }
}
