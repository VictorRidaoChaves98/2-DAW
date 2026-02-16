import { login, tokenOnly } from "../controllers/auth.controller.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("auth.controller unit tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), type: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
    // default envs
    process.env.ADMIN_USER = "victor";
    process.env.ADMIN_PASS = "supermegaesternocleidomastoideo12345";
    process.env.JWT_SECRET = "test_jwt_secret";
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("login -> 400 si faltan datos", async () => {
    req.body = {};
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("login -> 500 si faltan env vars", async () => {
    delete process.env.ADMIN_USER;
    req.body = { username: 'victor', password: 'x' };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("login -> usa bcrypt.compare si ADMIN_PASS parece hash", async () => {
    process.env.ADMIN_PASS = "$2b$10$abcdef";
    req.body = { username: 'victor', password: 'pw' };
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('tok123');
    await login(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'tok123' }));
  });

  it("login -> 500 si bcrypt.compare lanza error", async () => {
    process.env.ADMIN_PASS = "$2b$10$abcdef";
    req.body = { username: 'victor', password: 'pw' };
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => { throw new Error('boom'); });
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("login -> 500 si jwt.sign lanza error", async () => {
    req.body = { username: 'victor', password: process.env.ADMIN_PASS };
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwt, 'sign').mockImplementation(() => { throw new Error('boom'); });
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("tokenOnly -> devuelve solo token en texto", async () => {
    req.body = { username: 'victor', password: process.env.ADMIN_PASS };
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('tok-only');
    await tokenOnly(req, res);
    expect(res.type).toHaveBeenCalledWith('text');
    expect(res.send).toHaveBeenCalledWith('tok-only');
  });
});
