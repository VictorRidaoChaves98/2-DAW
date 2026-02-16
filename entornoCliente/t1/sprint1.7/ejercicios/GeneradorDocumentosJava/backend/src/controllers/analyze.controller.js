const javaAnalyzer = require('../analyzers/javaAnalyzer');
const markdownGen = require('../generators/markdown.generator');
const pdfGen = require('../generators/pdf.generator');
const umlGen = require('../generators/plantuml.generator');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const AdmZip = require('adm-zip');

const historyFile = path.join(__dirname, '..', 'data', 'history.json');

function loadHistory() {
  try {
    const raw = fs.readFileSync(historyFile, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function saveHistory(list) {
  fs.writeFileSync(historyFile, JSON.stringify(list, null, 2), 'utf8');
}

async function demo(req, res) {
  res.json({ demo: true, message: 'Enviar POST con { code } o { path } para análisis.' });
}

async function analyze(req, res) {
  try {
    const { code, path: dirPath } = req.body;
    let analysis;

    // If a file was uploaded via multer (memoryStorage), it will be in req.file
    if (req.file && req.file.buffer) {
      // Basic ZIP safety checks: limit number of entries
      const zipProbe = new AdmZip(req.file.buffer);
      const entries = zipProbe.getEntries() || [];
      if (entries.length > 2000) return res.status(400).json({ error: 'Archive has too many entries' });

      // extract zip to temp dir
      const id = `${Date.now()}-${Math.floor(Math.random()*10000)}`;
      const tmpDir = path.join(__dirname, '..', 'temp', id);
      await fsExtra.ensureDir(tmpDir);
      try {
        zipProbe.extractAllTo(tmpDir, true);
        analysis = await javaAnalyzer.analyzePath(tmpDir);
      } finally {
        // cleanup temp dir
        try { await fsExtra.remove(tmpDir); } catch (e) { console.warn('Failed to remove temp', tmpDir, e); }
      }
    } else if (dirPath) {
      // Basic path validation: reject suspicious paths
      if (typeof dirPath !== 'string' || dirPath.includes('..')) return res.status(400).json({ error: 'Invalid path' });
      const absPath = path.isAbsolute(dirPath) ? dirPath : path.join(process.cwd(), dirPath);
      if (!fs.existsSync(absPath)) return res.status(400).json({ error: 'Path not found' });
      analysis = await javaAnalyzer.analyzePath(absPath);
    } else if (code) {
      analysis = await javaAnalyzer.analyze(code);
    } else {
      return res.status(400).json({ error: 'Provide `code`, `path` or upload `archive` (zip) in request' });
    }

    // Generate outputs
    const mdPath = await markdownGen.generate(analysis);
    const umlPath = await umlGen.generate(analysis);
    const pdfPath = await pdfGen.generate(analysis);

    // Save to history
    const id = `${Date.now()}-${Math.floor(Math.random()*10000)}`;
    const entry = {
      id,
      timestamp: new Date().toISOString(),
      analysis,
      outputs: { markdown: mdPath, uml: umlPath, pdf: pdfPath }
    };
    const list = loadHistory();
    list.unshift(entry);
    saveHistory(list);

    res.json({ id, analysis, outputs: entry.outputs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error', details: String(err) });
  }
}

module.exports = { analyze, demo };
