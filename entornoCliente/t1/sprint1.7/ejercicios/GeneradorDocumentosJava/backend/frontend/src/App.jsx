import { useState, useEffect } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

export default function App() {
  const [code, setCode] = useState('public class A { }')
  const [path, setPath] = useState('')
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchHistory() }, [])

  async function analyzeCode() {
    setLoading(true)
    try {
      const r = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })
      const json = await r.json()
      setResult(json)
      fetchHistory()
    } catch (e) { setResult({ error: String(e) }) }
    setLoading(false)
  }

  async function analyzePath() {
    setLoading(true)
    try {
      const r = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path }) })
      const json = await r.json()
      setResult(json)
      fetchHistory()
    } catch (e) { setResult({ error: String(e) }) }
    setLoading(false)
  }

  async function uploadArchive() {
    if (!file) { setResult({ error: 'Selecciona un archivo zip primero' }); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('archive', file)
      const r = await fetch('/api/analyze', { method: 'POST', body: fd })
      const json = await r.json()
      setResult(json)
      fetchHistory()
    } catch (e) { setResult({ error: String(e) }) }
    setLoading(false)
  }

  const [previewMd, setPreviewMd] = useState('')

  async function fetchMarkdown(id) {
    try {
      const r = await fetch(`/api/docs/${id}/download/markdown`)
      if (!r.ok) return setPreviewMd(`Could not fetch markdown: ${r.status}`)
      const text = await r.text()
      setPreviewMd(text)
    } catch (e) { setPreviewMd(`Error: ${String(e)}`) }
  }

  async function fetchHistory() {
    try {
      const r = await fetch('/api/history')
      const json = await r.json()
      setHistory(json)
    } catch (e) { console.warn(e) }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Generador Automático de Documentación Java</h1>
          <p className="text-sm text-gray-600">Analiza proyectos Java, genera Markdown, UML y PDF.</p>
        </header>

        <section className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="font-semibold mb-2">Analizar código (demo)</h2>
          <textarea className="w-full p-2 border rounded mb-3" rows={6} value={code} onChange={(e)=>setCode(e.target.value)} />
          <div className="flex gap-2 mb-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={analyzeCode} disabled={loading}>Analizar</button>
            <input className="flex-1 p-2 border rounded" placeholder="Ruta del proyecto (opcional)" value={path} onChange={(e)=>setPath(e.target.value)} />
            <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={analyzePath} disabled={loading}>Analizar ruta</button>
          </div>

          <h3 className="font-semibold mb-2">Subir ZIP del proyecto</h3>
          <div className="flex gap-2 items-center">
            <input type="file" accept=".zip" onChange={(e)=>setFile(e.target.files && e.target.files[0])} />
            <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={uploadArchive} disabled={loading}>Subir y analizar</button>
            {file && <div className="text-sm text-gray-600">{file.name}</div>}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <section className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="font-semibold mb-2">Resultado</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-800 p-2 bg-slate-50 rounded">{result ? JSON.stringify(result, null, 2) : 'Sin resultados aún'}</pre>
              {result && result.id && (
                <div className="mt-3">
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded mr-2" onClick={()=>fetchMarkdown(result.id)}>Cargar vista previa Markdown</button>
                  <a className="px-3 py-1 bg-emerald-600 text-white rounded" href={`/api/docs/${result.id}/download/pdf`} target="_blank" rel="noreferrer">Descargar PDF</a>
                </div>
              )}
              {previewMd && (
                <section className="mt-4 bg-white p-4 rounded shadow">
                  <h4 className="font-semibold mb-2">Previsualización Markdown</h4>
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(previewMd)) }} />
                </section>
              )}
            </section>
          </div>

          <aside>
            <section className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="font-semibold">Historial</h3>
              <ul className="mt-3 space-y-2">
                {history.length===0 && <li className="text-sm text-gray-500">No hay ejecuciones</li>}
                {history.map(h => (
                  <li key={h.id} className="border p-2 rounded">
                    <div className="text-sm font-mono">{h.id}</div>
                    <div className="text-xs text-gray-500">{h.timestamp}</div>
                    <div className="mt-2 links">
                      {h.outputs && Object.entries(h.outputs).map(([k,v])=> (
                        <a className="text-blue-600 text-sm mr-2" key={k} href={`/api/docs/${h.id}/download/${k}`} target="_blank" rel="noreferrer">{k}</a>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
