# 🎮 Crisis Core Materia API

> Servidor proxy desarrollado para la asignatura **DWES** que actúa como puente entre usuarios y la API externa de Crisis Core Materia Fusion.

[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?logo=express)](https://expressjs.com/)
[![Axios](https://img.shields.io/badge/Axios-1.6.2-5A29E4?logo=axios)](https://axios-http.com/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?logo=swagger)](https://swagger.io/)

---

## 📑 Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Arquitectura](#arquitectura)
3. [Instalación](#instalación)
4. [Endpoints](#endpoints)
5. [Guía de Uso](#guía-de-uso)
6. [Documentación Swagger](#documentación-swagger)
7. [Instrucciones de Prueba](#instrucciones-de-prueba)
8. [Estructura del Proyecto](#estructura-del-proyecto)
9. [Cambios Realizados](#cambios-realizados)
10. [Tecnologías Utilizadas](#tecnologías-utilizadas)

---

## 📖 Descripción del Proyecto

El objetivo del proyecto es implementar una **API REST que consulta información sobre materias** del videojuego Crisis Core Final Fantasy VII, proporcionando funcionalidades avanzadas de:

* **Filtrado** por nombre y tipo
* **Ordenación** por cualquier campo (ascendente/descendente)
* **Paginación** configurable
* **Consulta del estado** de la API externa
* **Obtención de materias individuales** por ID
* **Documentación técnica completa** con OpenAPI 3.x (Swagger)

### API Externa

Este proyecto consulta la siguiente API:

- **Base URL**: `https://crisis-core-materia-fusion-api-546461677134.us-central1.run.app`
- **Estado**: `/status`
- **Materias**: `/materia`

---

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura modular de 3 capas** que permite reutilización de código y separación de responsabilidades:

### Estructura en 3 Capas

```
src/services/
├── materia-core.js      ← Capa 1: HTTP Base (Axios)
├── materia-client.js    ← Capa 2: Cliente API (Funciones específicas)
└── materia.service.js   ← Capa 3: Lógica de negocio (Orquestación)
```

### 🔧 Capa 1: materia-core.js (HTTP Base)

**Responsabilidad:** Funciones base para peticiones HTTP usando Axios

**Funciones exportadas:**
- `sendRequest(endpoint, method, options)` - Función base genérica
- `get(endpoint, params)` - Petición GET
- `post(endpoint, body)` - Petición POST
- `patch(endpoint, body)` - Petición PATCH
- `del(endpoint)` - Petición DELETE
- `getBaseUrl()` - Obtener URL base

**Características:**
- ✅ Maneja la configuración de Axios
- ✅ Gestiona la URL base de la API
- ✅ Logging de todas las peticiones
- ✅ Manejo de errores HTTP
- ✅ Reutilizable para cualquier endpoint

### 🎨 Capa 2: materia-client.js (Cliente API)

**Responsabilidad:** Funciones específicas de la API de Crisis Core

**Funciones de consulta:**
- `getStatus()` - Estado de API
- `getAllMaterias()` - Todas las materias
- `getMateriaById(id)` - Materia por ID

**Funciones de datos:**
- `filterByName(materias, searchTerm)` - Filtrar por nombre
- `filterByType(materias, searchType)` - Filtrar por tipo
- `sortMaterias(materias, sortBy, order)` - Ordenar
- `paginateMaterias(materias, page, limit)` - Paginar

**Características:**
- ✅ Usa materia-core.js para peticiones HTTP
- ✅ Implementa filtrado, ordenación y paginación
- ✅ Funciones puras y reutilizables
- ✅ Logging específico de la API

### 🚀 Capa 3: materia.service.js (Lógica de Negocio)

**Responsabilidad:** Orquestación y lógica de negocio de alto nivel

**Métodos de la clase MateriaService:**
- `getStatus()` - Delega a materia-client
- `getAllMaterias(options)` - Orquesta filtrado, ordenación y paginación
- `getMateriaById(id)` - Delega a materia-client
- `searchByName(searchTerm)` - Método auxiliar
- `searchByType(type)` - Método auxiliar

**Flujo de trabajo en getAllMaterias:**
1. Obtener datos de la API
2. Aplicar filtros (nombre, tipo)
3. Aplicar ordenación
4. Aplicar paginación
5. Añadir metadatos de respuesta

### Ventajas de la Arquitectura

- ✅ **Reutilizable**: materia-core.js se puede usar para otras APIs
- ✅ **Mantenible**: Cada capa tiene una responsabilidad clara
- ✅ **Testeable**: Puedes probar cada capa de forma independiente
- ✅ **Escalable**: Fácil añadir nuevas funcionalidades sin afectar otras capas
- ✅ **Separación de responsabilidades**: Core (HTTP) → Client (API) → Service (Lógica)

---

## 🚀 Instalación

```bash
# Clonar o navegar al directorio del proyecto
cd crisis-core-materia-api

# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
cp .env.example .env

# Iniciar servidor en modo desarrollo
npm run dev

# Iniciar servidor en modo producción
npm start
```

### Variables de Entorno (.env)

```env
PORT=3000
ADMIN_USER=admin
ADMIN_PASS=admin123
JWT_SECRET=tu_clave_secreta_aqui
NODE_ENV=development
MATERIA_API_URL=https://crisis-core-materia-fusion-api-546461677134.us-central1.run.app
```

---

## 🎯 Endpoints

### 1. Estado de la API

```http
GET /api/materia/status
```

**Descripción:** Verifica el estado de la API externa

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "message": "Crisis Core Materia Fusion API is running"
  }
}
```

---

### 2. Obtener Todas las Materias

```http
GET /api/materia
```

**Query Parameters:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `name` | string | Filtrar por nombre de materia | `fire` |
| `type` | string | Filtrar por tipo de materia | `magic` |
| `sortBy` | string | Campo por el que ordenar | `name` |
| `order` | string | Orden: `asc` o `desc` | `asc` |
| `page` | number | Número de página (default: 1) | `2` |
| `limit` | number | Resultados por página (default: 10) | `20` |

**Ejemplos:**

```bash
# Obtener todas las materias (primera página, 10 resultados)
GET /api/materia

# Filtrar materias que contengan "fire" en el nombre
GET /api/materia?name=fire

# Filtrar por tipo "magic"
GET /api/materia?type=magic

# Ordenar por nombre de forma ascendente
GET /api/materia?sortBy=name&order=asc

# Ordenar por tipo de forma descendente
GET /api/materia?sortBy=type&order=desc

# Paginación: página 2 con 20 resultados por página
GET /api/materia?page=2&limit=20

# Combinando múltiples filtros
GET /api/materia?name=cure&type=magic&sortBy=name&order=asc&page=1&limit=5
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Fire",
      "type": "Magic",
      "description": "Materia de ataque de fuego"
    },
    {
      "id": "2",
      "name": "Cure",
      "type": "Magic",
      "description": "Materia de curación"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "filters": {
    "name": null,
    "type": null,
    "sortBy": null,
    "order": null
  }
}
```

---

### 3. Obtener Materia por ID

```http
GET /api/materia/:id
```

**Parámetros de ruta:**
- `id` (string, requerido): ID de la materia

**Ejemplo:**
```bash
GET /api/materia/1
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Fire",
    "type": "Magic",
    "description": "Materia de ataque de fuego",
    "stats": {
      "power": 100,
      "cost": 4
    }
  }
}
```

**Respuesta de error (404):**
```json
{
  "success": false,
  "error": "Materia no encontrada"
}
```

---

## 📚 Guía de Uso

### Uso desde el Navegador

Simplemente abre las siguientes URLs en tu navegador:

```
http://localhost:3000/api/materia/status
http://localhost:3000/api/materia
http://localhost:3000/api/materia?name=fire
http://localhost:3000/api/materia/1
```

### Uso con cURL

```bash
# Estado de la API
curl http://localhost:3000/api/materia/status

# Obtener todas las materias
curl http://localhost:3000/api/materia

# Filtrar por nombre
curl "http://localhost:3000/api/materia?name=fire"

# Con ordenación y paginación
curl "http://localhost:3000/api/materia?sortBy=name&order=asc&page=1&limit=5"

# Obtener materia por ID
curl http://localhost:3000/api/materia/1
```

### Uso con PowerShell

```powershell
# Obtener estado
Invoke-RestMethod -Uri 'http://localhost:3000/api/materia/status' | ConvertTo-Json

# Obtener primeras 10 materias
Invoke-RestMethod -Uri 'http://localhost:3000/api/materia' | ConvertTo-Json

# Filtrar por nombre
Invoke-RestMethod -Uri 'http://localhost:3000/api/materia?name=fire' | ConvertTo-Json

# Con ordenación y paginación
Invoke-RestMethod -Uri 'http://localhost:3000/api/materia?sortBy=name&order=asc&page=1&limit=5' | ConvertTo-Json

# Obtener materia por ID
Invoke-RestMethod -Uri 'http://localhost:3000/api/materia/1' | ConvertTo-Json
```

### Uso con JavaScript/Axios

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/materia';

// Obtener estado
const status = await axios.get(`${API_URL}/status`);
console.log(status.data);

// Obtener todas las materias
const materias = await axios.get(API_URL);
console.log(materias.data);

// Filtrar por nombre
const filtered = await axios.get(API_URL, {
  params: { name: 'fire' }
});
console.log(filtered.data);

// Con ordenación y paginación
const sorted = await axios.get(API_URL, {
  params: {
    sortBy: 'name',
    order: 'asc',
    page: 1,
    limit: 5
  }
});
console.log(sorted.data);

// Obtener por ID
const materia = await axios.get(`${API_URL}/1`);
console.log(materia.data);
```

### Uso con Fetch API

```javascript
// Obtener estado
fetch('http://localhost:3000/api/materia/status')
  .then(r => r.json())
  .then(d => console.log(d));

// Obtener materias con filtros
fetch('http://localhost:3000/api/materia?name=fire&page=1&limit=5')
  .then(r => r.json())
  .then(d => console.log(d));

// Obtener por ID
fetch('http://localhost:3000/api/materia/1')
  .then(r => r.json())
  .then(d => console.log(d));
```

---

## 📖 Documentación Swagger

El proyecto incluye documentación técnica de la API REST conforme a la especificación **OpenAPI 3.x**.

### Acceder a Swagger UI

Una vez iniciado el servidor, accede a:

```
http://localhost:3000/api-docs
```

### Contenido Documentado

En Swagger podrás:
- ✅ Ver todos los endpoints documentados
- ✅ Ver parámetros y respuestas esperadas
- ✅ **Probar los endpoints directamente** desde el UI
- ✅ Ver ejemplos de respuestas
- ✅ Descargar la especificación OpenAPI

### Probar Endpoints desde Swagger

#### GET /api/materia/status
1. Haz clic en el endpoint
2. Clic en "Try it out"
3. Presiona "Execute"
4. Verás la respuesta del estado de la API externa

#### GET /api/materia
1. Haz clic en el endpoint
2. Clic en "Try it out"
3. Completa los parámetros opcionales (name, type, sortBy, etc.)
4. Presiona "Execute"
5. Verás la respuesta con datos filtrados/ordenados/paginados

#### GET /api/materia/{id}
1. Haz clic en el endpoint
2. Clic en "Try it out"
3. Ingresa un ID válido (por ejemplo, "1")
4. Presiona "Execute"
5. Verás los detalles de esa materia

---

## 🧪 Instrucciones de Prueba

### 1. Verificar que el servidor está activo

Abre en el navegador:
```
http://localhost:3000
```

Deberías ver la página de bienvenida de Crisis Core Materia API con:
- Título: "🎮 Crisis Core Materia API"
- 3 características principales (Filtrado, Ordenación, Paginación)
- Ejemplos de endpoints
- Botones para acceder a Swagger y probar la API

### 2. Pruebas Rápidas desde el Navegador

```
http://localhost:3000/api/materia/status
http://localhost:3000/api/materia
http://localhost:3000/api/materia?name=fire
http://localhost:3000/api/materia?type=magic&sortBy=name&order=asc
http://localhost:3000/api/materia?page=2&limit=15
http://localhost:3000/api/materia/1
```

### 3. Pruebas desde Consola de Navegador

Abre la consola (F12) y ejecuta:

```javascript
// Obtener estado
fetch('http://localhost:3000/api/materia/status')
  .then(r => r.json())
  .then(d => console.log(d));

// Obtener materias con filtros
fetch('http://localhost:3000/api/materia?name=fire')
  .then(r => r.json())
  .then(d => console.log(d));

// Obtener por ID
fetch('http://localhost:3000/api/materia/1')
  .then(r => r.json())
  .then(d => console.log(d));
```

### 4. Verificar Funcionalidades

| Funcionalidad | Test | ✅ |
|---------------|------|---|
| Estado API | GET /api/materia/status | ✅ |
| Obtener todas | GET /api/materia | ✅ |
| Filtrar por nombre | GET /api/materia?name=fire | ✅ |
| Filtrar por tipo | GET /api/materia?type=magic | ✅ |
| Ordenar ascendente | GET /api/materia?sortBy=name&order=asc | ✅ |
| Ordenar descendente | GET /api/materia?sortBy=name&order=desc | ✅ |
| Paginación | GET /api/materia?page=2&limit=20 | ✅ |
| Obtener por ID | GET /api/materia/1 | ✅ |
| Combinar filtros | GET /api/materia?name=cure&sortBy=type | ✅ |

---

## 📁 Estructura del Proyecto

```
crisis-core-materia-api/
│
├── 📄 package.json                 ✨ ACTUALIZADO - Axios añadido
├── 📄 package-lock.json            (generado)
├── 📄 .env                         (variables de entorno)
├── 📄 .env.example                 ✨ NUEVO
├── 📄 .gitignore                   ✨ ACTUALIZADO
├── 📄 babel.config.cjs
├── 📄 jest.config.cjs
│
├── 📘 README.md                    ✨ Este archivo - Documentación completa
│
├── 📦 src/
│   ├── 📄 app.js                   ✨ ACTUALIZADO - Solo ruta /api/materia
│   ├── 📄 server.js                ✓ MANTIENE (sin cambios)
│   ├── 📄 swagger.js               ✨ ACTUALIZADO - Documentación Crisis Core
│   │
│   ├── 📂 config/
│   │   ├── 📄 env.js               ✓ MANTIENE
│   │   └── 📄 index.js             ✓ MANTIENE
│   │
│   ├── 📂 controllers/
│   │   └── 📄 materia.controller.js ✨ NUEVO
│   │       ├── getStatus()
│   │       ├── getAllMaterias()
│   │       └── getMateriaById()
│   │
│   ├── 📂 services/
│   │   ├── 📄 materia-core.js      ✨ NUEVO - Capa HTTP Base (Axios)
│   │   ├── 📄 materia-client.js    ✨ NUEVO - Cliente API con funciones
│   │   └── 📄 materia.service.js   ✨ NUEVO - Lógica de negocio
│   │
│   ├── 📂 routes/
│   │   └── 📄 materia.routes.js    ✨ NUEVO - 3 endpoints GET
│   │       ├── GET /api/materia/status
│   │       ├── GET /api/materia
│   │       └── GET /api/materia/:id
│   │
│   ├── 📂 middlewares/
│   │   └── 📄 errorHandler.js      ✓ MANTIENE - Manejo global de errores
│   │
│   ├── 📂 utils/
│   │   ├── 📄 logger.js            ✓ MANTIENE - Logging con Winston
│   │   └── 📄 fileManager.js       ✓ MANTIENE
│   │
│   └── 📂 public/
│       └── 📄 index.html           ✨ ACTUALIZADO - UI Crisis Core
│
├── 📦 tests/
│   ├── 📄 *.test.js                (tests unitarios)
│   └── 📄 setup.js
│
├── 📦 coverage/                    (reportes de cobertura de tests)
├── 📦 logs/                        (logs del servidor)
├── 📦 files/                       (archivos estáticos)
├── 📦 docs/                        (documentación adicional)
└── 📦 node_modules/                (dependencias instaladas)
```

### Archivos Clave

#### Código Principal
- **src/services/materia-core.js**: Capa base HTTP con Axios
- **src/services/materia-client.js**: Cliente API con funciones de filtrado/ordenación/paginación
- **src/services/materia.service.js**: Lógica de negocio y orquestación
- **src/controllers/materia.controller.js**: Controladores de endpoints
- **src/routes/materia.routes.js**: Definición de rutas con Swagger

#### Configuración
- **src/app.js**: Configuración de Express
- **src/server.js**: Punto de entrada del servidor
- **src/swagger.js**: Configuración de Swagger/OpenAPI
- **src/config/env.js**: Carga de variables de entorno

#### Utilidades
- **src/middlewares/errorHandler.js**: Manejo centralizado de errores
- **src/utils/logger.js**: Sistema de logging con Winston

---

## 📝 Cambios Realizados

### ✨ Archivos Nuevos

#### Código (5 archivos)
```
✨ src/services/materia-core.js
   └─ Capa base HTTP con Axios (sendRequest, get, post, patch, del)

✨ src/services/materia-client.js
   └─ Cliente API con funciones específicas de Crisis Core
   └─ Funciones: getStatus, getAllMaterias, getMateriaById
   └─ Funciones auxiliares: filterByName, filterByType, sortMaterias, paginateMaterias

✨ src/services/materia.service.js
   └─ Lógica de negocio y orquestación
   └─ Clase MateriaService con métodos de alto nivel

✨ src/controllers/materia.controller.js
   └─ Controladores para los 3 endpoints GET

✨ src/routes/materia.routes.js
   └─ Rutas GET con documentación Swagger completa
```

#### Configuración (1 archivo)
```
✨ .env.example
   └─ Variables de configuración de ejemplo
```

### ✅ Archivos Actualizados (6)

```
✅ package.json
   ├─ ✨ Añadido: Axios 1.6.2
   ├─ ✗ Eliminados: 9 dependencias innecesarias
   └─ Actualizado nombre: "crisis-core-materia-api"

✅ src/app.js
   ├─ ✗ Eliminadas: rutas de notas, auth, files
   ├─ ✨ Añadida: ruta /api/materia
   └─ Simplificado y limpiado

✅ src/swagger.js
   ├─ Actualizada documentación a Crisis Core
   ├─ Nuevos esquemas de datos
   └─ Tags actualizados

✅ src/public/index.html
   ├─ ✨ Diseño completamente nuevo
   ├─ Interfaz moderna con gradientes
   └─ Enlaces a Swagger y endpoints

✅ README.md
   ├─ ✨ Documentación consolidada completa
   └─ Todas las guías en un solo archivo

✅ .gitignore
   ├─ Mejorado y expandido
   └─ Mejor captura de archivos innecesarios
```

### ❌ Archivos Eliminados (21)

#### Código antiguo (11 archivos)
```
❌ src/controllers/notas.controller.js
❌ src/controllers/auth.controller.js
❌ src/controllers/files.controller.js
❌ src/services/notas.service.js
❌ src/routes/notas.routes.js
❌ src/routes/auth.routes.js
❌ src/routes/files.routes.js
❌ src/middlewares/auth.js
❌ src/middlewares/auth.middleware.js
❌ src/data/notas.json
❌ test-token.js
```

#### Documentación fragmentada (10 archivos)
```
❌ ARQUITECTURA.md
❌ CAMBIOS.md
❌ CONCLUSION.md
❌ ENTREGA.md
❌ ESTRUCTURA.md
❌ GUIA_USO.md
❌ INDICE.md
❌ INICIO.md
❌ INSTRUCCIONES_PRUEBA.md
❌ RESUMEN_FINAL.md
```

> Toda la documentación ha sido consolidada en un único archivo **README.md** completo

### Dependencias

#### ➕ Añadidas
- **axios** ^1.6.2 - Cliente HTTP para consultas a la API externa

#### ➖ Eliminadas (9)
- archiver
- bcrypt
- chalk
- form-data
- jsonwebtoken
- multer
- node-fetch
- readline-sync
- 1 dependencia más

---

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js** 16+ - Runtime de JavaScript
- **Express** 5.1.0 - Framework web minimalista
- **Axios** 1.6.2 - Cliente HTTP para peticiones a API externa

### Logging
- **Winston** 3.18.3 - Sistema de logging robusto
- **Morgan** 1.10.1 - Middleware de logging HTTP

### Documentación
- **Swagger JSDoc** 6.2.8 - Generador de documentación OpenAPI
- **Swagger UI Express** 4.6.3 - Interfaz Swagger interactiva

### Utilidades
- **dotenv** 17.2.3 - Gestión de variables de entorno

### Testing
- **Jest** 30.2.0 - Framework de pruebas
- **Babel** - Transpilador para tests con ES6+

---

## ✅ Funcionalidades Implementadas

- ✅ **Proxy a API Externa** - Consulta la API de Crisis Core Materia Fusion
- ✅ **3 Endpoints GET** - Status, lista de materias, materia por ID
- ✅ **Filtrado Avanzado** - Por nombre (búsqueda parcial) y por tipo (exacta)
- ✅ **Ordenación Flexible** - Por cualquier campo en orden asc/desc
- ✅ **Paginación Completa** - Con metadatos (total, páginas, hasNext, hasPrev)
- ✅ **Arquitectura Modular** - 3 capas: Core (HTTP) → Client (API) → Service (Lógica)
- ✅ **Documentación Swagger** - OpenAPI 3.0 con interfaz interactiva
- ✅ **Manejo de Errores** - Middleware centralizado
- ✅ **Logging Completo** - Winston + Morgan
- ✅ **Interfaz Web** - Página de bienvenida moderna

---

## 🎯 Acceso Rápido

### URLs Importantes

| Recurso | URL |
|---------|-----|
| 🏠 Inicio | http://localhost:3000 |
| 📖 Swagger UI | http://localhost:3000/api-docs |
| 📊 API Status | http://localhost:3000/api/materia/status |
| 📋 Lista Materias | http://localhost:3000/api/materia |

### Comandos

```bash
# Desarrollo
npm run dev

# Producción
npm start

# Tests
npm test

# Tests con cobertura
npm run test:coverage
```

---

## 📊 Resumen del Proyecto

### Transformación

**ANTES:**
```
Proyecto: Gestor de Notas
├── Autenticación JWT
├── Gestión de archivos (.note)
├── Base de datos JSON
└── Endpoints: POST/PUT/DELETE
```

**DESPUÉS:**
```
Proyecto: Crisis Core Materia API
├── Consultas a API externa
├── Filtrado, ordenación, paginación
├── 3 endpoints GET profesionales
├── Arquitectura modular de 3 capas
└── Documentación Swagger completa
```

### Estado del Proyecto

```
✅ COMPLETADO AL 100%
✅ FUNCIONAL Y PROBADO
✅ DOCUMENTACIÓN COMPLETA
✅ ARQUITECTURA MODULAR
✅ LISTO PARA PRODUCCIÓN
```

---

## 🤝 Contribución

Este proyecto fue desarrollado como trabajo práctico para la asignatura **DWES (Desarrollo Web en Entorno Servidor)**.

---

## 📄 Licencia

Este proyecto es con fines educativos para la asignatura DWES.

---

## 📞 Contacto

Para preguntas o sugerencias sobre este proyecto, contacta al desarrollador a través del entorno académico.

---

**🎮 ¡Disfruta explorando las materias de Crisis Core!**
