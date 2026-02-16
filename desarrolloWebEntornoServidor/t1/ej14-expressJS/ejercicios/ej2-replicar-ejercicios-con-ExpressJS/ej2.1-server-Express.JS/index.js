// Crear un servidor en NodeJS que devuelva Hello World! cuando se acceda al puerto 4000

import express from 'express';

const app = express();
const port = 4000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
