/*Crear un editor de notas con Nodejs
• Tendrá un menú que permita:
    1. Crear nueva nota
    2. Editar nota existente
    3. Eliminar nota
• Cada nota será un fichero de texto, con extensión .note
• Para editar una nota, habrá que imprimir la lista de notas disponibles y seleccionar una
• Cuando se está escribiendo una nota, ha de permitir continuar su edición hasta introducir dos veces seguidas una linea en blanco*/

const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const dir = './notas';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

function menu() {
    console.log('\n1. Crear nota\n2. Editar nota\n3. Eliminar nota\n4. Salir');
    rl.question('Elige opción: ', o => {
        if (o === '1') crearNota();
        else if (o === '2') editarNota();
        else if (o === '3') eliminarNota();
        else rl.close();
    });
}

function crearNota() {
    rl.question('Nombre de la nota: ', n => {
        escribir(path.join(dir, n + '.note'), '', menu);
    });
}

function editarNota() {
    const notas = fs.readdirSync(dir).filter(f => f.endsWith('.note'));
    if (!notas.length) return console.log('No hay notas') || menu();
    console.log('Notas:', notas.map((f, i) => `${i + 1}. ${f}`).join(' | '));
    rl.question('Número a editar: ', i => {
        const f = path.join(dir, notas[i - 1]);
        escribir(f, fs.readFileSync(f, 'utf8'), menu);
    });
}

function eliminarNota() {
    const notas = fs.readdirSync(dir).filter(f => f.endsWith('.note'));
    if (!notas.length) return console.log('No hay notas') || menu();
    console.log('Notas:', notas.map((f, i) => `${i + 1}. ${f}`).join(' | '));
    rl.question('Número a eliminar: ', i => {
        fs.unlinkSync(path.join(dir, notas[i - 1]));
        console.log('Nota eliminada');
        menu();
    });
}

// Función que permite escribir hasta dos líneas vacías seguidas
function escribir(file, contenido, cb) {
    console.log('Escribe tu nota (dos líneas vacías para terminar)');
    let vacias = 0;
    rl.removeAllListeners('line');
    rl.on('line', l => {
        if (!l.trim()) vacias++; else vacias = 0;
        if (vacias >= 2) {
            fs.writeFileSync(file, contenido, 'utf8');
            console.log('Nota guardada');
            rl.removeAllListeners('line');
            cb();
        } else contenido += l + '\n';
    });
}

menu();
