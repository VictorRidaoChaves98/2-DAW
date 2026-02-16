// Sumar todos los números de un array con reduce()

const numeros = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const sumaTotal = numeros.reduce((acumulador, valorActual) => acumulador + valorActual, 0); // con reduce() se suman todos los valores del array.

console.log('Suma total:', sumaTotal);