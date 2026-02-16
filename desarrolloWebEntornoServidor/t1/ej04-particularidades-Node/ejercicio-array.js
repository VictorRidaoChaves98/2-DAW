// Eliminar todos los elementos inferiores a 18 de un array de números

const numeros = [1, 5, 12, 6, 20, 32, 18, 7, 3, 25];
const mayor18 = numeros.filter(num => num >= 18); // Con 'filter' te quedas con los que sean mayores o iguales a 18.

console.log('Números mayores o iguales a 18:', mayor18);