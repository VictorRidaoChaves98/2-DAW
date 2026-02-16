// server.js
const express = require('express');

const app = express();
const port = 3000;

// Middleware ejemplo: parsea JSON en body (útil si usas POST más adelante)
app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Ejemplos de otros métodos HTTP (opcional, parte de "Getting started")
app.post('/', (req, res) => {
    res.send('Got a POST request');
});

app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user');
});

app.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user');
});

// Arrancar servidor
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
