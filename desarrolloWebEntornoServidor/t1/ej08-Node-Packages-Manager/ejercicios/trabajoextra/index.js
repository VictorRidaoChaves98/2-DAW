// editor de notas en Node.js - ESM + Chalk v5
import fs from 'fs';
import readline from 'readline';
import path from 'path';
import chalk from 'chalk';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const dir = './notas';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

function menu() {
    console.log(chalk.yellow('\n=== Editor de Notas ==='));
    console.log('1. Crear nota\n2. Editar nota\n3. Eliminar nota\n4. Salir');

    rl.question('Elige opción: ', o => {
        if (o === '1') crearNota();
        else if (o === '2') editarNota();
        else if (o === '3') eliminarNota();
        else {
            console.log(chalk.blue('¡Hasta luego!'));
            rl.close();
        }
    });
}

function crearNota() {
    rl.question('Nombre de la nota: ', n => {
        escribir(path.join(dir, n + '.note'), '', menu);
    });
}

function editarNota() {
    const notas = fs.readdirSync(dir).filter(f => f.endsWith('.note'));
    if (!notas.length) {
        console.log(chalk.red('No hay notas'));
        return menu();
    }
    console.log('Notas:', notas.map((f, i) => `${i + 1}. ${f}`).join(' | '));
    rl.question('Número a editar: ', i => {
        const f = path.join(dir, notas[i - 1]);
        escribir(f, fs.readFileSync(f, 'utf8'), menu);
    });
}

function eliminarNota() {
    const notas = fs.readdirSync(dir).filter(f => f.endsWith('.note'));
    if (!notas.length) {
        console.log(chalk.red('No hay notas'));
        return menu();
    }
    console.log('Notas:', notas.map((f, i) => `${i + 1}. ${f}`).join(' | '));
    rl.question('Número a eliminar: ', i => {
        fs.unlinkSync(path.join(dir, notas[i - 1]));
        console.log(chalk.green('Nota eliminada'));
        menu();
    });
}

// Función que permite escribir hasta dos líneas vacías seguidas
function escribir(file, contenido, cb) {
    console.log(chalk.cyan('Escribe tu nota (dos líneas vacías para terminar)'));
    let vacias = 0;
    rl.removeAllListeners('line');
    rl.on('line', l => {
        if (!l.trim()) vacias++; else vacias = 0;
        if (vacias >= 2) {
            fs.writeFileSync(file, contenido, 'utf8');
            console.log(chalk.green('Nota guardada'));
            rl.removeAllListeners('line');
            cb();
        } else contenido += l + '\n';
    });
}

// Iniciar menú
menu();
