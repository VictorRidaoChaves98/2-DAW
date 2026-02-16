// Definir variables de entorno antes de importar la app y los middlewares
process.env.ADMIN_USER = process.env.ADMIN_USER || "victor";
process.env.ADMIN_PASS = process.env.ADMIN_PASS || "supermegaesternocleidomastoideo12345";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";

import request from "supertest";
import app from "../src/app.js";

describe("API de Notas", () => {
    let notaId;
    let authHeader;

    // Hacer login y obtener token antes de las pruebas
    beforeAll(async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        authHeader = `Bearer ${res.body.token}`;
    });

    // GET todas las notas
    it("Debe obtener todas las notas", async () => {
        const res = await request(app).get("/api/notas").set("Authorization", authHeader);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // POST nueva nota
    it("Debe crear una nueva nota", async () => {
        const nueva = { titulo: "Nota de prueba", contenido: "Contenido de prueba" };
        const res = await request(app).post("/api/notas").set("Authorization", authHeader).send(nueva);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.titulo).toBe(nueva.titulo);
        notaId = res.body.id;
    });

    it("Debe permitir filtrar, ordenar y paginar notas", async () => {
        const res = await request(app)
            .get("/api/notas?filterTitle=nota&sortBy=title&order=asc&page=1&perPage=2")
            .set("Authorization", authHeader);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("items");
        expect(res.body).toHaveProperty("totalItems");
        expect(res.body).toHaveProperty("totalPages");
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items.length).toBeLessThanOrEqual(2);
    });

    // GET nota por ID
    it("Debe obtener la nota creada por ID", async () => {
        const res = await request(app).get(`/api/notas/${notaId}`).set("Authorization", authHeader);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(notaId);
    });

    // PUT actualizar nota
    it("Debe actualizar la nota", async () => {
        const cambios = { titulo: "Nota actualizada" };
        const res = await request(app).put(`/api/notas/${notaId}`).set("Authorization", authHeader).send(cambios);
        expect(res.status).toBe(200);
        expect(res.body.titulo).toBe(cambios.titulo);
    });

    // DELETE nota
    it("Debe eliminar la nota", async () => {
        const res = await request(app).delete(`/api/notas/${notaId}`).set("Authorization", authHeader);
        expect(res.status).toBe(204);
    });

    // GET nota no encontrada
    it("Debe devolver 404 si la nota no existe", async () => {
        const res = await request(app).get(`/api/notas/999999`).set("Authorization", authHeader);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
    });
});
