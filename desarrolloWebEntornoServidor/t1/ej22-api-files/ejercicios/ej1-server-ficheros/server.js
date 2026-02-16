// server.js
const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Carpeta donde guardamos los ficheros
const FILES_DIR = path.join(__dirname, 'files');
// Asegurarse de que existe
if (!fs.existsSync(FILES_DIR)) fs.mkdirSync(FILES_DIR, { recursive: true });

// Configuración de multer: guardamos en 'files/' con nombre original
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, FILES_DIR),
  filename: (req, file, cb) => {
    // para evitar sobreescrituras puedes añadir timestamp si quieres:
    // const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, file.originalname);
  }
});

// Opciones: límite de tamaño (por ejemplo 50MB por fichero)
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    // Ejemplo: aceptar todos. Si quieres limitar extensiones, descomenta abajo:
    // const allowed = ['.note', '.txt', '.pdf', '.jpg', '.png'];
    // const ext = path.extname(file.originalname).toLowerCase();
    // if (!allowed.includes(ext)) return cb(new Error('Tipo de fichero no permitido'));
    cb(null, true);
  }
});

// Ruta estática para servir formulario de prueba (opcional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * Subida - admite varios ficheros con campo 'files'
 * Para subir un único fichero usa upload.single('file') y el campo HTML 'file'
 */
app.post('/upload', upload.array('files'), (req, res) => {
  // req.files -> array de ficheros
  res.json({
    message: 'Ficheros subidos correctamente',
    files: req.files.map(f => ({ originalname: f.originalname, size: f.size }))
  });
});

// Listar ficheros en la carpeta
app.get('/files', (req, res) => {
  fs.readdir(FILES_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: 'No se pudieron listar archivos' });
    // devolver nombre, tamaño y fecha modificación
    const details = files.map(name => {
      const full = path.join(FILES_DIR, name);
      const stat = fs.statSync(full);
      return { name, size: stat.size, mtime: stat.mtime };
    });
    res.json(details);
  });
});

// Descargar un fichero concreto (por nombre)
app.get('/download/:name', (req, res) => {
  const fileName = req.params.name;
  const safePath = path.normalize(fileName).replace(/^(\.\.(\/|\\|$))+/, '');
  const fullPath = path.join(FILES_DIR, safePath);
  if (!fs.existsSync(fullPath)) return res.status(404).json({ error: 'Fichero no encontrado' });

  // Forzar descarga:
  res.download(fullPath, fileName, err => {
    if (err) {
      console.error(err);
      if (!res.headersSent) res.status(500).json({ error: 'Error al descargar' });
    }
  });
});

// Borrar un fichero (opcional)
app.delete('/files/:name', (req, res) => {
  const fileName = req.params.name;
  const safePath = path.normalize(fileName).replace(/^(\.\.(\/|\\|$))+/, '');
  const fullPath = path.join(FILES_DIR, safePath);
  if (!fs.existsSync(fullPath)) return res.status(404).json({ error: 'Fichero no encontrado' });

  fs.unlink(fullPath, err => {
    if (err) return res.status(500).json({ error: 'No se pudo borrar' });
    res.json({ message: 'Fichero borrado' });
  });
});

// Aumentar timeout si subes ficheros muy grandes (opcional)
const server = app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});

// Si necesitas aumentar timeout (ms):
server.setTimeout(10 * 60 * 1000); // 10 minutos
