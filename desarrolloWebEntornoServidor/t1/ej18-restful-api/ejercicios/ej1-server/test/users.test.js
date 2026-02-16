const request = require("supertest");
const express = require("express");
const usersRouter = require("../src/routes/users.routes");

const app = express();
app.use(express.json());
app.use("/users", usersRouter);

describe("API /users", () => {
  it("GET /users debe devolver lista", async () => {
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /users debe crear usuario", async () => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Nuevo", email: "nuevo@test.com" });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Nuevo");
  });
});
