// Crear un servidor en NodeJS que tenga distintas páginas según la URL accedida.

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Bienvenido a la página principal</h1><p>Usa /page o /error en la URL</p>');
});

app.get('/page', (req, res) => {
    res.send('<h1>Esta es la página normal</h1><p>Contenido de la página /page</p>');
});

app.get('/error', (req, res) => {
    res.status(404).send('<h1>Error 404</h1><p>Página no encontrada o con error.</p>');
});

app.listen(3000, () => {
    console.log('Servidor Express escuchando en http://localhost:3000');
});
