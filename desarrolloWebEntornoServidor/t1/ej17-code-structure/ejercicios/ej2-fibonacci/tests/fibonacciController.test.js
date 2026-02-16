const request = require("supertest");
const express = require("express");
const controller = require("../controllers/fibonacciController");

describe("Fibonacci Controller", () => {
    const app = express();
    app.get("/:n", controller.getFibonacci);

    test("Debe devolver error si n no es número", async () => {
        const res = await request(app).get("/abc");
        expect(res.status).toBe(400);
    });

    test("Debe devolver error si n es negativo", async () => {
        const res = await request(app).get("/-3");
        expect(res.status).toBe(400);
    });

    test("Debe devolver el Fibonacci correcto", async () => {
        const res = await request(app).get("/8");
        expect(res.status).toBe(200);
        expect(res.body.result).toBe(21);
    });
});
