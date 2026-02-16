import chalk from "chalk";

// tomamos el argumento desde la línea de comandos
const args = process.argv.slice(2);
const texto = args.join(" ");

if (!texto) {
    console.log(chalk.yellow("Introduce un texto como string."));
    process.exit(1);
}

// detecta qué script se ejecuta
const comando = process.env.npm_lifecycle_event;

switch (comando) {
    case "imprime:azul":
        console.log(chalk.blue(texto));
        break;
    case "imprime:rojo":
        console.log(chalk.red(texto));
        break;
    case "imprime:verde":
        console.log(chalk.green(texto));
        break;
    default:
        console.log(texto);
        break;
}
