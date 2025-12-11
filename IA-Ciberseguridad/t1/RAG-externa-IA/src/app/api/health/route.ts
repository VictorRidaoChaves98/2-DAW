export const maxDuration = 15;

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_MODELS_TOKEN;
    if (!githubToken) {
      return new Response(
        JSON.stringify({ ok: false, reason: 'missing_token', message: 'GITHUB_MODELS_TOKEN no está definido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1) Intentar listar modelos disponibles (no siempre soportado, pero útil si está)
    const listResp = await fetch('https://models.inference.ai.azure.com/models', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${githubToken}` },
    });

    let listData: any = null;
    if (listResp.ok) {
      listData = await listResp.json();
    }

    // 2) Fallback: hacer una generación mínima con o4-mini
    const chatResp = await fetch('https://models.inference.ai.azure.com/chat/completions?api-version=2024-08-01-preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Quick health check. Respond with OK.' },
          { role: 'user', content: 'OK' }
        ],
        temperature: 0,
        max_tokens: 10,
      }),
    });

    const chatData = await chatResp.json();
    const okMsg = chatData?.choices?.[0]?.message?.content || null;

    return new Response(
      JSON.stringify({
        ok: chatResp.ok,
        modelCheck: !!okMsg,
        message: okMsg,
        listSupported: listResp.ok,
        models: listData ?? null,
        status: chatResp.status,
        errors: chatResp.ok ? null : chatData,
      }),
      { status: chatResp.ok ? 200 : 502, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, reason: 'exception', message: err?.message ?? 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
