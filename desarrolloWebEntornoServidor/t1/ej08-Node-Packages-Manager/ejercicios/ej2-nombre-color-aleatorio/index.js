import { faker } from '@faker-js/faker';
import chalk from 'chalk';

const colores = ['red', 'green', 'yellow', 'blue', 'white'];

function colorAleatorio() {
    const index = Math.floor(Math.random() * colores.length);
    return colores[index];
}

function mostrarNombre() {
    const nombre = faker.person.firstName();
    const color = colorAleatorio();
    console.log(chalk[color](nombre));
}

for (let i = 0; i < 5; i++) {
    mostrarNombre();
}
