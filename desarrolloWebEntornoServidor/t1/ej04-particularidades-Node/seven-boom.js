// Seven Boom! del 1 al 30
for (let i = 1; i <= 30; i++) {
    // Si el  índice (i) es múltiplo de 7 o contiene el 7, salta el BOOM!, si no, muestra el número.

    console.log(i % 7 === 0 || String(i).includes('7') ? 'Boom!' : i);
    // muestra en la terminal si índice (i) es divisible por 7 y si el resto de i/7 da 0, es múltiplo.
}
