const fs = require('fs');
const path = require('path');
const marked = require('marked');
const puppeteer = require('puppeteer');

async function markdownToHtml(md) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px}</style></head><body>${marked.parse(md)}</body></html>`;
}

async function generate(analysis) {
  const outDir = path.join(__dirname, '..', '..', 'outputs', 'pdf');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const mdFile = path.join(__dirname, '..', '..', 'outputs', 'markdown', `analysis_${Date.now()}.md`);
  const pdfFile = path.join(outDir, `analysis_${Date.now()}.pdf`);

  const markdownContent = `# Analysis\n\n">${JSON.stringify(analysis, null, 2)}\n`;
  // ensure markdown output exists
  try { fs.writeFileSync(mdFile, markdownContent, 'utf8'); } catch(e) { /* ignore */ }

  const html = await markdownToHtml(markdownContent);

  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({ path: pdfFile, format: 'A4', printBackground: true });
  } finally {
    await browser.close();
  }

  return pdfFile;
}

module.exports = { generate };
