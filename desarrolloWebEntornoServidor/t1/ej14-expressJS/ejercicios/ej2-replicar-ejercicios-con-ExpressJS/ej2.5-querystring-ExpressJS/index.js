// Devolver las páginas cargadas de un fichero .html en lugar de escritas en código.

const express = require('express');
const app = express();

// Ruta principal
app.get('/', (req, res) => {
    res.send('<h1>Usa /hello?name=TuNombre para probar el ejercicio</h1>');
});

// Ruta /hello con querystring ?name=...
app.get('/hello', (req, res) => {
    const { name } = req.query;

    if (name) {
        res.send(`<h1>Hello ${name}!</h1>`);
    } else {
        res.send('<h1>Hola desconocido! Prueba con ?name=TuNombre</h1>');
    }
});

// Arranque del servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
