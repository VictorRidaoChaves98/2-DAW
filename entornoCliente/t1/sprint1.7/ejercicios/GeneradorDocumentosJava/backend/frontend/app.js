async function analyzeCode(code) {
  const resp = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  return resp.json();
}

async function analyzePath(path) {
  const resp = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  });
  return resp.json();
}

async function refreshHistory() {
  const resp = await fetch('/api/history');
  const data = await resp.json();
  const ul = document.getElementById('historyList');
  ul.innerHTML = '';
  for (const e of data) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${e.id}</strong> <div class="meta">${e.timestamp}</div>`;
    const links = document.createElement('div');
    if (e.outputs) {
      for (const t of ['markdown','pdf','uml']) {
        if (e.outputs[t]) {
          const a = document.createElement('a');
          a.href = `/api/docs/${e.id}/download/${t}`;
          a.textContent = ` descargar ${t}`;
          a.style.marginRight = '8px';
          links.appendChild(a);
        }
      }
    }
    li.appendChild(links);
    ul.appendChild(li);
  }
}

window.addEventListener('load', () => {
  const btn = document.getElementById('btnAnalyze');
  const btnPath = document.getElementById('btnAnalyzePath');
  const area = document.getElementById('codeInput');
  const pathInput = document.getElementById('pathInput');
  const result = document.getElementById('result');
  const refresh = document.getElementById('btnRefresh');

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    result.textContent = 'Analizando...';
    try {
      const r = await analyzeCode(area.value);
      result.textContent = JSON.stringify(r, null, 2);
    } catch (e) {
      result.textContent = 'Error: ' + e;
    } finally { btn.disabled = false }
  });

  btnPath.addEventListener('click', async () => {
    btnPath.disabled = true;
    result.textContent = 'Analizando ruta...';
    try {
      const r = await analyzePath(pathInput.value);
      result.textContent = JSON.stringify(r, null, 2);
    } catch (e) {
      result.textContent = 'Error: ' + e;
    } finally { btnPath.disabled = false }
  });

  refresh.addEventListener('click', () => refreshHistory());
  refreshHistory();
});
