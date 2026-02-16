import { describe, it, expect } from "vitest";
import fizzBuzz from "../src/fizzbuzz.js";

describe("FizzBuzz", () => {
    it("devuelve un array de longitud n", () => {
        expect(fizzBuzz(5)).toHaveLength(5);
    });

    it("sustituye múltiplos de 3 por Fizz", () => {
        expect(fizzBuzz(3)[2]).toBe("Fizz");
    });

    it("sustituye múltiplos de 5 por Buzz", () => {
        expect(fizzBuzz(5)[4]).toBe("Buzz");
    });

    it("sustituye múltiplos de 15 por FizzBuzz", () => {
        expect(fizzBuzz(15)[14]).toBe("FizzBuzz");
    });

    it("mantiene números como string si no son múltiplos de 3 o 5", () => {
        expect(fizzBuzz(2)[1]).toBe("2");
    });
});
