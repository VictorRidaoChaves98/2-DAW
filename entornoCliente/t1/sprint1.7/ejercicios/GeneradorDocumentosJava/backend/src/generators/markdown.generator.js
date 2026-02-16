const fs = require('fs');
const path = require('path');
const iaService = require('../services/ia.service');

async function generate(analysis) {
  const outDir = path.join(__dirname, '..', '..', 'outputs', 'markdown');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const filename = `analysis_${Date.now()}.md`;
  const full = path.join(outDir, filename);

  // Base content
  let content = `# Analysis\n\n`;
  content += `**Summary:** ${analysis.summary || ''}\n\n`;
  content += `**Files:** ${analysis.files || 0}  \n`;
  content += `**Packages:** ${Array.isArray(analysis.packages) ? analysis.packages.join(', ') : ''}  \n`;
  content += `**Classes:** ${analysis.classes || 0}  \n\n`;

  // Class details
  if (analysis.classDetails && Array.isArray(analysis.classDetails)) {
    content += `## Class Details\n\n`;
    for (const c of analysis.classDetails) {
      content += `- **${c.class}** (${c.type || 'class'}) — ${path.basename(c.file)}\n`;
      if (c.fields && c.fields.length) {
        content += `  - Fields:\n`;
        for (const f of c.fields) content += `    - ${f.name}\n`;
      }
      if (c.methods && c.methods.length) {
        content += `  - Methods:\n`;
        for (const m of c.methods) content += `    - ${m.name}(${m.params || ''})\n`;
      }
      content += `\n`;
    }
    content += `\n`;
  }

  // Optionally enrich with IA if enabled
  const useIA = process.env.USE_IA === 'true';
  if (useIA) {
    try {
      const prompt = `Genera una descripción técnica detallada a partir del siguiente análisis de proyecto Java:\n\n${JSON.stringify(analysis, null, 2)}\n\nIncluye: propósito general, módulos principales, recomendaciones y un breve resumen técnico.`;
      const resp = await iaService.callAI(prompt, { model: 'qwen3' });
      const text = (resp && (resp.text || resp.output || resp.result)) || '';
      content += `## Descripción enriquecida (IA)\n\n${text}\n\n`;
    } catch (err) {
      content += `\n> Nota: no se pudo enriquecer con IA (${String(err)})\n`;
    }
  }

  // Final JSON dump for reference
  content += `---\n\n\n## Raw Analysis\n\n`;
  content += '```json\n' + JSON.stringify(analysis, null, 2) + '\n```\n';

  fs.writeFileSync(full, content, 'utf8');
  return full;
}

module.exports = { generate };
