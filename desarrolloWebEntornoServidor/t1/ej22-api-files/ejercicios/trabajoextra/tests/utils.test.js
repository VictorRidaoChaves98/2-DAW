import * as fm from "../src/utils/fileManager.js";
import errorHandler from "../src/middlewares/errorHandler.js";
import logger from "../src/utils/logger.js";
import fs from "fs";

describe("fileManager utils", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("cargarNotas devuelve array si readFileSync ok", () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify([1,2,3]));
    const res = fm.cargarNotas();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(3);
  });

  it("cargarNotas devuelve [] si readFileSync lanza", () => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('no'); });
    const res = fm.cargarNotas();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(0);
  });

  it("guardarNotas llama a writeFileSync con JSON stringify", () => {
    const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    const notas = [{ id: 1, titulo: 'x' }];
    fm.guardarNotas(notas);
    expect(spy).toHaveBeenCalled();
    const args = spy.mock.calls[0];
    expect(args[1]).toContain('titulo');
  });
});

describe("errorHandler middleware", () => {
  it("logger.error es llamado y responde con status del error", () => {
    const spy = jest.spyOn(logger, 'error').mockImplementation(() => {});
    const err = new Error('boom');
    err.status = 418;
    const req = { method: 'GET', originalUrl: '/x' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    errorHandler(err, req, res, next);
    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({ error: 'boom' });
  });
});
