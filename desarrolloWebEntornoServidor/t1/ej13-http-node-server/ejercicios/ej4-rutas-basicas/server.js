import http from 'http';

const server = http.createServer((req, res) => {
    if (req.url === '/page') {
        // Página principal
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
      <h1>Bienvenido a la Página</h1>
      <p>Esta es una página web servida desde Node.js</p>
      <a href="/error">Ir a la página de error</a>
    `);
    } else if (req.url === '/error') {
        // Página de error 404
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
      <h1>404 - Página no encontrada</h1>
      <p>Esta es una página de error personalizada.</p>
      <a href="/page">Volver a la página</a>
    `);
    } else {
        // Cualquier otra ruta también mostrará 404
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
      <h1>404 - Página no encontrada</h1>
      <p>La ruta que intentas acceder no existe.</p>
      <a href="/page">Ir a la página</a>
    `);
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
