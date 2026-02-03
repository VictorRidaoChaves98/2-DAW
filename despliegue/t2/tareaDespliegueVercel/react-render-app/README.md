# API REST de Tareas - Node.js + Express

## 📋 Descripción

API REST sencilla desarrollada con Node.js y Express para gestionar tareas. La API implementa las operaciones CRUD básicas (Create, Read, Delete) y está lista para ser desplegada en Render.

## 🎯 Objetivos Alcanzados

✅ Crear una API REST con Node.js y Express
✅ Implementar rutas GET, POST y DELETE
✅ Gestionar tareas con validación de datos
✅ Usar CORS para permitir peticiones desde otros dominios
✅ Preparar para despliegue en Render

## 🌐 Despliegue en Render

**URL de la API:** `https://api-tareas-despliegue.onrender.com` (será asignada tras desplegar)

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **CORS** - Para permitir peticiones desde cualquier origen
- **Render** - Plataforma de despliegue

## 📦 Instalación y Ejecución Local

### Requisitos previos
- Node.js 14 o superior
- npm o yarn

### Pasos de instalación

```bash
# 1. Clonar el repositorio (si aún no lo has hecho)
git clone https://github.com/victormanuel-98/2-DAW.git
cd 2-DAW/despliegue/t2/tareaDespliegueVercel/react-render-app

# 2. Instalar dependencias
npm install

# 3. Ejecutar el servidor
npm start

# 4. La API estará disponible en http://localhost:3000
```

## 🔌 Endpoints de la API

### 1. Obtener todas las tareas
```http
GET /tareas
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "mensaje": "Lista de tareas obtenida correctamente",
  "data": [
    {
      "id": 1,
      "titulo": "Aprender Node.js",
      "descripcion": "Estudiar Express y crear APIs REST"
    }
  ],
  "total": 3
}
```

### 2. Obtener una tarea específica
```http
GET /tareas/:id
```

**Parámetros:**
- `id` (número) - ID de la tarea

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "mensaje": "Tarea obtenida correctamente",
  "data": {
    "id": 1,
    "titulo": "Aprender Node.js",
    "descripcion": "Estudiar Express y crear APIs REST"
  }
}
```

### 3. Crear una nueva tarea
```http
POST /tareas
Content-Type: application/json

{
  "titulo": "Mi tarea",
  "descripcion": "Descripción de la tarea"
}
```

**Parámetros en el body:**
- `titulo` (string, obligatorio) - Título de la tarea
- `descripcion` (string, obligatorio) - Descripción de la tarea

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "mensaje": "Tarea creada correctamente",
  "data": {
    "id": 4,
    "titulo": "Mi tarea",
    "descripcion": "Descripción de la tarea"
  }
}
```

**Respuesta de error (400):**
```json
{
  "success": false,
  "mensaje": "El título y la descripción son obligatorios",
  "data": null
}
```

### 4. Eliminar una tarea
```http
DELETE /tareas/:id
```

**Parámetros:**
- `id` (número) - ID de la tarea a eliminar

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "mensaje": "Tarea eliminada correctamente",
  "data": {
    "id": 1,
    "titulo": "Aprender Node.js",
    "descripcion": "Estudiar Express y crear APIs REST"
  }
}
```

## 📁 Estructura del Proyecto

```
react-render-app/
├── server.js              # Archivo principal con la API
├── package.json           # Dependencias y scripts
├── package-lock.json      # Versiones exactas de dependencias
├── .gitignore             # Archivos a ignorar en Git
├── requests.http          # Archivo de pruebas (VS Code REST Client)
└── README.md              # Este archivo
```

## 🧪 Pruebas

### Opción 1: Usando Postman

1. Descarga [Postman](https://www.postman.com/)
2. Importa requests a `http://localhost:3000`
3. Prueba cada endpoint

### Opción 2: Usando REST Client en VS Code

1. Instala la extensión [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
2. Abre el archivo `requests.http`
3. Haz clic en "Send Request" en cada sección

### Opción 3: Usando cURL

```bash
# GET - Obtener todas las tareas
curl http://localhost:3000/tareas

# POST - Crear una tarea
curl -X POST http://localhost:3000/tareas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Nueva tarea","descripcion":"Descripción"}'

# DELETE - Eliminar una tarea
curl -X DELETE http://localhost:3000/tareas/1
```

## 🚀 Despliegue en Render

### Proceso realizado:

1. **Crear proyecto Node.js** con Express
2. **Implementar rutas REST** con validaciones
3. **Añadir CORS** para compatibilidad con el frontend
4. **Subir código a GitHub**
5. **Conectar con Render** desde el dashboard
6. **Configurar variables de entorno** (si es necesario)
7. **Despliegue automático** en cada push

Cada vez que hagas un `git push` a GitHub, Render redespliega automáticamente la API.

## 📝 Variables de Entorno

El proyecto usa variables de entorno:

```env
PORT=3000
```

En Render, puedes configurar estas variables en el dashboard del servicio.

## 💡 Características Principales

- ✅ **Almacenamiento en memoria** - Los datos se pierden al reiniciar (perfecto para demo)
- ✅ **Validación de datos** - Verifica que se proporcionen los datos requeridos
- ✅ **Respuestas consistentes** - Todas las respuestas incluyen `success`, `mensaje` y `data`
- ✅ **Manejo de errores** - Códigos HTTP apropiados (400, 404, 201, etc.)
- ✅ **CORS habilitado** - Permite peticiones desde cualquier origen
- ✅ **IDs automáticos** - Los IDs se generan automáticamente

## ✨ Futuras Mejoras

- Usar una base de datos real (MongoDB, PostgreSQL, etc.)
- Añadir autenticación con JWT
- Implementar paginación
- Añadir búsqueda y filtros
- Crear endpoints adicionales (PUT para editar tareas)
- Validación más robusta con bibliotecas como Joi
- Tests automáticos con Jest
- Documentación con Swagger

## 🎓 Asignatura

**Asignatura:** Despliegue
**Curso:** 2 DAW (Desarrollo de Aplicaciones Web)

---

**Fecha de creación:** Febrero 2026
**Último actualización:** Febrero 3, 2026
**Estado:** ✅ Completado
