import { findRelevantChunks } from '@/lib/ai/rag';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1];
    const lastUserMessageText = lastUserMessage.parts?.map((part: any) => 
      part.type === 'text' ? part.text : ''
    ).join('') || lastUserMessage.content;

    // 1. Realizar la búsqueda de similitud para obtener contexto
    const relevantChunks = await findRelevantChunks(lastUserMessageText, 5);

    // 2. Construir el contexto para el prompt
    const context = relevantChunks.map(chunk => chunk.content).join('\n---\n');

    // 2.1. Si no hay contexto relevante, responder inmediatamente y evitar llamadas al LLM
    if (!context || context.trim().length === 0) {
      return new Response(
        JSON.stringify({
          id: Date.now().toString(),
          role: 'assistant',
          content: 'No tengo suficiente información en mi base de conocimientos para responder a esa pregunta.',
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 3. Crear el prompt aumentado
    const systemPrompt = `Eres un asistente experto. Responde a la pregunta del usuario basándote únicamente en el siguiente contexto. Si la respuesta no se encuentra en el contexto, responde "No tengo suficiente información en mi base de conocimientos para responder a esa pregunta". No inventes información ni respondas con datos fuera del contexto.

Contexto:
---
${context}
---

Pregunta del usuario: ${lastUserMessageText}`;

    // 4. Llamar al LLM usando GitHub Models (OpenAI o4-mini)
    const githubToken = process.env.GITHUB_MODELS_TOKEN;
    if (!githubToken) {
      throw new Error('Falta GITHUB_MODELS_TOKEN en el entorno');
    }

    async function chatWithModel(model: string) {
      return await fetch(
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
              { role: 'system', content: 'Eres un asistente experto y honesto. Usa solo el contexto proporcionado.' },
              { role: 'user', content: systemPrompt }
            ],
            temperature: 0.2,
          }),
        }
      );
    }

    // Intentar primero con gpt-4o-mini, luego fallback a gpt-4o
    let response = await chatWithModel('gpt-4o-mini');
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      // Fallback solo si es 404/400/422 (modelo no disponible)
      if ([404, 400, 422].includes(response.status)) {
        response = await chatWithModel('gpt-4o');
      } else {
        throw new Error(`GitHub Models error: ${JSON.stringify({ status: response.status, err: errData })}`);
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Google API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'No se pudo generar una respuesta.';

    return new Response(
      JSON.stringify({
        id: Date.now().toString(),
        role: 'assistant',
        content: assistantMessage,
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Error en la API de chat con RAG:", error);
    return new Response(
      JSON.stringify({ error: "Un error inesperado ha ocurrido." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
