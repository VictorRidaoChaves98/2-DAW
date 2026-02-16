// Crear un servidor en NodeJS que devuelva una página web (puerto 3000)

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Ruta principal: devuelve el HTML
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'page.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error al cargar la página.');
        } else {
            res.send(data);
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor Express en http://localhost:${port}`);
});
