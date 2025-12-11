# 🔧 SETUP DETALLADO - Pasos para ejecutar el proyecto

## Pre-requisitos

1. **Node.js** 18 o superior
   - Descarga desde https://nodejs.org/

2. **PostgreSQL 13+** con pgvector
   - **Opción A (Recomendada - Neon)**: https://neon.tech
   - **Opción B (Alternativa - Supabase)**: https://supabase.com
   - **Opción C (Local)**: Instala PostgreSQL localmente y habilita pgvector

3. **Google AI API Key**
   - Ve a https://aistudio.google.com/app/apikey
   - Crea una nueva API key
   - Cópiala (la necesitarás en paso 5)

## Pasos para Setup

### Paso 1: Clonar/Abrir el proyecto

```bash
# Si aún no lo has hecho:
cd c:\Proyectos\Repos\2-DAW\IA-Ciberseguridad\t1\RAG-externa-IA
```

### Paso 2: Instalar dependencias

```bash
npm install
# o si usas pnpm:
pnpm install
```

Esto descargará:
- `ai` y `@ai-sdk/google` para modelos de IA
- `drizzle-orm` para operaciones con BD
- `langchain` para procesamiento de texto
- `postgres` cliente para PostgreSQL
- Y más...

### Paso 3: Crear archivo `.env.local`

Edita el archivo `.env.local` (ya existe, solo reemplaza los valores):

```env
DATABASE_URL=postgresql://usuario:contraseña@host:5432/nombre_bd
GOOGLE_API_KEY=tu_api_key_aquí
```

**Ejemplos según donde tengas PostgreSQL:**

#### Si usas Neon:
1. Ve a https://neon.tech y crea una cuenta
2. Crea un proyecto
3. Copia la connection string (incluye usuario, contraseña, host)
4. Reemplaza en DATABASE_URL

**Ejemplo Neon:**
```env
DATABASE_URL=postgresql://neondb_owner:abc123@ep-cool-lake-123456.us-east-1.neon.tech/neondb
```

#### Si usas Supabase:
1. Ve a https://supabase.com y crea una cuenta
2. Crea un proyecto
3. Copia la URI de conexión desde Settings > Database
4. Reemplaza en DATABASE_URL

**Ejemplo Supabase:**
```env
DATABASE_URL=postgresql://postgres:contraseña@db.supabase.co:5432/postgres
```

#### Si usas PostgreSQL Local:
```env
DATABASE_URL=postgresql://postgres:tu_contraseña@localhost:5432/rag_ia
```

**IMPORTANTE**: Asegúrate de que pgvector está habilitado:
```bash
# Desde psql (línea de comandos de PostgreSQL):
psql -U postgres -d tu_bd -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### Paso 4: Crear la tabla en la BD

Una vez que `.env.local` está correctamente configurado:

```bash
# Genera la migración SQL
npm run db:generate

# Aplica la migración a tu base de datos
npm run db:push
```

**Qué hace esto:**
- Genera un archivo SQL en carpeta `drizzle/`
- Crea la tabla `chunks` con columnas:
  - `id`: Identificador único
  - `content`: Texto del chunk
  - `embedding`: Vector de 768 dimensiones
  - `createdAt`: Timestamp

### Paso 5: Preparar documento para indexar

El archivo `data/documento.txt` ya viene con contenido de ejemplo.

**Para usar tu propio documento:**
1. Reemplaza el contenido de `data/documento.txt`
2. Puede ser cualquier texto: artículos, documentación, etc.

**Tamaño recomendado**: 5KB - 1MB para testing

### Paso 6: Ejecutar la ingesta

```bash
npm run ingest
```

**Qué pasa:**
1. Lee `data/documento.txt`
2. Lo divide en chunks de 512 caracteres (solapados en 50)
3. Genera embeddings con Google AI (768 dims cada uno)
4. Guarda en PostgreSQL

**Output esperado:**
```
Iniciando pipeline de ingesta...
Conectado a la base de datos.
Documento cargado.
Documento dividido en X chunks.
Procesando en 1 lotes de hasta 100 chunks cada uno.
Procesando lote 1/1 con X chunks...
Generando embeddings para el lote...
Se generaron X embeddings para el lote.
Insertando chunks y embeddings del lote en la base de datos...
¡Inserción del lote 1 completada!
Pipeline de ingesta finalizada con éxito.
```

**Si hay errores:**

| Error | Solución |
|-------|----------|
| DATABASE_URL not defined | Verifica que `.env.local` existe y tiene la URL correcta |
| GOOGLE_API_KEY not defined | Asegúrate de haber puesto tu API key en `.env.local` |
| ECONNREFUSED | PostgreSQL no está accesible. Verifica la URL. |
| pgvector extension not found | Ejecuta `CREATE EXTENSION IF NOT EXISTS vector;` en psql |
| 429 Too Many Requests | Google está limitando por tasa. Espera un minuto. |

## Verificación

### Verificar que los datos se insertaron correctamente

Desde psql o tu cliente de BD:

```sql
SELECT count(*) FROM chunks;  -- Debe mostrar un número > 0
SELECT content LIMIT 1;       -- Muestra el primer chunk
SELECT embedding LIMIT 1;     -- Muestra el primer embedding
```

### Probar la búsqueda de similitud manualmente

```typescript
// En un archivo test.ts:
import { findRelevantChunks } from './src/lib/ai/rag';

const results = await findRelevantChunks("¿Qué es RAG?", 3);
console.log(results);
```

## Próximo Paso: API de Chat

Una vez que la ingesta funciona, puedes:

1. Crear una API REST que use `findRelevantChunks()`
2. Conectar un frontend React para chatear
3. Implementar persistencia de conversación

Ver `src/app/api/rag/route.ts` para el ejemplo de API implementado.

## Tips Útiles

### Aumentar cantidad de chunks recuperados
```typescript
// En rag.ts:
export async function findRelevantChunks(query: string, k: number = 5) { 
  // k = 5 en lugar de 3 da más contexto
```

### Cambiar tamaño de chunks
```typescript
// En scripts/ingest.ts:
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1024,  // Más grande = más contexto, menos precisión
  chunkOverlap: 100,
});
```

### Cambiar umbral de similitud
```typescript
// En rag.ts:
where(sql`${similarity} > 0.4`)  // Más bajo = más resultados
```

## Troubleshooting

### "Error: Cannot find module '@ai-sdk/google'"
```bash
npm install @ai-sdk/google
```

### "Error: dial tcp: lookup on "host": no such host"
La URL de PostgreSQL es inválida. Verifica:
- Hostname correcto
- Puerto correcto (típicamente 5432)
- Usuario y contraseña correctos

### "Error: permission denied for database"
Tu usuario de PostgreSQL no tiene permisos. Usa un usuario admin.

### "Error: table chunks does not exist"
No ejecutaste `npm run db:push`. Ejecuta los pasos 4 nuevamente.

## Arquitectura Final

```
Cliente (React/Frontend)
    ↓
API /api/rag
    ↓
findRelevantChunks()
    ↓
PostgreSQL (búsqueda vectorial)
    ↓
Contexto + Prompt
    ↓
Google Gemini (LLM)
    ↓
Respuesta al cliente
```

¡Listo! Tu sistema RAG debería estar operativo. 🚀
