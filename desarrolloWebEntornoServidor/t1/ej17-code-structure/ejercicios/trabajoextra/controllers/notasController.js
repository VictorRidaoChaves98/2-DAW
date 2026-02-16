import readlineSync from "readline-sync";
import chalk from "chalk";
import { cargarNotas, guardarNotas } from "../utils/fileManager.js";

export function verNotas() {
    const notas = cargarNotas();

    console.log(chalk.blue("\n📘 Lista de notas:"));

    if (notas.length === 0) {
        console.log(chalk.gray("No hay notas todavía."));
    } else {
        notas.forEach((nota, i) =>
            console.log(chalk.green(`${i + 1}. ${nota}`))
        );
    }
}

export function agregarNota() {
    const notas = cargarNotas();
    const nuevaNota = readlineSync.question("\nEscribe una nueva nota: ");
    notas.push(nuevaNota);
    guardarNotas(notas);
    console.log(chalk.green("Nota guardada con éxito."));
}

export function borrarNota() {
    const notas = cargarNotas();
    const num = readlineSync.questionInt("\nNúmero de la nota a borrar: ");

    if (num > 0 && num <= notas.length) {
        const eliminada = notas.splice(num - 1, 1);
        guardarNotas(notas);
        console.log(chalk.red(`Nota eliminada: "${eliminada}"`));
    } else {
        console.log(chalk.red("Número no válido."));
    }
}
