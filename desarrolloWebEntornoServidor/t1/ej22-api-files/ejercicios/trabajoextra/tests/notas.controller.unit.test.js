jest.mock('archiver', () => {
  return jest.fn(() => {
    const events = {};
    return {
      on: (ev, cb) => { events[ev] = cb; },
      pipe: () => {},
      append: () => {},
      finalize: jest.fn().mockResolvedValue(undefined),
    };
  });
});

import { importNotes, exportNotes } from '../src/controllers/notas.controller.js';
import * as notasService from '../src/services/notas.service.js';

describe('notas.controller', () => {
  afterEach(() => jest.restoreAllMocks());

  test('importNotes parses JSON and plain text files', async () => {
    const created = [];
    jest.spyOn(notasService, 'create').mockImplementation((p) => { const n = { id: Date.now(), ...p }; created.push(n); return n; });

    const req = { files: [
      { originalname: 'one.note', buffer: Buffer.from(JSON.stringify({ titulo: 'One', contenido: 'c' })) },
      { originalname: 'two.note', buffer: Buffer.from('plain text content') },
      { originalname: 'ignore.txt', buffer: Buffer.from('x') }
    ] };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await importNotes(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    const body = res.json.mock.calls[0][0];
    expect(body.imported).toBe(2);
    expect(body.notas.length).toBe(2);
  });

  test('exportNotes single note returns .note content', async () => {
    const note = { id: 1, titulo: 'Solo', contenido: 'x' };
    jest.spyOn(notasService, 'getAll').mockReturnValue([note]);

    const req = { query: {} };
    const res = { setHeader: jest.fn(), send: jest.fn() };

    await exportNotes(req, res);

    expect(res.setHeader).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
    const sent = res.send.mock.calls[0][0];
    expect(sent).toContain('Solo');
  });

  test('exportNotes multiple notes pipes zip', async () => {
    const notes = [ { id:1, titulo:'A' }, { id:2, titulo:'B' } ];
    jest.spyOn(notasService, 'getAll').mockReturnValue(notes);

    const req = { query: {} };
    const res = { setHeader: jest.fn(), status: jest.fn() };

    await exportNotes(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/zip');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', expect.stringContaining('notas_export.zip'));
  });
});
