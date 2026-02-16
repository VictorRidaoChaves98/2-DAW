# 🎮 Crisis Core Materia API

## Descripción del Proyecto

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

### Capa 1: materia-core.js (HTTP Base)

Funciones base para peticiones HTTP usando Axios

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

### Capa 2: materia-client.js (Cliente API)

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

### Capa 3: materia.service.js (Lógica de Negocio)

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

## Acceso Rápido

### URLs Importantes

| Recurso | URL |
|---------|-----|
| 🏠 Inicio | http://localhost:3000 |
| 📖 Swagger UI | http://localhost:3000/api-docs |
| 📊 API Status | http://localhost:3000/api/materia/status |
| 📋 Lista Materias | http://localhost:3000/api/materia |
