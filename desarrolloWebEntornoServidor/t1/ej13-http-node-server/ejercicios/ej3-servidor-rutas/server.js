import http from 'http';
import url from 'url';

const server = http.createServer((req, res) => {
    const path = url.parse(req.url, true).pathname;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    if (path === '/' || path === '/inicio') {
        res.end(`
      <h1>Inicio</h1>
      <p>Bienvenido a la página principal.</p>
      <a href="/acerca">Ir a Acerca de</a> | 
      <a href="/contacto">Ir a Contacto</a>
    `);
    } else if (path === '/acerca') {
        res.end(`
      <h1>Acerca de</h1>
      <p>Esta es una aplicación de ejemplo con Node.js.</p>
      <a href="/">Volver al inicio</a>
    `);
    } else if (path === '/contacto') {
        res.end(`
      <h1>Contacto</h1>
      <p>Puedes contactarnos en: <strong>info@ejemplo.com</strong></p>
      <a href="/">Volver al inicio</a>
    `);
    } else {
        // Página 404 si la ruta no existe
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
      <h1>404 - Página no encontrada</h1>
      <p>La ruta <strong>${path}</strong> no existe.</p>
      <a href="/">Volver al inicio</a>
    `);
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
