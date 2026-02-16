import { DateTime } from "luxon";

/**
 * Compara dos fechas y devuelve cuál es la startDate y endDate
 * @param {string|Date} date1 - Primera fecha
 * @param {string|Date} [date2=new Date()] - Segunda fecha o fecha actual
 * @returns {{startDate: string, endDate: string}} ISO strings en UTC
 */
export function dateCompare(date1, date2 = new Date()) {
    if (!date1) return null;

    const d1 = date1 instanceof Date ? DateTime.fromJSDate(date1) : DateTime.fromISO(date1);
    const d2 = date2 instanceof Date ? DateTime.fromJSDate(date2) : DateTime.fromISO(date2);

    let start, end;
    if (d1 <= d2) {
        start = d1;
        end = d2;
    } else {
        start = d2;
        end = d1;
    }

    return {
        startDate: start.toUTC().toISO(),
        endDate: end.toUTC().toISO(),
    };
}