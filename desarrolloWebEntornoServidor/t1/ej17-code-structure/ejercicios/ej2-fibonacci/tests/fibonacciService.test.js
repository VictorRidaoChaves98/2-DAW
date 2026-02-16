const fibonacci = require("../utils/fibonacciService");

describe("Fibonacci Service", () => {
    test("Debe devolver 0 si n = 0", () => {
        expect(fibonacci(0)).toBe(0);
    });

    test("Debe devolver 1 si n = 1", () => {
        expect(fibonacci(1)).toBe(1);
    });

    test("Debe devolver 55 si n = 10", () => {
        expect(fibonacci(10)).toBe(55);
    });

    test("Debe calcular correctamente varios valores", () => {
        expect(fibonacci(5)).toBe(5);
        expect(fibonacci(6)).toBe(8);
        expect(fibonacci(7)).toBe(13);
    });
});
