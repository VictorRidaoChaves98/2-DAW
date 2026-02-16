const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function saveFile(dir, filename, content) {
  ensureDir(dir);
  const full = path.join(dir, filename);
  fs.writeFileSync(full, content, 'utf8');
  return full;
}

module.exports = { ensureDir, saveFile };
