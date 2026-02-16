import fs from 'fs';
import path from 'path';

const FILES_DIR = path.join(process.cwd(), 'files');

function ensureDir(){
  try {
    if (!fs.existsSync(FILES_DIR)) fs.mkdirSync(FILES_DIR, { recursive: true });
  } catch (e) {
    // ignore directory creation errors (e.g., during tests or permissions)
  }
}

export function listFiles(req, res){
  try{
    ensureDir();
    // Recursively list files and return relative paths
    const walk = (dir, base) => {
      const items = [];
      for (const entry of fs.readdirSync(dir)) {
        const full = path.join(dir, entry);
        const rel = path.join(base, entry);
        const stat = fs.statSync(full);
        const isDir = typeof stat.isDirectory === 'function' ? stat.isDirectory() : false;
        if (isDir) {
          items.push(...walk(full, rel));
        } else {
          items.push({ name: rel.replace(/\\/g, '/'), size: stat.size, mtime: stat.mtime });
        }
      }
      return items;
    };

    const details = walk(FILES_DIR, '');
    res.json(details);
  }catch(err){
    console.error('listFiles error', err);
    res.status(500).json({ error: 'No se pudieron listar archivos' });
  }
}

export function uploadFiles(req, res){
  try{
    const files = req.files || [];
    const result = files.map(f => ({ originalname: f.originalname, size: f.size }));
    res.status(201).json({ message: 'Ficheros subidos correctamente', files: result });
  }catch(err){
    console.error('uploadFiles error', err);
    res.status(500).json({ error: 'Error al subir ficheros' });
  }
}

export function downloadFile(req, res){
  try{
    ensureDir();
    // Accept name via query or params for compatibility
    const raw = (req.query && req.query.name) || req.params[0] || req.params.name || req.params.path || '';
    const name = decodeURIComponent(raw);
    // Prevent path traversal: resolve and ensure it is inside FILES_DIR
    const full = path.resolve(FILES_DIR, name);
    const rel = path.relative(path.resolve(FILES_DIR), full);
    if (!rel || rel.startsWith('..') || rel.includes('..' + path.sep)) return res.status(400).json({ error: 'Ruta inválida' });
    if (!fs.existsSync(full)) return res.status(404).json({ error: 'Fichero no encontrado' });
    // avoid throwing if fs.statSync is not mocked in tests
    let isDir = false;
    try { const st = fs.statSync(full); isDir = typeof st.isDirectory === 'function' ? st.isDirectory() : false; } catch (e) { isDir = false; }
    if (isDir) return res.status(404).json({ error: 'Fichero no encontrado' });
    const downloadName = path.basename(full);
    return res.download(full, downloadName, err => {
      if (err) console.error('download error', err);
    });
  }catch(err){
    console.error('downloadFile error', err);
    res.status(500).json({ error: 'Error descargando fichero' });
  }
}

export function deleteFile(req, res){
  try{
    ensureDir();
    // Accept names that may include subfolders (e.g., "note/hola.note")
    const raw = decodeURIComponent((req.query && req.query.name) || req.params[0] || req.params.name || req.params.path || '');
    const full = path.resolve(FILES_DIR, raw);
    // Prevent path traversal
    const rel = path.relative(path.resolve(FILES_DIR), full);
    if (!rel || rel.startsWith('..') || rel.includes('..' + path.sep)) return res.status(400).json({ error: 'Ruta inválida' });
    if (!fs.existsSync(full)) return res.status(404).json({ error: 'Fichero no encontrado' });
    // avoid deleting directories
    try { const st = fs.statSync(full); if (typeof st.isDirectory === 'function' && st.isDirectory()) return res.status(400).json({ error: 'Ruta inválida' }); } catch (e) {}
    fs.unlinkSync(full);
    res.json({ message: 'Fichero borrado' });
  }catch(err){
    console.error('deleteFile error', err);
    res.status(500).json({ error: 'Error borrando fichero' });
  }
}

export function viewFile(req, res){
  try{
    ensureDir();
    const raw = (req.query && req.query.name) || '';
    const name = decodeURIComponent(raw);
    const full = path.resolve(FILES_DIR, name);
    const rel = path.relative(path.resolve(FILES_DIR), full);
    if (!rel || rel.startsWith('..') || rel.includes('..' + path.sep)) return res.status(400).json({ error: 'Ruta inválida' });
    if (!fs.existsSync(full)) return res.status(404).json({ error: 'Fichero no encontrado' });
    let isDir = false;
    try { const st = fs.statSync(full); isDir = typeof st.isDirectory === 'function' ? st.isDirectory() : false; } catch (e) { isDir = false; }
    if (isDir) return res.status(404).json({ error: 'Fichero no encontrado' });
    
    const content = fs.readFileSync(full, 'utf-8');
    res.json({ name: name, content: content });
  }catch(err){
    console.error('viewFile error', err);
    res.status(500).json({ error: 'Error leyendo fichero' });
  }
}

export function updateFile(req, res){
  try{
    ensureDir();
    const raw = (req.query && req.query.name) || (req.body && req.body.name) || '';
    const name = decodeURIComponent(raw);
    const newContent = req.body && req.body.content;
    
    if (!newContent && newContent !== '') return res.status(400).json({ error: 'Contenido requerido' });
    
    const full = path.resolve(FILES_DIR, name);
    const rel = path.relative(path.resolve(FILES_DIR), full);
    if (!rel || rel.startsWith('..') || rel.includes('..' + path.sep)) return res.status(400).json({ error: 'Ruta inválida' });
    if (!fs.existsSync(full)) return res.status(404).json({ error: 'Fichero no encontrado' });
    
    let isDir = false;
    try { const st = fs.statSync(full); isDir = typeof st.isDirectory === 'function' ? st.isDirectory() : false; } catch (e) { isDir = false; }
    if (isDir) return res.status(400).json({ error: 'Ruta inválida' });
    
    fs.writeFileSync(full, newContent, 'utf-8');
    res.json({ message: 'Fichero actualizado correctamente' });
  }catch(err){
    console.error('updateFile error', err);
    res.status(500).json({ error: 'Error actualizando fichero' });
  }
}
