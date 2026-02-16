const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// --------------------
// 1. /header
// --------------------
app.get('/header', (req, res) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({
            code: 401,
            error: "Unauthorized",
            message: "Error: Set a token to login"
        });
    }
    console.log("Token recibido:", token);
    res.status(200).send("Token recibido correctamente");
});

// --------------------
// 2. /params
// --------------------
app.get('/params/:name', (req, res) => {
    const { name } = req.params;
    res.status(200).send(`Hola ${name}`);
});

// --------------------
// 3. /query
// --------------------
app.get('/query', (req, res) => {
    const n = parseInt(req.query.n) || 100;
    let suma = 0;
    for (let i = 1; i <= n; i++) {
        suma += i;
    }
    res.status(200).send(`La suma de los números del 1 al ${n} es ${suma}`);
});

// --------------------
// 4. /body
// --------------------
app.post('/body', (req, res) => {
    const body = req.body;

    console.log("Contenido del body recibido:");
    for (const key in body) {
        console.log(`${key}: ${body[key]}`);
    }

    // HTML formateado con saltos de línea
    let html = '<ul>\n';
    for (const key in body) {
        html += `  <li>${key}: ${body[key]}</li>\n`;
    }
    html += '</ul>\n';

    res.send(html);
});

// --------------------
// Escuchar puerto
// --------------------
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// --------------------
// 5. /animals router
// --------------------
const animalsRouter = express.Router();

animalsRouter.get('/dog', (req, res) => {
    res.json({ grow: "guau guau" });
});

animalsRouter.get('/cat', (req, res) => {
    res.json({ grow: "miau" });
});

animalsRouter.get('/bird', (req, res) => {
    res.json({ grow: "pio pio" });
});

// Usar el router bajo la ruta /animals
app.use('/animals', animalsRouter);


// 6. Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        code: 404,
        error: "Not Found",
        message: "Error: Path not found"
    });
});
