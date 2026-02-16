import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gestor de Notas API",
      version: "1.0.0",
      description: "API para gestionar notas con autenticación JWT"
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        Nota: {
          type: "object",
          properties: {
            id: { type: "string", example: "1234" },
            titulo: { type: "string", example: "Comprar leche" },
            contenido: { type: "string", example: "Ir al supermercado y comprar leche" },
            etiquetas: { type: "array", items: { type: "string" }, example: ["personal", "compras"] },
            fecha: { type: "string", format: "date-time", example: "2023-01-01T12:00:00Z" }
          },
          required: ["titulo", "contenido"]
        },
        NotasArray: {
          type: "array",
          items: { $ref: "#/components/schemas/Nota" }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Recurso no encontrado" }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/api/auth/login": {
        post: {
          summary: "Obtener token JWT",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string", example: "admin" },
                    password: { type: "string", example: "secret" }
                  },
                  required: ["username", "password"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Login correcto",
              content: { "application/json": { schema: { type: "object", properties: { message: { type: "string" }, token: { type: "string" }, expiresIn: { type: "string" } } } } }
            },
            "400": { description: "Faltan datos", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "401": { description: "Credenciales inválidas", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "500": { description: "Error interno", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
          }
        }
      },
      "/api/auth/token": {
        post: {
          summary: "Obtener solo el token (texto puro)",
          tags: ["Auth"],
          requestBody: { $ref: "#/paths/~1api~1auth~1login/post/requestBody" },
          responses: {
            "200": { description: "Token en texto plano", content: { "text/plain": { schema: { type: "string" } } } },
            "400": { $ref: "#/paths/~1api~1auth~1login/post/responses/400" },
            "401": { $ref: "#/paths/~1api~1auth~1login/post/responses/401" }
          }
        }
      },
      "/api/notas": {
        get: {
          summary: "Listar notas",
          tags: ["Notas"],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "title", in: "query", schema: { type: "string" }, description: "Filtrar por título" },
            { name: "content", in: "query", schema: { type: "string" }, description: "Filtrar por contenido" },
            { name: "page", in: "query", schema: { type: "integer" }, description: "Página (paginación)" },
            { name: "per_page", in: "query", schema: { type: "integer" }, description: "Ítems por página" }
          ],
          responses: {
            "200": { description: "Lista de notas", content: { "application/json": { schema: { oneOf: [ { $ref: "#/components/schemas/NotasArray" }, { type: "object", properties: { items: { $ref: "#/components/schemas/NotasArray" }, total: { type: "integer" } } } ] } } } },
            "401": { $ref: "#/components/schemas/ErrorResponse" }
          }
        },
        post: {
          summary: "Crear una nota",
          tags: ["Notas"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Nota" }, example: { titulo: "Comprar pan", contenido: "Ir a la panadería", etiquetas: ["compras"] } }
            }
          },
          responses: {
            "201": { description: "Nota creada", content: { "application/json": { schema: { $ref: "#/components/schemas/Nota" } } } },
            "400": { description: "Datos inválidos", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            "401": { $ref: "#/components/schemas/ErrorResponse" }
          }
        }
      },
      "/api/notas/import": {
        post: {
          summary: "Importar ficheros .note",
          tags: ["Notas"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    files: { type: "array", items: { type: "string", format: "binary" } }
                  }
                }
              }
            }
          },
          responses: {
            "201": { description: "Importadas", content: { "application/json": { schema: { type: "object", properties: { imported: { type: "integer" }, notas: { $ref: "#/components/schemas/NotasArray" } } } } } },
            "400": { $ref: "#/components/schemas/ErrorResponse" },
            "401": { $ref: "#/components/schemas/ErrorResponse" }
          }
        }
      },
      "/api/notas/export": {
        get: {
          summary: "Exportar notas (descarga .note o .zip)",
          tags: ["Notas"],
          security: [{ bearerAuth: [] }],
          parameters: [ { name: "title", in: "query", schema: { type: "string" } } ],
          responses: {
            "200": {
              description: "Archivo descargable",
              content: {
                "application/zip": { schema: { type: "string", format: "binary" } },
                "application/octet-stream": { schema: { type: "string", format: "binary" } }
              }
            },
            "404": { description: "No hay notas", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
          }
        }
      },
      "/api/notas/{id}": {
        get: {
          summary: "Obtener nota por ID",
          tags: ["Notas"],
          security: [{ bearerAuth: [] }],
          parameters: [ { name: "id", in: "path", required: true, schema: { type: "string" } } ],
          responses: {
            "200": { description: "Nota encontrada", content: { "application/json": { schema: { $ref: "#/components/schemas/Nota" } } } },
            "404": { description: "No encontrada", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
          }
        },
        put: {
          summary: "Actualizar nota",
          tags: ["Notas"],
          security: [{ bearerAuth: [] }],
          parameters: [ { name: "id", in: "path", required: true, schema: { type: "string" } } ],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Nota" } } } },
          responses: {
            "200": { description: "Nota actualizada", content: { "application/json": { schema: { $ref: "#/components/schemas/Nota" } } } },
            "404": { $ref: "#/components/schemas/ErrorResponse" }
          }
        },
        delete: {
          summary: "Eliminar nota",
          tags: ["Notas"],
          security: [{ bearerAuth: [] }],
          parameters: [ { name: "id", in: "path", required: true, schema: { type: "string" } } ],
          responses: { "204": { description: "Eliminada" }, "404": { $ref: "#/components/schemas/ErrorResponse" } }
        }
      }
    }
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
