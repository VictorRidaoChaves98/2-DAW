import fs from "fs";
import readlineSync from "readline-sync";
import chalk from "chalk";

const file = "notas.json";

function cargarNotas() {
    try {
        const data = fs.readFileSync(file, "utf8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function guardarNotas(notas) {
    fs.writeFileSync(file, JSON.stringify(notas, null, 2));
}

function menu() {
    console.log(chalk.red("\n=== Gestor de Notas ==="));
    console.log("1. Ver notas");
    console.log("2. Agregar nota");
    console.log("3. Borrar nota");
    console.log("4. Salir");

    const opcion = readlineSync.questionInt("\nElige una opcion: ");
    ejecutarOpcion(opcion);
}

function ejecutarOpcion(opcion) {
    let notas = cargarNotas();

    switch (opcion) {
        case 1:
            console.log(chalk.blue("\n📘 Lista de notas:"));
            if (notas.length === 0) {
                console.log(chalk.gray("No hay notas todavía."));
            } else {
                notas.forEach((nota, i) =>
                    console.log(chalk.green(`${i + 1}. ${nota}`))
                );
            }
            break;

        case 2:
            const nuevaNota = readlineSync.question("\nEscribe una nueva nota: ");
            notas.push(nuevaNota);
            guardarNotas(notas);
            console.log(chalk.green("Nota guardada con éxito."));
            break;

        case 3:
            const num = readlineSync.questionInt(
                "\nIntroduce el número de la nota a borrar: "
            );
            if (num > 0 && num <= notas.length) {
                const eliminada = notas.splice(num - 1, 1);
                guardarNotas(notas);
                console.log(chalk.red(`Nota eliminada: "${eliminada}"`));
            } else {
                console.log(chalk.red("Número no valido."));
            }
            break;

        case 4:
            console.log(chalk.yellow("Saliendo del gestor de notas ..."));
            process.exit();

        default:
            console.log(chalk.red("Opción inválida."));
    }

    // Vuelve al menú
    menu();
}

// Permitir ejecución directa desde scripts del package.json
const arg = process.argv[2];
if (arg === "ver") ejecutarOpcion(1);
else if (arg === "agregar") ejecutarOpcion(2);
else if (arg === "borrar") ejecutarOpcion(3);
else menu();
