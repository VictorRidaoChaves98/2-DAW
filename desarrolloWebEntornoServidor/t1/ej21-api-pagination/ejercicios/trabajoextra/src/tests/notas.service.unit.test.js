import * as fileManager from '../utils/fileManager.js';
import * as notasService from '../services/notas.service.js';

let mockData = [];

describe('notas.service', () => {
    beforeEach(() => {
        mockData = [
            { id: 1, titulo: 'Alpha', contenido: 'Primera nota', categoria: 'A', createdAt: 1000, updatedAt: 1000 },
            { id: 2, titulo: 'Bravo', contenido: 'Segunda nota prueba', categoria: 'B', createdAt: 2000, updatedAt: 2000 },
            { id: 3, titulo: 'Charlie', contenido: 'Tercera prueba', categoria: 'A', createdAt: 3000, updatedAt: 3000 },
            'Nota string simple'
        ];
        jest.spyOn(fileManager, 'cargarNotas').mockImplementation(() => mockData);
        jest.spyOn(fileManager, 'guardarNotas').mockImplementation(n => { mockData = n; });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('getAll without options returns raw array', () => {
        const res = notasService.getAll();
        expect(Array.isArray(res)).toBe(true);
        expect(res.length).toBe(4);
    });

    test('getAll with filterTitle filters correctly', () => {
        const res = notasService.getAll({ filterTitle: 'bra' });
        expect(res).toHaveProperty('items');
        expect(res.totalItems).toBeGreaterThanOrEqual(1);
        expect(res.items.every(i => (i.titulo || '').toLowerCase().includes('bra'))).toBe(true);
    });

    test('getAll with filterContent filters correctly', () => {
        const res = notasService.getAll({ filterContent: 'prueba' });
        expect(res.items.length).toBe(2);
        expect(res.totalItems).toBe(2);
    });

    test('getAll with category filters correctly', () => {
        const res = notasService.getAll({ category: 'A' });
        expect(res.items.length).toBe(2);
        expect(res.items.every(i => i.categoria === 'A')).toBe(true);
    });

    test('getAll with group alias filters correctly', () => {
        mockData[0].grupo = 'Z';
        const res = notasService.getAll({ group: 'Z' });
        expect(res.items.length).toBe(1);
        expect(res.items[0].id).toBe(1);
    });

    test('getAll with date range filters correctly', () => {
        const res = notasService.getAll({ fromDate: 1500, toDate: 2500 });
        expect(res.items.length).toBe(1);
        expect(res.items[0].id).toBe(2);
    });

    test('getAll date range also uses updatedAt', () => {
        mockData[1].updatedAt = 5000;
        const res = notasService.getAll({ fromDate: 4500, toDate: 5500 });
        expect(res.items.length).toBe(1);
        expect(res.items[0].id).toBe(2);
    });

    test('getAll sorting by date desc works', () => {
        const res = notasService.getAll({ sortBy: 'date', order: 'desc' });
        expect(res.items[0].id).toBe(3);
    });

    test('getAll sorting by updatedAt desc works', () => {
        mockData[0].updatedAt = 9000;
        const res = notasService.getAll({ sortBy: 'updated', order: 'desc' });
        expect(res.items[0].id).toBe(1);
    });

    test('getAll sorting by titulo asc works', () => {
        const res = notasService.getAll({ sortBy: 'titulo', order: 'asc' });
        const titles = res.items.map(i => i.titulo || '');
        const sorted = [...titles].sort((a,b)=>a.localeCompare(b));
        expect(titles).toEqual(sorted);
    });

    test('getAll sorting by size works', () => {
        const res = notasService.getAll({ sortBy: 'size', order: 'asc' });
        const sizes = res.items.map(i => ((i.titulo||'').length + (i.contenido||'').length));
        for (let k=1;k<sizes.length;k++) expect(sizes[k]).toBeGreaterThanOrEqual(sizes[k-1]);
    });

    test('getAll pagination works', () => {
        const res = notasService.getAll({ page: 2, perPage: 2 });
        expect(res.page).toBe(2);
        expect(res.perPage).toBe(2);
        expect(res.items.length).toBe(2);
        expect(res.totalItems).toBe(4);
        expect(res.totalPages).toBe(2);
    });

    test('getAll returns totalPages 0 when no matches', () => {
        const res = notasService.getAll({ filterTitle: 'no hay match' });
        expect(res.items.length).toBe(0);
        expect(res.totalItems).toBe(0);
        expect(res.totalPages).toBe(0);
    });

    test('getAll applies default perPage when not provided', () => {
        const res = notasService.getAll({ filterTitle: 'a' });
        expect(res.perPage).toBeGreaterThan(0);
        expect(res.perPage).toBe(10);
    });

    test('create adds timestamps and id', () => {
        const nueva = notasService.create({ titulo: 'Nueva', contenido: 'contenido' });
        expect(nueva).toHaveProperty('id');
        expect(nueva).toHaveProperty('createdAt');
        expect(nueva).toHaveProperty('updatedAt');
        expect(mockData.find(n => n.id === nueva.id)).toBeDefined();
    });

    test('getById finds note', () => {
        const n = notasService.getById(1);
        expect(n).toBeDefined();
        expect(n.id).toBe(1);
    });

    test('update modifies note and sets updatedAt', () => {
        const before = notasService.getById(2);
        const res = notasService.update(2, { titulo: 'Bravo mod' });
        expect(res.titulo).toBe('Bravo mod');
        expect(res.updatedAt).toBeDefined();
        expect(res.updatedAt).not.toBe(before.updatedAt);
    });

    test('remove deletes note and returns true/false', () => {
        const ok = notasService.remove(3);
        expect(ok).toBe(true);
        expect(notasService.getById(3)).toBeUndefined();
        const nok = notasService.remove(9999);
        expect(nok).toBe(false);
    });
});
