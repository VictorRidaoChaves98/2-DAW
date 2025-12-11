# RAG - Retrieval-Augmented Generation

Un sistema que indexa documentos y responde preguntas usando búsqueda vectorial + modelo de lenguaje.

## 🎯 Funcionalidades

- Indexación automática de documentos con embeddings vectoriales.
- Búsqueda semántica en tiempo real usando pgvector (Neon).
- Generación de respuestas fundamentadas en contexto.
- Validación: si no hay información relevante, responde honestamente.

## 🚀 Inicio rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar `.env.local`
```env
DATABASE_URL=postgresql://...     # Tu conexión a Neon
GOOGLE_API_KEY=...                # Google embeddings
GITHUB_MODELS_TOKEN=...           # GitHub Marketplace token
```

### 3. Preparar BD
```bash
npm run db:generate
npm run db:push
```

### 4. Ingestar documento
```bash
npm run ingest
```

### 5. Iniciar servidor
```bash
npm run dev
```
Abre http://localhost:3000 y pregunta sobre RAG.

## 📁 Estructura

```
src/
  app/api/
    rag/          → Pregunta + respuesta (POST)
    health/       → Verificar modelo (GET)
    debug-rag/    → Ver fragmentos (POST)
  page.tsx        → Chat UI
  lib/ai/rag.ts   → Búsqueda vectorial
scripts/ingest.ts → Ingesta de documentos
data/documento.txt → Documento a indexar
```

## 🔌 Endpoints

**POST `/api/rag`** - Pregunta
```bash
curl -X POST http://localhost:3000/api/rag \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"¿Qué es RAG?"}]}'
```

**GET `/api/health`** - Verificar modelo

**POST `/api/debug-rag`** - Ver fragmentos recuperados
```bash
curl -X POST http://localhost:3000/api/debug-rag \
  -H "Content-Type: application/json" \
  -d '{"query":"¿Qué es RAG?","k":5}'
```

## 🛠 Tecnologías

- Next.js 15 + React 19
- PostgreSQL (Neon) + pgvector
- Google Generative AI (embeddings)
- GitHub Models (generación)
- Drizzle ORM

## 📝 Comportamiento

- **Con contexto**: Responde basándose en fragmentos indexados.
- **Sin contexto**: "No tengo suficiente información en mi base de conocimientos para responder a esa pregunta."
- **Fallback**: gpt-4o-mini → gpt-4o si el primero no está disponible.

¡Listo! 🎉
- Lo divide en chunks de 512 caracteres
- Genera embeddings con Google AI (768 dimensiones)
- Almacena chunks + embeddings en PostgreSQL

## 📁 Estructura del Proyecto

```
.
├── data/
│   └── documento.txt           # Tu documento para indexar
├── scripts/
│   └── ingest.ts              # Pipeline de ingesta
├── src/
│   ├── lib/
│   │   ├── db/
│   │   │   └── schema.ts       # Esquema Drizzle
│   │   └── ai/
│   │       └── rag.ts          # Función de búsqueda
│   └── app/
│       └── api/
│           └── rag/
│               └── route.ts    # API de chat con RAG
├── drizzle.config.ts           # Config de migraciones
├── tsconfig.json
└── package.json
```

## 🔄 Cómo Funciona

### Pipeline de Ingesta
1. **Cargar documento** → Lee `data/documento.txt`
2. **Chunking** → Divide en fragmentos de 512 caracteres
3. **Embeddings** → Convierte cada chunk en vector de 768 dims
4. **Almacenamiento** → Guarda en tabla `chunks` de PostgreSQL

### Pipeline de Recuperación
1. **Consulta del usuario** → Se convierte en embedding
2. **Búsqueda de similitud** → Busca chunks similares en BD
3. **Aumentación del prompt** → Añade contexto al LLM
4. **Generación** → Google Gemini responde basado en contexto

## 🧪 Pruebas

Crea un archivo `contrib/test.http` para probar con REST Client:

```http
### Pregunta con contexto
POST http://localhost:3000/api/rag
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "¿Qué es el Vercel AI SDK?"
    }
  ]
}

### Pregunta sin contexto
POST http://localhost:3000/api/rag
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "¿Cuál es la capital de Marte?"
    }
  ]
}
```

## 📚 Recursos

- [Parte 1: Teoría de RAG](https://aperezl.com/post/rag-dotando-de-memoria-a-tu-agente-parte-1)
- [Parte 2: Implementación](https://aperezl.com/post/rag-dotando-de-memoria-a-tu-agente-parte-2)
- [Parte 3: Refactoración y UI](https://aperezl.com/post/rag-dotando-de-memoria-a-tu-agente-parte-3)

## 🛠️ Troubleshooting

### Error: "DATABASE_URL not defined"
- Verifica que `.env.local` existe y tiene la URL correcta
- Asegúrate de que PostgreSQL está accesible

### Error: "pgvector extension not found"
- Ejecuta en psql: `CREATE EXTENSION IF NOT EXISTS vector;`
- Algunos servicios como Neon lo habilitan automáticamente

### Error: "GOOGLE_API_KEY not found"
- Obtén tu API key en https://aistudio.google.com/app/apikey
- Cópiala en `.env.local`

## 📖 Próximos Pasos

1. Customizar `data/documento.txt` con tu propio contenido
2. Crear una UI de chat con React/Next.js
3. Implementar múltiples documentos
4. Añadir soporte para PDFs y otros formatos

¡Disfruta tu asistente de IA con memoria! 🚀
