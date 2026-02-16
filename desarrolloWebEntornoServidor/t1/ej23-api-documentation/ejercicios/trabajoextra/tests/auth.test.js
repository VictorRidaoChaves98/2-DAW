import request from "supertest";
import app from "../src/app.js";
import jwt from "jsonwebtoken";

import { verifyToken, onlyAdmin } from "../src/middlewares/auth.middleware.js";

describe("Auth controller (HTTP)", () => {
  beforeAll(() => {
    process.env.ADMIN_USER = process.env.ADMIN_USER || "victor";
    process.env.ADMIN_PASS = process.env.ADMIN_PASS || "supermegaesternocleidomastoideo12345";
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
  });

  it("Devuelve 400 si faltan datos en login", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
  });

  it("Devuelve 401 para usuario incorrecto", async () => {
    const res = await request(app).post("/api/auth/login").send({ username: "nope", password: "x" });
    expect(res.status).toBe(401);
  });

  it("Devuelve 401 para contraseña incorrecta", async () => {
    const res = await request(app).post("/api/auth/login").send({ username: process.env.ADMIN_USER, password: "wrong" });
    expect(res.status).toBe(401);
  });

  it("Login correcto devuelve token", async () => {
    const res = await request(app).post("/api/auth/login").send({ username: process.env.ADMIN_USER, password: process.env.ADMIN_PASS });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    const payload = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(payload.username).toBe(process.env.ADMIN_USER);
  });
});

describe("Auth middleware (unit)", () => {
  it("verifyToken: falta header -> 401", () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("verifyToken: formato incorrecto -> 400", () => {
    const req = { headers: { authorization: "Token abc" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it("verifyToken: token inválido -> 401", () => {
    const req = { headers: { authorization: "Bearer invalid" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("verifyToken: token válido llama next y añade req.user", () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
    const token = jwt.sign({ username: "victor", role: "admin" }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();
    verifyToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.username).toBe("victor");
  });

  it("onlyAdmin: role distinto -> 403", () => {
    const req = { user: { role: "user" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    onlyAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("onlyAdmin: role admin -> next llamado", () => {
    const req = { user: { role: "admin" } };
    const res = {};
    const next = jest.fn();
    onlyAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
