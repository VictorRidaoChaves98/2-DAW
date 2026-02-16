// Demo runner for analysis (uses backend modules directly)
process.env.USE_IA = 'true';
process.env.LMSTUDIO_URL = process.env.LMSTUDIO_URL || 'http://127.0.0.1:1234';
process.env.LMSTUDIO_API_PATH = process.env.LMSTUDIO_API_PATH || '/api/generate';
process.env.LMSTUDIO_MODEL = process.env.LMSTUDIO_MODEL || 'qwen/qwen3-4b-2507';

const javaAnalyzer = require('../src/analyzers/javaAnalyzer');
const mdGen = require('../src/generators/markdown.generator');
const pdfGen = require('../src/generators/pdf.generator');
const umlGen = require('../src/generators/plantuml.generator');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const code = 'package demo;\npublic class A { public void m() {} }';
    console.log('Running analysis demo...');
    const analysis = await javaAnalyzer.analyze(code);
    console.log('Analysis result:', analysis);

    const mdPath = await mdGen.generate(analysis);
    const umlPath = await umlGen.generate(analysis);
    const pdfPath = await pdfGen.generate(analysis);

    console.log('\nGenerated files:');
    console.log('Markdown:', mdPath);
    console.log('UML:', umlPath);
    console.log('PDF:', pdfPath);

    console.log('\nMarkdown content:\n');
    console.log(fs.readFileSync(mdPath, 'utf8'));
  } catch (err) {
    console.error('Error during demo:', err);
    process.exit(1);
  }
}

main();
