import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Crisis Core Materia API",
      version: "1.0.0",
      description: "API proxy para consultar información sobre materias de Crisis Core Final Fantasy VII. Proporciona endpoints para consultar materias con filtrado, ordenación y paginación.",
      contact: {
        name: "Soporte API",
        email: "soporte@example.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo"
      }
    ],
    tags: [
      {
        name: "Materia",
        description: "Operaciones relacionadas con materias de Crisis Core"
      }
    ],
    components: {
      schemas: {
        Materia: {
          type: "object",
          properties: {
            id: { type: "string", example: "fire-materia" },
            name: { type: "string", example: "Fire" },
            type: { type: "string", example: "Magic" },
            description: { type: "string", example: "Materia de elemento fuego" }
          }
        },
        MateriaResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Materia" }
            },
            pagination: {
              type: "object",
              properties: {
                total: { type: "integer", example: 50 },
                page: { type: "integer", example: 1 },
                limit: { type: "integer", example: 10 },
                totalPages: { type: "integer", example: 5 },
                hasNextPage: { type: "boolean", example: true },
                hasPrevPage: { type: "boolean", example: false }
              }
            },
            filters: {
              type: "object",
              properties: {
                name: { type: "string", nullable: true },
                type: { type: "string", nullable: true },
                sortBy: { type: "string", nullable: true },
                order: { type: "string", nullable: true }
              }
            }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: { type: "string", example: "Error al consultar la API" }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
