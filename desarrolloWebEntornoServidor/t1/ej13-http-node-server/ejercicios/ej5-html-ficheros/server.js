import http from 'http';
import fs from 'fs';
import path from 'path';

// Obtenemos la ruta base del proyecto
const __dirname = process.cwd();

const server = http.createServer((req, res) => {
    if (req.url === '/page') {
        // Ruta de página
        const filePath = path.join(__dirname, 'pages', 'page.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Error al cargar la página');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            }
        });

    } else if (req.url === '/error') {
        // Ruta de error
        const filePath = path.join(__dirname, 'pages', 'error.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Error al cargar la página de error');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            }
        });

    } else {
        // Rutas no definidas → página de error también
        const filePath = path.join(__dirname, 'pages', 'error.html');
        fs.readFile(filePath, (err, data) => {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data || '<h1>404 - Página no encontrada</h1>');
        });
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
