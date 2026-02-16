// Enhanced Java analyzer: extracts packages, classes, interfaces, enums, fields and methods (best-effort via regex)
const fs = require('fs');
const path = require('path');

function readAllJavaFiles(dir) {
  const results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...readAllJavaFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.java')) {
      results.push(full);
    }
  }
  return results;
}

function parseClassFile(content, filePath) {
  const pkgMatch = content.match(/package\s+([\w\.]+)\s*;/);
  const pkg = pkgMatch ? pkgMatch[1] : null;

  // Find class/interface/enum declarations with optional modifiers, extends/implements
  const typeRegex = /((?:public|protected|private|static|abstract|final)\s+)*\s*(class|interface|enum)\s+(\w+)(?:\s+extends\s+([\w\.<>,\s]+))?(?:\s+implements\s+([\w\.<>,\s]+))?/g;
  const types = [];
  for (const m of content.matchAll(typeRegex)) {
    const mods = (m[1] || '').trim().split(/\s+/).filter(Boolean);
    const decl = {
      type: m[2],
      name: m[3],
      modifiers: mods,
      extends: m[4] ? m[4].split(/,\s*/).map(s=>s.trim()) : [],
      implements: m[5] ? m[5].split(/,\s*/).map(s=>s.trim()) : []
    };
    types.push(decl);
  }

  // Methods: capture visibility, static, return type, name and params
  const methodRegex = /((?:public|protected|private)\s+)?(static\s+)?(?:final\s+)?([\w\<\>\[\]]+)\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
  const methods = [];
  for (const m of content.matchAll(methodRegex)) {
    methods.push({ visibility: (m[1]||'package').trim(), static: !!m[2], returnType: m[3], name: m[4], params: m[5].trim() });
  }

  // Fields: capture visibility and type
  const fieldRegex = /(?:\b(public|protected|private)\b\s*)?(?:static\s+)?(?:final\s+)?([\w\<\>\[\]]+)\s+(\w+)\s*(?:=|;)/g;
  const fields = [];
  for (const m of content.matchAll(fieldRegex)) {
    fields.push({ visibility: m[1] || 'package', type: m[2], name: m[3] });
  }

  // Calculate LOC (rough): non-empty, non-comment lines
  const withoutBlockComments = content.replace(/\/\*[\s\S]*?\*\//g, '');
  const lines = withoutBlockComments.split(/\r?\n/).filter(l => l.replace(/\/\/.*$/, '').trim() !== '');
  const loc = lines.length;

  return {
    file: filePath,
    package: pkg,
    types,
    methodsCount: methods.length,
    methods,
    fieldsCount: fields.length,
    fields,
    loc
  };
}

async function analyze(code) {
  // analyze a snippet of Java code
  const parsed = parseClassFile(code, '<snippet>');
  return {
    classes: parsed.types.length,
    methods: parsed.methodsCount,
    fields: parsed.fieldsCount,
    classDetails: parsed.types.map(t=>({ file: '<snippet>', class: t.name })),
    loc: parsed.loc,
    summary: `Found ${parsed.types.length} types, ${parsed.methodsCount} methods, ${parsed.fieldsCount} fields. LOC: ${parsed.loc}`
  };
}

async function analyzePath(dirPath) {
  const abs = path.isAbsolute(dirPath) ? dirPath : path.join(process.cwd(), dirPath);
  if (!fs.existsSync(abs)) throw new Error('Path not found: ' + abs);
  const files = readAllJavaFiles(abs);
  const packages = new Set();
  const allTypes = [];
  const classDetails = [];
  let totalMethods = 0;
  let totalFields = 0;
  let totalLoc = 0;

  for (const f of files) {
    const txt = fs.readFileSync(f, 'utf8');
    const parsed = parseClassFile(txt, f);
    if (parsed.package) packages.add(parsed.package);
    for (const t of parsed.types) {
      allTypes.push({ file: f, type: t.type, name: t.name, extends: t.extends, implements: t.implements });
      classDetails.push({ file: f, class: t.name, type: t.type, extends: t.extends, implements: t.implements, methods: parsed.methods, fields: parsed.fields });
    }
    totalMethods += parsed.methodsCount;
    totalFields += parsed.fieldsCount;
    totalLoc = (totalLoc || 0) + (parsed.loc || 0);
  }

  return {
    path: abs,
    files: files.length,
    packages: Array.from(packages),
    types: allTypes.length,
    classes: allTypes.filter(t=>t.type==='class').length,
    interfaces: allTypes.filter(t=>t.type==='interface').length,
    enums: allTypes.filter(t=>t.type==='enum').length,
    methods: totalMethods,
    fields: totalFields,
    loc: totalLoc || 0,
    classDetails,
    summary: `Found ${files.length} .java files, ${allTypes.length} types (${[ 'classes:'+ (allTypes.filter(t=>t.type==='class').length), 'interfaces:'+ (allTypes.filter(t=>t.type==='interface').length), 'enums:'+ (allTypes.filter(t=>t.type==='enum').length) ].join(', ')}), ${totalMethods} methods. LOC: ${totalLoc || 0}`
  };
}

module.exports = { analyze, analyzePath };
