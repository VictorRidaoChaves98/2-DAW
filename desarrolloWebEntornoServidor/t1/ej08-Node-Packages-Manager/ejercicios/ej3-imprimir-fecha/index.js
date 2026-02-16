import chalk from 'chalk';

function padNumero(num) {
    if (num < 10) {
        return '0' + num;
    } else {
        return num;
    }
}

function mostrarFecha() {
    const ahora = new Date();

    const dia = ahora.getDate();
    const mes = ahora.getMonth() + 1;
    const anio = ahora.getFullYear();

    const hora = ahora.getHours();
    const min = ahora.getMinutes();
    const seg = ahora.getSeconds();

    // Poner cero delante si es menor que 10
    let diaStr = padNumero(dia);
    let mesStr = padNumero(mes);
    let anioStr = anio; // no necesita pad
    let horaStr = padNumero(hora);
    let minStr = padNumero(min);
    let segStr = padNumero(seg);

    let fecha = diaStr + '-' + mesStr + '-' + anioStr;
    let tiempo = horaStr + ':' + minStr + ':' + segStr;

    // Si los segundos son múltiplos de 10 o 0
    let tiempoColoreado = tiempo;
    if (seg % 10 === 0) {
        tiempoColoreado = chalk.green(tiempo);
    }

    console.log(fecha + ' ' + tiempoColoreado);
}

// Ejecutar cada segundo
setInterval(() => {
    mostrarFecha();
}, 1000);
