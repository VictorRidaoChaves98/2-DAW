const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const zip = new AdmZip();
zip.addFile('src/Main.java', Buffer.from('package demo;\npublic class Main { public static void main(String[] a){ System.out.println("Hello"); } }'));
const outDir = path.join(__dirname, '..', 'temp');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'test_project.zip');
zip.writeZip(outPath);
console.log('Wrote test zip to', outPath);
