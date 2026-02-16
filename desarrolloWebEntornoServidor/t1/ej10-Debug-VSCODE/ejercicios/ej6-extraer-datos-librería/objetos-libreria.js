/*
Extraer los datos de un objeto de una librería
• Propiedades
• Métodos
• Eventos
*/

import EventEmitter from 'events';

class MiObjeto extends EventEmitter {
    constructor(nombre) {
        super();
        this.nombre = nombre; // propiedad
    }

    saludar() { // método
        console.log(`Hola, soy ${this.nombre}`);
        this.emit('saludo', this.nombre); // evento
    }
}

// Crear instancia
const obj = new MiObjeto('Victor');

// Extraer propiedades
console.log('Propiedades:', Object.keys(obj)); // ['nombre']

// Extraer métodos (propias y heredadas)
const metodos = Object.getOwnPropertyNames(MiObjeto.prototype).filter(m => m !== 'constructor');
console.log('Métodos:', metodos); // ['saludar']

// Escuchar evento
obj.on('saludo', (nombre) => {
    console.log(`Evento capturado: saludo de ${nombre}`);
});

// Llamar método
obj.saludar();
