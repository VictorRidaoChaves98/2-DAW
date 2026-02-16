// 5. Realizar una petición con 'node-fetch' e inspeccionar la respuesta en el inspector.

import fetch from 'node-fetch';

const url = 'https://reqres.in/api/users?page=2';

async function obtenerUsuarios() {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    console.log(datos);
}

obtenerUsuarios();

// Poner los breakpoints en las líneas 8, 9, 10.