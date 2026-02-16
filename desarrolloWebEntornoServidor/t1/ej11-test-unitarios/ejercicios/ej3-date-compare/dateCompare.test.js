import { describe, it, expect } from "vitest";
import { dateCompare } from "./dateCompare.js";

describe("dateCompare", () => {
    it("debe devolver correctamente startDate y endDate para dos fechas", () => {
        const date1 = "2025-11-04T10:00:00.000Z";
        const date2 = "2025-11-04T11:00:00.000Z";

        const result = dateCompare(date1, date2);

        expect(result.startDate).toBe(date1);
        expect(result.endDate).toBe(date2);
    });

    it("debe invertir las fechas si la primera es posterior", () => {
        const date1 = "2025-11-05T13:00:00.000Z";
        const date2 = "2025-11-05T12:00:00.000Z";

        const result = dateCompare(date1, date2);

        expect(result.startDate).toBe(date2);
        expect(result.endDate).toBe(date1);
    });

    it("si no se pasa segunda fecha, compara con la fecha actual", () => {
        const now = new Date();
        const result = dateCompare(now.toISOString());

        expect(result.startDate).toBe(now.toISOString());
        // endDate debería ser igual o posterior a startDate
        expect(new Date(result.endDate).getTime()).toBeGreaterThanOrEqual(new Date(result.startDate).getTime());
    });

    it("funciona con objetos Date", () => {
        const d1 = new Date("2023-01-01T00:00:00Z");
        const d2 = new Date("2023-01-02T00:00:00Z");

        const result = dateCompare(d1, d2);

        expect(result.startDate).toBe(d1.toISOString());
        expect(result.endDate).toBe(d2.toISOString());
    });
});
