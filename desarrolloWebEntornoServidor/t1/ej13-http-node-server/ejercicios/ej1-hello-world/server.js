import http from 'http';

const server = http.createServer((req, res) => {

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

    res.end('¡Hola mundo desde Node.js!');
});

const PORT = 4000;

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
