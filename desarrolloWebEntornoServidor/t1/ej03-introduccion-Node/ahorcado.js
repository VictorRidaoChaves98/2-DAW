/* JUEGO DEL AHORCADO EN NODE.JS */

// 1. Importar el módulo 'readline' para leer texto del usuario
const readline = require('readline');

// 2. Crear la interfaz para entrada/salida estándar
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 3. Lista de palabras posibles
const palabras = ['javascript', 'nodejs', 'programacion', 'computadora', 'pantalla'];

// 4. Elegir una palabra al azar
const palabra = palabras[Math.floor(Math.random() * palabras.length)];

// 5. Crear la palabra oculta con guiones bajos
let oculta = "_".repeat(palabra.length).split('');

// 6. Intentos disponibles
let intentos = 6;

// 7. Mostrar mensaje de bienvenida
console.log("¡Bienvenido al juego del Ahorcado!");
console.log("Adivina la palabra letra por letra. Tienes " + intentos + " intentos.\n");

// 8. Función principal del juego
function jugar() {
  console.log("Palabra: " + oculta.join(' '));
  console.log("Intentos restantes: " + intentos);

  // 9. Preguntar al usuario por una letra
  rl.question("Introduce una letra: ", (letra) => {

    // 10. Comprobar si la letra está en la palabra
    if (palabra.includes(letra)) {
      // 11. Reemplazar guiones por la letra acertada
      for (let i = 0; i < palabra.length; i++) {
        if (palabra[i] === letra) oculta[i] = letra;
      }
      console.log("¡Bien hecho!\n");
    } else {
      // 12. Restar un intento si falla
      intentos--;
      console.log("Letra incorrecta. Te quedan " + intentos + " intentos.\n");
    }

    // 13. Comprobar si ha ganado o perdido
    if (!oculta.includes("_")) {
      console.log("🎉 ¡Ganaste! La palabra era: " + palabra);
      rl.close();
    } else if (intentos === 0) {
      console.log("💀 Has perdido. La palabra era: " + palabra);
      rl.close();
    } else {
      // 14. Si no, seguir jugando
      jugar();
    }
  });
}

// 15. Empezar el juego
jugar();
