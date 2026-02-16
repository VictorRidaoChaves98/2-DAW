const fs = require('fs');
const path = require('path');
const markdownGen = require('../generators/markdown.generator');
const pdfGen = require('../generators/pdf.generator');
const umlGen = require('../generators/plantuml.generator');

async function generateMarkdown(req, res) {
  try {
    const { analysis } = req.body;
    const out = await markdownGen.generate(analysis);
    res.json({ path: out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not generate markdown' });
  }
}

async function generatePdf(req, res) {
  try {
    const { analysis } = req.body;
    const out = await pdfGen.generate(analysis);
    res.json({ path: out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not generate pdf' });
  }
}

async function generateUml(req, res) {
  try {
    const { analysis } = req.body;
    const out = await umlGen.generate(analysis);
    res.json({ path: out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not generate uml' });
  }
}

async function getById(req, res) {
  try {
    const id = req.params.id;
    const hist = path.join(__dirname, '..', 'data', 'history.json');
    const raw = fs.readFileSync(hist, 'utf8');
    const list = JSON.parse(raw || '[]');
    const entry = list.find((e) => e.id === id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not read history' });
  }
}

async function download(req, res) {
  try {
    const id = req.params.id;
    const type = req.params.type; // markdown | pdf | uml
    const hist = path.join(__dirname, '..', 'data', 'history.json');
    const raw = fs.readFileSync(hist, 'utf8');
    const list = JSON.parse(raw || '[]');
    const entry = list.find((e) => e.id === id);
    if (!entry) return res.status(404).json({ error: 'Not found' });

    const outputs = entry.outputs || {};
    const mapping = { markdown: 'markdown', pdf: 'pdf', uml: 'uml' };
    if (!mapping[type] || !outputs[type]) return res.status(400).json({ error: 'Invalid type or not available' });

    // Resolve and validate path to prevent path traversal
    // Resolve and validate path to prevent path traversal
    let filePath = path.resolve(outputs[type]);
    // outputs directory is two levels up from src/controllers -> /app/outputs
    const outputsRoot = path.resolve(__dirname, '..', '..', 'outputs');

    // If stored path looks like a Windows host path (from earlier runs), try to map into container mount
    if (!filePath.startsWith(outputsRoot)) {
      const norm = (outputs[type] || '').replace(/\\\\/g, '/').replace(/\\/g, '/');
      const idx = norm.toLowerCase().indexOf('backend/outputs');
      if (idx !== -1) {
        const suffix = norm.substring(idx + 'backend/outputs'.length);
        filePath = path.join('/app/outputs', suffix);
      }
    }

    if (!filePath.startsWith(outputsRoot)) return res.status(400).json({ error: 'Invalid file location' });
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

    // Set content type and force download disposition
    const contentTypes = { pdf: 'application/pdf', markdown: 'text/markdown; charset=utf-8', uml: 'text/plain; charset=utf-8' };
    const ct = contentTypes[type] || 'application/octet-stream';
    res.setHeader('Content-Type', ct);
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);

    // Stream file
    res.sendFile(filePath, function (err) {
      if (err) {
        console.error('sendFile error', err);
        if (!res.headersSent) res.status(500).json({ error: 'Could not download file' });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not download file' });
  }
}

module.exports = { generateMarkdown, generatePdf, generateUml, getById, download };
