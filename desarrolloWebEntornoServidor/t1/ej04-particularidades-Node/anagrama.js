// Crear anagramas

function esAnagrama(palabra1, palabra2) {

    palabra1 = palabra1.toLowerCase(); // pasamos las palabras a minusculas para evitar errores.
    palabra2 = palabra2.toLowerCase(); // igual xon la segunda palabra.

    if (palabra1 === palabra2) return false;

    // Ordenamos las letras de cada palabra y las comparamos.
    
    const ordenada1 = palabra1.split('').sort().join('');
    const ordenada2 = palabra2.split('').sort().join(''); 

    return ordenada1 === ordenada2;
}

// Ejemplos para usar en la terminal

console.log(esAnagrama("amor", "roma"));
console.log(esAnagrama("hola", "aloh"));
console.log(esAnagrama("perro", "perro")); // si la palabra es igual, no es un anagrama.
console.log(esAnagrama("casa", "saco"));
