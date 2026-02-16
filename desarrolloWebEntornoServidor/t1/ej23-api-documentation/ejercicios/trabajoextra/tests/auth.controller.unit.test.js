import { login, tokenOnly } from "../src/controllers/auth.controller.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../src/config/env.js";

describe("auth.controller unit tests", () => {
  let req, res, next;
  let originalConfig;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), type: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
    
    // Guardar config original
    originalConfig = { ...config };
    
    // Set default config values
    config.ADMIN_USER = "victor";
    config.ADMIN_PASS = "supermegaesternocleidomastoideo12345";
    config.JWT_SECRET = "test_jwt_secret";
    config.JWT_EXPIRES_IN = "1h";
  });

  afterEach(() => {
    jest.restoreAllMocks();
    // Restaurar config original
    Object.assign(config, originalConfig);
  });

  it("login -> 400 si faltan datos", async () => {
    req.body = {};
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("login -> 500 si faltan env vars", async () => {
    config.ADMIN_USER = null;
    req.body = { username: 'victor', password: 'x' };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("login -> usa bcrypt.compare si ADMIN_PASS parece hash", async () => {
    config.ADMIN_PASS = "$2b$10$abcdef";
    req.body = { username: 'victor', password: 'pw' };
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('tok123');
    await login(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'tok123' }));
  });

  it("login -> 500 si bcrypt.compare lanza error", async () => {
    config.ADMIN_PASS = "$2b$10$abcdef";
    req.body = { username: 'victor', password: 'pw' };
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => { throw new Error('boom'); });
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("login -> 500 si jwt.sign lanza error", async () => {
    req.body = { username: 'victor', password: config.ADMIN_PASS };
    jest.spyOn(jwt, 'sign').mockImplementation(() => { throw new Error('boom'); });
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("tokenOnly -> devuelve solo token en texto", async () => {
    req.body = { username: 'victor', password: config.ADMIN_PASS };
    jest.spyOn(jwt, 'sign').mockReturnValue('tok-only');
    await tokenOnly(req, res);
    expect(res.type).toHaveBeenCalledWith('text');
    expect(res.send).toHaveBeenCalledWith('tok-only');
  });
});
// migrated test
