/*
Crear un proyecto con dos archivos javascript (index.js, app.js) los cuales el primero importará el segundo.
El proyecto contará con el fichero de configuración para depurar en vscode.
Deberá tener al menos dos configuraciones:
1. Ejecutar siempre el index.js.
2. Ejercutar el archivo actual del editor.
*/

const { saludar, sumar } = require('./app');

// Variables para probar en depuración
const nombre = 'Victor';
const a = 5;
const b = 7;

saludar(nombre);
sumar(a, b);

console.log('Index.js finalizado');
