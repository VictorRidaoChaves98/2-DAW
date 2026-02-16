const request = require("supertest");
const express = require("express");
const router = require("../routes/fibonacciRoutes");

describe("Fibonacci Routes", () => {
    const app = express();
    app.use("/fibonacci", router);

    test("La ruta /fibonacci/:n funciona", async () => {
        const res = await request(app).get("/fibonacci/7");
        expect(res.status).toBe(200);
        expect(res.body.result).toBe(13);
    });
});
