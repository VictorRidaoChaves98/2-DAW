import { describe, it, expect } from 'vitest';
import { fizzBuzzFlexible } from './fizzbuzzFlexible.js';

describe('fizzBuzzFlexible', () => {
    it('debería devolver fizzbuzz por defecto hasta 15', () => {
        const output = fizzBuzzFlexible(15);
        expect(output[2]).toBe('fizz');  // 3
        expect(output[4]).toBe('buzz');  // 5
        expect(output[14]).toBe('fizzbuzz'); // 15
    });

    it('debería aplicar condiciones dinámicas', () => {
        const conditions = { 2: 'poo', 3: 'fizz', 5: 'buzz', 7: 'bar' };
        const output = fizzBuzzFlexible(14, conditions);
        expect(output[1]).toBe('poo'); // 2
        expect(output[2]).toBe('fizz'); // 3
        expect(output[5]).toBe('poobuzz'); // 6
        expect(output[6]).toBe('bar'); // 7
    });

    it('debería manejar n = 0', () => {
        const output = fizzBuzzFlexible(0);
        expect(output).toEqual([]);
    });
});
