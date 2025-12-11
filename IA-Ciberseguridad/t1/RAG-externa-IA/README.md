# 🎯 RAG - Memoria Externa para la IA

Este proyecto implementa un sistema **Retrieval-Augmented Generation (RAG)** para dotar a un asistente de IA de memoria externa mediante PostgreSQL con extensión `pgvector`.

## 📋 Requisitos

- Node.js 18+
- PostgreSQL 13+ con extensión `pgvector`
- API Key de Google AI

## 🚀 Pasos de Setup

### 1. Instalar dependencias

```bash
npm install
# o
pnpm install
```

### 2. Configurar variables de entorno

Edita el archivo `.env.local` con tu información:

```env
DATABASE_URL=postgresql://usuario:contraseña@host:5432/nombre_bd
GOOGLE_API_KEY=tu_api_key
```

**Para obtener una BD PostgreSQL gestionada:**
- Usa [Neon](https://neon.tech) (recomendado)
- Usa [Supabase](https://supabase.com)

Ambos servicios incluyen `pgvector` habilitado por defecto.

### 3. Crear la tabla en la base de datos

```bash
npm run db:generate    # Genera la migración SQL
npm run db:push        # Aplica la migración a la BD
```

### 4. Ejecutar el script de ingesta

```bash
npm run ingest
```

Este script:
- Lee `data/documento.txt`
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
