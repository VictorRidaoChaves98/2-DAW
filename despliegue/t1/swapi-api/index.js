const express = require('express');
const fetch = require('node-fetch'); // Importar fetch correctamente

const app = express();
const PORT = 3000;

app.get('/characters', async (req, res) => {
    const name = req.query.name;
    if (!name) return res.status(400).json({ error: 'Se requiere el parámetro "name"' });

    try {
        const response = await fetch(`https://swapi.dev/api/people/?search=${encodeURIComponent(name)}`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al conectar con SWAPI' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API corriendo en http://0.0.0.0:${PORT}`);
});
