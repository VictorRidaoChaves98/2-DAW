import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tareas, setTareas] = useState([])
  const [tituloText, setTituloText] = useState('')
  const [descripcionText, setDescripcionText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // URL de la API
  const API_URL = 'https://api-tarea-despliegue.onrender.com'

  // Obtener todas las tareas al cargar el componente
  useEffect(() => {
    obtenerTareas()
  }, [])

  // GET - Obtener todas las tareas
  const obtenerTareas = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/tareas`)
      const data = await response.json()
      
      if (data.success) {
        setTareas(data.data)
      } else {
        setError('Error al obtener las tareas')
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // POST - Añadir una nueva tarea
  const addTarea = async () => {
    if (tituloText.trim() === '' || descripcionText.trim() === '') {
      setError('El título y la descripción son obligatorios')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`${API_URL}/tareas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: tituloText,
          descripcion: descripcionText
        })
      })

      const data = await response.json()

      if (data.success) {
        setTareas([...tareas, data.data])
        setTituloText('')
        setDescripcionText('')
        setSuccess('Tarea creada correctamente')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.mensaje || 'Error al crear la tarea')
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // DELETE - Eliminar una tarea
  const deleteTarea = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/tareas/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setTareas(tareas.filter(tarea => tarea.id !== id))
        setSuccess('Tarea eliminada correctamente')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.mensaje || 'Error al eliminar la tarea')
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Recargar tareas
  const recargarTareas = () => {
    obtenerTareas()
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Gestor de Tareas</h1>
        <p>Conectado a API REST con MongoDB</p>
      </header>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {success && (
        <div className="success-message">
          <p>✅ {success}</p>
        </div>
      )}

      <div className="task-input">
        <input
          type="text"
          placeholder="Título de la tarea..."
          value={tituloText}
          onChange={(e) => setTituloText(e.target.value)}
          disabled={loading}
        />
        <textarea
          placeholder="Descripción de la tarea..."
          value={descripcionText}
          onChange={(e) => setDescripcionText(e.target.value)}
          rows="3"
          disabled={loading}
        />
        <div className="button-group">
          <button 
            onClick={addTarea} 
            className="btn-add"
            disabled={loading}
          >
            {loading ? 'Guardando...' : '➕ Añadir Tarea'}
          </button>
          <button 
            onClick={recargarTareas} 
            className="btn-refresh"
            disabled={loading}
          >
            🔄 Recargar
          </button>
        </div>
      </div>

      <div className="tasks-container">
        <h2>Tareas ({tareas.length})</h2>
        {loading && <p className="loading-message">⏳ Cargando...</p>}
        {!loading && tareas.length === 0 ? (
          <p className="empty-message">No hay tareas aún. ¡Crea la primera!</p>
        ) : (
          <div className="tasks-list">
            {tareas.map((tarea) => (
              <div key={tarea.id} className="task-card">
                <div className="task-content">
                  <h3 className="task-title">{tarea.titulo}</h3>
                  <p className="task-description">{tarea.descripcion}</p>
                </div>
                <div className="task-footer">
                  <button
                    onClick={() => deleteTarea(tarea.id)}
                    className="btn-delete"
                    disabled={loading}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Desarrollado para la asignatura de Despliegue - 2 DAW</p>
        <p>Conectado a: <strong>{API_URL}</strong></p>
      </footer>
    </div>
  )
}

export default App
