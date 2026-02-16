// Comprobar si dos objetos son iguales de manera recursiva.

function isSimilar(a, b) {
    if (a === b) return true;
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return false;

    if (Array.isArray(a) !== Array.isArray(b)) return false;

    if (Array.isArray(a)) {
        if (a.length !== b.length) return false;
        return a.every((v, i) => isSimilar(v, b[i]));
    } else {
        const keysA = Object.keys(a).sort();
        const keysB = Object.keys(b).sort();
        if (keysA.length !== keysB.length) return false;
        return keysA.every((k, i) => k === keysB[i] && isSimilar(a[k], b[k])
        );
    }
}

