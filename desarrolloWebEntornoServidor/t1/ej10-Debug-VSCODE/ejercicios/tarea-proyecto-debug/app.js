function saludar(nombre) {
    const saludo = `Hola, ${nombre}! Bienvenido al proyecto de depuración.`;
    console.log(saludo);
    return saludo;
}

function sumar(a, b) {
    const resultado = a + b;
    console.log(`La suma de ${a} + ${b} es ${resultado}`);
    return resultado;
}

module.exports = { saludar, sumar };
