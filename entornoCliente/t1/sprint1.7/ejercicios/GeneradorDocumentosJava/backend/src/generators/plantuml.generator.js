const fs = require('fs');
const path = require('path');

function escapeName(n) { return n.replace(/[^\w]/g, '_'); }

async function generate(analysis) {
  const outDir = path.join(__dirname, '..', '..', 'outputs', 'uml');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const filename = `diagram_${Date.now()}.puml`;
  const full = path.join(outDir, filename);

  let lines = ['@startuml', "' Generated PlantUML diagram"];

  // Group by package
  const byPkg = {};
  for (const c of (analysis.classDetails || [])) {
    const pkg = c.package || (analysis.packages && analysis.packages[0]) || 'default';
    if (!byPkg[pkg]) byPkg[pkg] = [];
    byPkg[pkg].push(c);
  }

  for (const pkg of Object.keys(byPkg)) {
    lines.push(`package ${pkg} {`);
    for (const c of byPkg[pkg]) {
      const type = (c.type || 'class');
      const name = c.class || escapeName(path.basename(c.file || 'Unknown'));
      lines.push(`${type} ${name} {`);
      // fields
      if (c.fields && c.fields.length) {
        for (const f of c.fields) lines.push(`  + ${f.name}`);
      }
      // methods (just names)
      if (c.methods && c.methods.length) {
        for (const m of c.methods) lines.push(`  + ${m.name}(${m.params||''})`);
      }
      lines.push('}');
    }
    lines.push('}');
  }

  // Relations
  for (const c of (analysis.classDetails || [])) {
    const name = c.class;
    if (c.extends && c.extends.length) {
      for (const p of c.extends) lines.push(`${p} <|-- ${name}`);
    }
    if (c.implements && c.implements.length) {
      for (const i of c.implements) lines.push(`${i} <|.. ${name}`);
    }
  }

  lines.push('@enduml');
  const content = lines.join('\n');
  fs.writeFileSync(full, content, 'utf8');
  return full;
}

module.exports = { generate };
