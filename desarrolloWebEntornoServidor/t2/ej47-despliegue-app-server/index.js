const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta principal con HTML
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Aplicación Node.js - Render</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .header {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          margin-bottom: 30px;
          text-align: center;
        }
        h1 {
          color: #667eea;
          margin-bottom: 10px;
          font-size: 2.5em;
        }
        .subtitle {
          color: #666;
          font-size: 1.2em;
        }
        .badge {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          margin: 15px 5px;
          font-size: 0.9em;
          font-weight: bold;
        }
        .card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          margin-bottom: 20px;
        }
        .card h2 {
          color: #667eea;
          margin-bottom: 20px;
          border-bottom: 3px solid #667eea;
          padding-bottom: 10px;
        }
        .endpoint {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          margin: 15px 0;
          border-left: 4px solid #667eea;
        }
        .method {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 5px;
          font-weight: bold;
          font-size: 0.85em;
          margin-right: 10px;
        }
        .get { background: #10b981; color: white; }
        .post { background: #3b82f6; color: white; }
        .code {
          background: #1e293b;
          color: #10b981;
          padding: 15px;
          border-radius: 8px;
          margin-top: 10px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        .test-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1em;
          margin-top: 10px;
          transition: background 0.3s;
        }
        .test-btn:hover {
          background: #5568d3;
        }
        .result {
          background: #f0fdf4;
          border: 2px solid #10b981;
          padding: 15px;
          border-radius: 8px;
          margin-top: 15px;
          display: none;
        }
        .footer {
          text-align: center;
          color: white;
          margin-top: 30px;
          padding: 20px;
        }
        @media (max-width: 768px) {
          h1 { font-size: 1.8em; }
          .card { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Aplicación Node.js</h1>
          <p class="subtitle">Desplegada con éxito en Render</p>
          <div>
            <span class="badge">Node.js</span>
            <span class="badge">Express</span>
            <span class="badge">Render</span>
          </div>
          <p style="margin-top: 20px; color: #888;">
            📅 ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}
          </p>
        </div>

        <div class="card">
          <h2>📡 Endpoints Disponibles</h2>
          
          <div class="endpoint">
            <span class="method get">GET</span>
            <strong>/api/info</strong>
            <p style="margin-top: 8px; color: #666;">Obtiene información sobre la aplicación</p>
            <button class="test-btn" onclick="testEndpoint('/api/info', 'result1')">Probar</button>
            <div id="result1" class="result"></div>
          </div>

          <div class="endpoint">
            <span class="method get">GET</span>
            <strong>/api/saludo/:nombre</strong>
            <p style="margin-top: 8px; color: #666;">Saludo personalizado</p>
            <div class="code">/api/saludo/Juan</div>
            <button class="test-btn" onclick="testEndpoint('/api/saludo/Visitante', 'result2')">Probar</button>
            <div id="result2" class="result"></div>
          </div>

          <div class="endpoint">
            <span class="method get">GET</span>
            <strong>/api/calcular</strong>
            <p style="margin-top: 8px; color: #666;">Calculadora matemática</p>
            <div class="code">/api/calcular?num1=10&num2=5&operacion=suma</div>
            <button class="test-btn" onclick="testEndpoint('/api/calcular?num1=15&num2=3&operacion=multiplicacion', 'result3')">Probar (15 × 3)</button>
            <div id="result3" class="result"></div>
          </div>

          <div class="endpoint">
            <span class="method post">POST</span>
            <strong>/api/usuario</strong>
            <p style="margin-top: 8px; color: #666;">Registro de usuario</p>
            <div class="code">{ "nombre": "Juan", "email": "juan@ejemplo.com", "edad": 25 }</div>
            <button class="test-btn" onclick="testPostEndpoint()">Probar</button>
            <div id="result4" class="result"></div>
          </div>
        </div>

        <div class="card">
          <h2>ℹ️ Información del Proyecto</h2>
          <p><strong>Proyecto:</strong> VMRC-DWES - T2 - Ejercicio 47</p>
          <p><strong>Tecnologías:</strong> Node.js + Express</p>
          <p><strong>Despliegue:</strong> Render</p>
          <p><strong>Estado:</strong> <span style="color: #10b981; font-weight: bold;">✓ Activo</span></p>
        </div>

        <div class="footer">
          <p>💻 Desarrollado con Node.js y desplegado en Render</p>
          <p style="margin-top: 10px; font-size: 0.9em;">VMRC-DWES © 2026</p>
        </div>
      </div>

      <script>
        async function testEndpoint(endpoint, resultId) {
          const resultDiv = document.getElementById(resultId);
          resultDiv.style.display = 'block';
          resultDiv.innerHTML = '⏳ Cargando...';
          
          try {
            const response = await fetch(endpoint);
            const data = await response.json();
            resultDiv.innerHTML = '<strong>Respuesta:</strong><pre style="margin-top: 10px; background: white; padding: 10px; border-radius: 5px; overflow-x: auto;">' + 
                                  JSON.stringify(data, null, 2) + '</pre>';
          } catch (error) {
            resultDiv.innerHTML = '❌ Error: ' + error.message;
            resultDiv.style.background = '#fee';
            resultDiv.style.borderColor = '#f00';
          }
        }

        async function testPostEndpoint() {
          const resultDiv = document.getElementById('result4');
          resultDiv.style.display = 'block';
          resultDiv.innerHTML = '⏳ Enviando datos...';
          
          try {
            const response = await fetch('/api/usuario', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nombre: 'Usuario Demo',
                email: 'demo@ejemplo.com',
                edad: 25
              })
            });
            const data = await response.json();
            resultDiv.innerHTML = '<strong>Respuesta:</strong><pre style="margin-top: 10px; background: white; padding: 10px; border-radius: 5px; overflow-x: auto;">' + 
                                  JSON.stringify(data, null, 2) + '</pre>';
          } catch (error) {
            resultDiv.innerHTML = '❌ Error: ' + error.message;
            resultDiv.style.background = '#fee';
            resultDiv.style.borderColor = '#f00';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Ruta de información
app.get('/api/info', (req, res) => {
  res.json({
    nombre: 'Aplicación de ejemplo',
    version: '1.0.0',
    tecnologias: ['Node.js', 'Express', 'Render'],
    autor: 'VMRC-DWES'
  });
});

// Ruta de saludo personalizado
app.get('/api/saludo/:nombre', (req, res) => {
  const { nombre } = req.params;
  res.json({
    mensaje: `¡Hola ${nombre}!`,
    timestamp: new Date().toISOString()
  });
});

// Ruta para operaciones matemáticas
app.get('/api/calcular', (req, res) => {
  const { num1, num2, operacion } = req.query;
  
  if (!num1 || !num2 || !operacion) {
    return res.status(400).json({
      error: 'Faltan parámetros',
      ejemplo: '/api/calcular?num1=10&num2=5&operacion=suma'
    });
  }

  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);
  let resultado;

  switch (operacion) {
    case 'suma':
      resultado = n1 + n2;
      break;
    case 'resta':
      resultado = n1 - n2;
      break;
    case 'multiplicacion':
      resultado = n1 * n2;
      break;
    case 'division':
      resultado = n2 !== 0 ? n1 / n2 : 'Error: División por cero';
      break;
    default:
      return res.status(400).json({
        error: 'Operación no válida',
        operaciones: ['suma', 'resta', 'multiplicacion', 'division']
      });
  }

  res.json({
    operacion,
    num1: n1,
    num2: n2,
    resultado
  });
});

// Ruta para datos de usuario (POST)
app.post('/api/usuario', (req, res) => {
  const { nombre, email, edad } = req.body;
  
  if (!nombre || !email) {
    return res.status(400).json({
      error: 'El nombre y email son obligatorios'
    });
  }

  res.json({
    mensaje: 'Usuario recibido correctamente',
    datos: {
      nombre,
      email,
      edad: edad || 'No especificada',
      registrado: new Date().toISOString()
    }
  });
});

// Ruta 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    rutas_disponibles: [
      '/',
      '/api/info',
      '/api/saludo/:nombre',
      '/api/calcular?num1=X&num2=Y&operacion=Z',
      'POST /api/usuario'
    ]
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});

// Exportar para Render
module.exports = app;
