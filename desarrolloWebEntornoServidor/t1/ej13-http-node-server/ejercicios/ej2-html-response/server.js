import http from 'http';

const server = http.createServer((req, res) => {
    // Indicamos que la respuesta será HTML
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    // Enviamos una página HTML simple
    res.end(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Servidor Node</title>
        <style>
          body { font-family: Arial; background-color: #f3f3f3; text-align: center; padding: 50px; }
          h1 { color: #2e8b57; }
        </style>
      </head>
      <body>
        <h1>¡Hola desde un servidor Node.js!</h1>
        <p>Esta respuesta está generada dinámicamente.</p>
      </body>
    </html>
  `);
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Servidor HTML escuchando en http://localhost:${PORT}`);
});
