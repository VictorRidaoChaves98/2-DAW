// Ruta fizzbuzz con query string de un numero, y devuelve toda la secuencia de números hasta dicho numero.

const express = require('express');
const app = express();
const PORT = 3000;

app.get('/fizzbuzz', (req, res) => {
    const num = parseInt(req.query.num, 10);

    if (isNaN(num) || num < 1) {
        return res.send('<h3>Por favor, proporciona un número válido usando ?num=10</h3>');
    }

    let output = '';
    for (let i = 1; i <= num; i++) {
        let line = '';
        if (i % 3 === 0) line += 'Fizz';
        if (i % 5 === 0) line += 'Buzz';
        if (!line) line = i;
        output += line + ' ';
    }

    res.send(`<h2>FizzBuzz hasta ${num}:</h2><p>${output}</p>`);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

/*
Para que funcione se debe abrir la ruta http://localhost:3000/fizzbuzz?num=numeroquesea

*/