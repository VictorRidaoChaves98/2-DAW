// Leer un fichero de manera síncrona y asíncrona

// --- LECTURA SÍNCRONA ---

const fs = require('fs');

console.log("Leyendo archivo de forma SÍNCRONA...");
try {
    const datos = fs.readFileSync('./texto.txt', 'utf-8');
    console.log("Contenido del archivo:", datos);
} catch (err) {
    console.log("Error leyendo archivo:", err);
}
console.log("Fin de la lectura");

// --- LECTURA ASÍNCRONA MEDIANTE CALLBACK ---

console.log("Leyendo archivo de forma ASÍNCRONA...");

fs.readFile('./texto.txt', 'utf-8', (err, datos) => {
    if (err) {
        console.log("Error leyendo archivo:", err);
        return;
    }
    console.log("Contenido del archivo:", datos);
});
console.log("Fin del script (lectura sigue en segundo plano)");

// --- LECTURA ASÍNCRONA MEDIANTE PROMESAS + ASYNC / AWAIT---

const fs = require('fs').promises;

async function leerArchivoAsync() {
    try {
        console.log("Leyendo archivo con async/await...");
        const datos = await fs.readFile('./texto.txt', 'utf-8');
        console.log("Contenido:", datos);
    } catch (err) {
        console.log("Error:", err);
    }
}

leerArchivoAsync();


