/*
Crear 2 rutas:
• /page: Devuelve una pagina web
• /error: Devuelve una pagina de error con el código 404
*/

const express = require('express');
const path = require('path');
const app = express();

// Ruta para página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta /page
app.get('/page', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page.html'));
});

// Ruta /error
app.get('/error', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
});

// Arranque del servidor
app.listen(3000, () => {
    console.log('Servidor Express escuchando en http://localhost:3000');
});
