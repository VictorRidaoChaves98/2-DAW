// Realizar programa que reciba por argumentos el nombre de un fichero e imprima su contenido

// 1. Importar el módulo 'file system'

const fs = require('fs');

// 2. Obtener el nombre del fichero por la terminal

const nombreArchivo = process.argv[2];

if (!nombreArchivo) {
    console.log('Indica el nombre del archivo.');
    process.exit(1);
}

try {
    const contenido = fs.readFileSync(nombreArchivo, 'utf8');
    console.log(contenido);
} catch (err) {
    console.error('Error al leer el archivo:', err.message);
}