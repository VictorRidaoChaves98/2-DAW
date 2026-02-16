import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

const base = 'http://localhost:3000';
const sample = 'sample_e2e.pdf';

async function run(){
  // create sample file
  fs.writeFileSync(sample, 'Contenido de prueba PDF para e2e');
  console.log('Created', sample, fs.statSync(sample).size, 'bytes');

  // get token
  const loginRes = await fetch(base + '/api/auth/token', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'victor', password: '123456' })
  });
  if (!loginRes.ok){ console.error('Auth failed', loginRes.status); process.exit(2); }
  const token = (await loginRes.text()).trim();
  console.log('Token len', token.length);

  // upload
  const fd = new FormData();
  fd.append('files', fs.createReadStream(sample));
  const up = await fetch(base + '/api/files/upload', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: fd });
  console.log('Upload status', up.status);
  const upj = await up.text();
  console.log('Upload response', upj);

  // list
  const listRes = await fetch(base + '/api/files', { headers: { Authorization: 'Bearer ' + token } });
  console.log('List status', listRes.status);
  const list = await listRes.json();
  console.log('Files:', list.map(f=>f.name));

  // download
  const dl = await fetch(base + '/api/files/download/' + encodeURIComponent(sample), { headers: { Authorization: 'Bearer ' + token } });
  if (!dl.ok){ console.error('Download failed', dl.status); process.exit(3); }
  const buffer = await dl.arrayBuffer();
  fs.writeFileSync('downloaded_' + sample, Buffer.from(buffer));
  console.log('Downloaded size', fs.statSync('downloaded_' + sample).size);

  // compare sizes
  const orig = fs.statSync(sample).size;
  const down = fs.statSync('downloaded_' + sample).size;
  console.log('Compare sizes orig=%d downloaded=%d', orig, down);

  // delete
  const del = await fetch(base + '/api/files/' + encodeURIComponent(sample), { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } });
  console.log('Delete status', del.status);

  const list2 = await (await fetch(base + '/api/files', { headers: { Authorization: 'Bearer ' + token } })).json();
  console.log('Files after delete:', list2.map(f=>f.name));
  process.exit(0);
}

run().catch(err=>{ console.error(err); process.exit(1); });
