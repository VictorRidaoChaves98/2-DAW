import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { getData } from './apiClient';

vi.mock('axios');

describe('getData', () => {
    it('debe devolver datos simulados', async () => {
        const mockData = { id: 1, name: 'Test' };
        axios.get.mockResolvedValue({ data: mockData });

        const data = await getData('https://fakeapi.com/item');
        expect(data).toEqual(mockData);
    });

    it('debe lanzar error si la API falla', async () => {
        axios.get.mockRejectedValue(new Error('API error'));

        await expect(getData('https://fakeapi.com/item')).rejects.toThrow('Error al obtener datos');
    });
});
