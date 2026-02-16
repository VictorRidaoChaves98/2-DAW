import http from 'http';
import url from 'url';

const server = http.createServer((req, res) => {
    // Analizamos la URL y la query string
    const parsedUrl = url.parse(req.url, true);
    const name = parsedUrl.query.name;

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

    if (name) {
        res.end(`Hello ${name}!`);
    } else {
        res.end('Hello Víctor!');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
