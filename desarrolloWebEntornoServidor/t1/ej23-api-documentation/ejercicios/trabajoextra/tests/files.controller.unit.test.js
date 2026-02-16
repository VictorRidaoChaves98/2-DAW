import * as fc from '../src/controllers/files.controller.js';
import fs from 'fs';
import path from 'path';

describe('files.controller', () => {
  afterEach(() => jest.restoreAllMocks());

  test('listFiles returns file details', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readdirSync').mockReturnValue(['a.txt']);
    jest.spyOn(fs, 'statSync').mockReturnValue({ size: 123, mtime: new Date() });

    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    fc.listFiles(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ name: 'a.txt', size: 123 })]));
  });

  test('uploadFiles responds with uploaded info', () => {
    const req = { files: [{ originalname: 'file.pdf', size: 100 }] };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    fc.uploadFiles(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ files: expect.any(Array) }));
  });

  test('downloadFile 404 when missing', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const req = { params: { name: 'no.txt' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), download: jest.fn() };
    fc.downloadFile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('downloadFile calls res.download when exists', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const downloadMock = jest.fn((full, name, cb) => cb && cb(null));
    const req = { params: { name: 'ok.txt' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), download: downloadMock };
    fc.downloadFile(req, res);
    expect(downloadMock).toHaveBeenCalled();
  });

  test('deleteFile 404 when missing and deletes when exists', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const req1 = { params: { name: 'no.txt' } };
    const res1 = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    fc.deleteFile(req1, res1);
    expect(res1.status).toHaveBeenCalledWith(404);

    fs.existsSync.mockRestore();
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const unlinkSpy = jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});
    const req2 = { params: { name: 'ok.txt' } };
    const res2 = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    fc.deleteFile(req2, res2);
    expect(unlinkSpy).toHaveBeenCalled();
    expect(res2.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Fichero borrado' }));
  });

  // New tests for viewFile
  test('viewFile 404 when missing', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const req = { query: { name: 'notes/x.note' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    fc.viewFile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('viewFile returns content when exists', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => false });
    jest.spyOn(fs, 'readFileSync').mockReturnValue('HELLO');
    const req = { query: { name: 'notes/x.note' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    fc.viewFile(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'notes/x.note', content: 'HELLO' }));
  });

  // New tests for updateFile
  test('updateFile 400 when content missing', () => {
    const req = { body: { name: 'notes/x.note' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    fc.updateFile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('updateFile 404 when missing', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const req = { body: { name: 'notes/x.note', content: '{}' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    fc.updateFile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('updateFile rejects directories', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true });
    const req = { body: { name: 'notes/dir', content: 'x' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    fc.updateFile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('updateFile writes content', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => false });
    const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    const req = { body: { name: 'notes/x.note', content: 'DATA' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    fc.updateFile(req, res);
    expect(writeSpy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Fichero actualizado correctamente' }));
  });
});
