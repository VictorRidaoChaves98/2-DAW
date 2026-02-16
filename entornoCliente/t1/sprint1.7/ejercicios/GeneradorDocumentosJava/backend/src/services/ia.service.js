// IA service: robust caller for local LMStudio-like HTTP APIs.
// Tries multiple common endpoints and payload shapes, caches a working route.

let fetchImpl = globalThis.fetch;
if (!fetchImpl) {
  try {
    const nf = require('node-fetch');
    fetchImpl = nf.default || nf;
  } catch (e) {
    fetchImpl = null;
  }
}

const LMSTUDIO_URL = (process.env.LMSTUDIO_URL || 'http://127.0.0.1:1234').replace(/\/$/, '');
const LMSTUDIO_MODEL = process.env.LMSTUDIO_MODEL || 'qwen/qwen3-4b-2507';
const LMSTUDIO_KEY = process.env.LMSTUDIO_API_KEY || process.env.LMSTUDIO_KEY || null;

// cache a discovered working endpoint and template index
const endpointCache = { path: process.env.LMSTUDIO_API_PATH || null, templateIndex: null };

const candidatePaths = (p => {
  const base = ['/api/generate','/api/v1/generate','/v1/generate','/api/infer','/api/v1/infer','/generate','/v1/chat/completions','/v1/complete','/api/v1/complete','/api/llm/v1'];
  if (p) return [p].concat(base.filter(x=>x!==p));
  return base;
})(process.env.LMSTUDIO_API_PATH);

const bodyTemplates = [
  (model, prompt) => ({ model, prompt }),
  (model, prompt) => ({ model, input: prompt }),
  (model, prompt) => ({ model, inputs: prompt }),
  (model, prompt) => ({ input: prompt }),
  (model, prompt) => ({ prompt }),
  (model, prompt) => ({ model, messages: [{ role: 'user', content: prompt }] }),
  (model, prompt) => ({ messages: [{ role: 'user', content: prompt }] })
];

function extractTextFromJson(json) {
  if (!json) return null;
  if (typeof json === 'string') return json;
  if (typeof json.text === 'string') return json.text;
  if (typeof json.output === 'string') return json.output;
  if (typeof json.result === 'string') return json.result;
  if (json.output && typeof json.output.text === 'string') return json.output.text;
  if (Array.isArray(json.data) && json.data[0]) {
    if (typeof json.data[0].text === 'string') return json.data[0].text;
    if (typeof json.data[0].generated_text === 'string') return json.data[0].generated_text;
  }
  if (Array.isArray(json.choices) && json.choices[0]) {
    if (json.choices[0].message && json.choices[0].message.content) return json.choices[0].message.content;
    if (typeof json.choices[0].text === 'string') return json.choices[0].text;
  }
  if (json.results && Array.isArray(json.results) && json.results[0] && json.results[0].output_text) return json.results[0].output_text;
  // fallback: try common nested fields
  const maybe = json.response || json.reply || json.output?.[0] || null;
  if (typeof maybe === 'string') return maybe;
  return null;
}

async function tryRequest(url, body, timeoutMs, headers) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetchImpl(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!resp.ok) {
      const txt = await resp.text().catch(()=>'');
      throw new Error(`status ${resp.status}: ${txt}`);
    }
    const json = await resp.json().catch(async ()=> ({ text: await resp.text().catch(()=>'') }));
    return json;
  } finally {
    clearTimeout(timer);
  }
}

async function callAI(prompt, options = {}) {
  if (!fetchImpl) {
    console.warn('No fetch available; returning fallback.');
    return { text: `Echo (no-fetch): ${String(prompt).slice(0,200)}` };
  }

  const timeoutMs = options.timeout || 20000;
  const maxRetries = options.retries != null ? options.retries : 1;
  const model = options.model || LMSTUDIO_MODEL;

  const headersBase = { 'Content-Type': 'application/json' };
  if (LMSTUDIO_KEY) headersBase['Authorization'] = `Bearer ${LMSTUDIO_KEY}`;

  // If we already discovered a working path/template, try it first
  const pathsToTry = endpointCache.path ? [endpointCache.path].concat(candidatePaths.filter(p=>p!==endpointCache.path)) : candidatePaths;

  for (const path of pathsToTry) {
    for (let t = 0; t < bodyTemplates.length; t++) {
      const body = bodyTemplates[t](model, String(prompt));
      const url = `${LMSTUDIO_URL}${path}`;
      try {
        const json = await tryRequest(url, body, timeoutMs, headersBase);
        const text = extractTextFromJson(json);
        if (text) {
          endpointCache.path = path;
          endpointCache.templateIndex = t;
          return { text, raw: json };
        }
        // if server returned an error object, skip and try other endpoints
        if (json && (json.error || json.errors)) {
          continue;
        }
        // if response contains structured candidate fields but no plain text, return stringified form
        const hasCandidate = json && (json.choices || json.data || json.results || json.output || json.message);
        if (hasCandidate) {
          endpointCache.path = path;
          endpointCache.templateIndex = t;
          return { text: JSON.stringify(json), raw: json };
        }
      } catch (err) {
        // continue to next template/path
        // console.debug(`IA try ${url} with template ${t} failed: ${err.message}`);
      }
    }
  }

  // retries with exponential backoff
  for (let attempt=0; attempt<=maxRetries; attempt++) {
    try {
      // fallback: try a minimal /api/generate with model+input
      const fallbackUrl = `${LMSTUDIO_URL}/api/generate`;
      const fallbackBody = { model, input: String(prompt) };
      const json = await tryRequest(fallbackUrl, fallbackBody, timeoutMs, headersBase);
      const text = extractTextFromJson(json);
      if (text) return { text, raw: json };
    } catch (e) {
      // ignore
    }
    await new Promise(r=>setTimeout(r, 500 * (attempt+1)));
  }

  return { text: `Echo (fallback): ${String(prompt).slice(0,200)}` };
}

module.exports = { callAI };
