import chalk from "chalk";
import readlineSync from "readline-sync";
import { ejecutarOpcion } from "../routes/notasRoutes.js";

export function menu() {
    console.log(chalk.red("\n=== Gestor de Notas ==="));
    console.log("1. Ver notas");
    console.log("2. Agregar nota");
    console.log("3. Borrar nota");
    console.log("4. Salir");

    const opcion = readlineSync.questionInt("\nElige una opcion: ");
    ejecutarOpcion(opcion);

    menu(); // volver a mostrar menú
}
