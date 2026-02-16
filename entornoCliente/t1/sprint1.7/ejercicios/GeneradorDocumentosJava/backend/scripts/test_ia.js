const { callAI } = require('../src/services/ia.service');

async function run() {
  console.log('Probing LMStudio from backend context...');
  const res = await callAI('Di en una frase: Hola desde LMStudio (prueba)');
  console.log('Result:', res && res.text ? res.text : JSON.stringify(res));
}

run().catch(e=>{ console.error('Test failed:', e); process.exit(1) });
