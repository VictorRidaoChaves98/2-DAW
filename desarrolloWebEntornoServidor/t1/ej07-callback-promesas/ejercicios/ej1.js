// Ejecutar y modificar los códigos de ejemplo

// • Situación actual y problemática

console.log('Espera');
setTimeout(() => console.log('...'), 1000);
console.log('Ya!');

// • Presentación de promesas

const promise = new Promise((resolve, reject) => {
    resolve('Success!');
    // reject("Error!");
});

promise
    .then(value => console.log(value))
    .catch(reason => console.log(reason));

// • Simplificación de escritura de promesas

const promise = new Promise((resolve, reject) => {
    resolve('Success!');
    // reject("Error!");
});

promise
    .then(value => console.log(value))
    .catch(reason => console.log(reason));

// • Tiempo de espera usando promesas

console.log('1');

const promise = new Promise((resolve) => {
    setTimeout(() => {
        console.log('resolve');
        resolve('resolve');
    }, 1000);
});

console.log('2');

promise.then(val => {
    console.log('done');
});

console.log('3');

// • Uso de async/await para programación funcional

function sleep(ms) {
    return new Promise(resolve => setTimeout(() => {
        console.log('resolve');
        resolve('resolve');
    }, ms));
}

async function init() {
    console.log('1');
    await sleep(1000);
    console.log('2');
}

init();
console.log('3');

// • Promesas dentro de los bucles (problemática)

function timeout(x) {
    return new Promise(resolve => setTimeout(() => resolve(x), x));
}

async function init() {
    const results = [];
    for (let i = 0; i < 20; i++) {
        const promise = await timeout(i * 100).then(x => results.push({ index: i, timeout: x }));
    }
    console.log(results);
}

init();

// • Ejemplo de uso típico y extendido de promesas

const fetch = require('node-fetch');

async function get(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function init() {
    const data = await get('https://reqres.in/api/users?page=2');
    const data2 = await get('https://reqres.in/api/users?page=3');
    console.log(data);
    console.log(data2);
}

init();






