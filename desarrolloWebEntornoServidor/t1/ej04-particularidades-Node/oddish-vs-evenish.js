/* Oddish vs Evenish:

- Numero par: Evenish
- Numero impar: Oddish */

function oddishEvenish(num) {
    // Pasamos el número a String, lo separamos en dígitos y los sumamos
    const suma = String(num)
        .split('')
        .reduce((total, digito) => total + Number(digito), 0);

    // Si la suma es par → Evenish, si no → Oddish
    return suma % 2 === 0 ? 'Evenish' : 'Oddish';
}

// Ejemplos:
console.log(oddishEvenish(0));
console.log(oddishEvenish(1));
console.log(oddishEvenish(2));
console.log(oddishEvenish(12));
console.log(oddishEvenish(43));
console.log(oddishEvenish(675));
console.log(oddishEvenish(39593929));
console.log(oddishEvenish(123456789));
console.log(oddishEvenish(59694039293940202));

