/* Dance for Cash
Juego con Arrays interactivo para meter valores y luego mostrarlos.*/

const readline = require('readline'); // readline sirve para leer entradas en la terminal.
const rl = readline.createInterface({
    input: process.stdin, // lo que escribes desde el teclado
    output: process.stdout // lo que se muestra en pantalla (terminal)
});

function danceForCash(movimientos) { // función que recibe un array de números.
    const total = movimientos.reduce((suma, valor) => suma + valor, 0); // se calcula la suma total de los valores del array usando reduce()
    console.log(`Balance total: ${total}€`); // see muestra el total en pantalla.

    if (total > 0) console.log("Ganas dinero!");

    else if (total < 0) console.log("Pierdes dinero!");

    else console.log("Te quedas igual");

}

rl.question('Introduce los valores', entrada => { // introduce los valores separados por comas.

    const movimientos = entrada.split(',').map(Number); // se pasa de String a Array de numeros.

    danceForCash(movimientos); // se llama a la función con el array creado.

    rl.close(); // cerramos la interfaz de readline.
});
