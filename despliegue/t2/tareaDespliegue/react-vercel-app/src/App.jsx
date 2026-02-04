import { useState, useEffect } from 'react'
import './App.css'

// Datos de audiodiarios
const audiodiarios = {
  'Bioshock 1': [
    { id: 1, nombre: 'Welcome to Rapture', numero: 1, descripcion: 'Andrew Ryan da la bienvenida a los nuevos ciudadanos a Rapture, su ciudad bajo el agua.' },
    { id: 2, nombre: 'The Tonic of Life', numero: 2, descripcion: 'Sofia Lamb habla sobre las promesas de ADAM y su efecto en la sociedad de Rapture.' },
    { id: 3, nombre: 'Rapture Harvest', numero: 3, descripcion: 'Atlas reflexiona sobre el destino de Rapture y sus ciudadanos.' },
    { id: 4, nombre: 'The Little Ones', numero: 4, descripcion: 'Un diario sobre las Little Sisters y su importancia en la economía de ADAM de Rapture.' },
    { id: 5, nombre: 'Artists and Dreamers', numero: 5, descripcion: 'Sander Cohen detalla su visión artística y los cambios en Rapture.' }
  ],
  'Bioshock 2': [
    { id: 6, nombre: 'Subject Delta Returns', numero: 1, descripcion: 'Subject Delta despierta 8 años después en una Rapture devastada.' },
    { id: 7, nombre: 'The Rapture Family', numero: 2, descripcion: 'Eleanor reflexiona sobre su relación con Subject Delta y su madre.' },
    { id: 8, nombre: 'Lamb\'s Cause', numero: 3, descripcion: 'Sofia Lamb continúa su plan para Eleanor como la próxima líder de Rapture.' },
    { id: 9, nombre: 'The Rumbler', numero: 4, descripcion: 'Un Big Daddy cuenta su experiencia protegiendo a su Little Sister.' },
    { id: 10, nombre: 'Reunion', numero: 5, descripcion: 'Subject Delta y Eleanor se reúnen en medio del caos de Rapture.' }
  ],
  'Bioshock Infinite': [
    { id: 11, nombre: 'Welcome to Columbia', numero: 1, descripcion: 'Comstock da la bienvenida a los nuevos residentes a su ciudad flotante en el cielo.' },
    { id: 12, nombre: 'The Songbird', numero: 2, descripcion: 'Elizabeth cuenta sobre su relación con el Songbird, su guardián.' },
    { id: 13, nombre: 'A New Frontier', numero: 3, descripcion: 'Los ideales fundadores de Columbia se ven cuestionados por la realidad.' },
    { id: 14, nombre: 'Infinite Possibilities', numero: 4, descripcion: 'Lutece reflexiona sobre los múltiples universos y realidades paralelas.' },
    { id: 15, nombre: 'The Choice', numero: 5, descripcion: 'Los últimos secretos de Columbia y su verdadero propósito se revelan.' }
  ]
}

const imagenes = {
  'Bioshock 1': '/images/bioshock1.jpg',
  'Bioshock 2': '/images/bioshock2.jpg',
  'Bioshock Infinite': '/images/bioshock-infinite.jpg'
}

function App() {
  const [juego, setJuego] = useState('Bioshock 1')
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [vistaActual, setVistaActual] = useState('audiodiarios')

  const API_URL = 'https://api-tarea-despliegue-vercel-render.onrender.com'

  useEffect(() => {
    obtenerFavoritos()
  }, [])

  const obtenerFavoritos = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/favoritos`)
      const data = await response.json()
      
      if (data.success) {
        setFavoritos(data.data)
      } else {
        setError('Error al obtener favoritos')
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addFavorito = async (audiodiario) => {
    if (favoritos.some(f => f.id === audiodiario.id)) {
      setError('Este audiodiario ya está en favoritos')
      setTimeout(() => setError(null), 3000)
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`${API_URL}/favoritos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          juego: juego,
          nombre: audiodiario.nombre,
          numero: audiodiario.numero,
          descripcion: audiodiario.descripcion
        })
      })

      const data = await response.json()

      if (data.success) {
        setFavoritos([...favoritos, data.data])
        setSuccess('✨ Audiodiario añadido a favoritos')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.mensaje || 'Error al añadir a favoritos')
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteFavorito = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/favoritos/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setFavoritos(favoritos.filter(f => f.id !== id))
        setSuccess('🗑️ Audiodiario eliminado de favoritos')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.mensaje || 'Error al eliminar')
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const audiodiarioActuales = audiodiarios[juego]
  const favoritosJuegoActual = favoritos.filter(f => f.juego === juego)

  return (
    <div className="app-container">
      <div className="contenido">
        <header className="header">
          <h1 className="titulo">🎙️ AUDIODIARIOS BIOSHOCK 🎙️</h1>
          <p className="subtitulo">Colecciona los secretos de Rapture y Columbia</p>
        </header>

        {error && <div className="mensaje error">❌ {error}</div>}
        {success && <div className="mensaje success">{success}</div>}

        <div className="selector-juegos">
          <button
            className={`boton-juego ${juego === 'Bioshock 1' ? 'activo' : ''}`}
            onClick={() => setJuego('Bioshock 1')}
          >
            BIOSHOCK 1
          </button>
          <button
            className={`boton-juego ${juego === 'Bioshock 2' ? 'activo' : ''}`}
            onClick={() => setJuego('Bioshock 2')}
          >
            BIOSHOCK 2
          </button>
          <button
            className={`boton-juego ${juego === 'Bioshock Infinite' ? 'activo' : ''}`}
            onClick={() => setJuego('Bioshock Infinite')}
          >
            BIOSHOCK INFINITE
          </button>
        </div>

        <div className="selector-vista">
          <button
            className={`boton-vista ${vistaActual === 'audiodiarios' ? 'activo' : ''}`}
            onClick={() => setVistaActual('audiodiarios')}
          >
            📻 Audiodiarios ({audiodiarioActuales.length})
          </button>
          <button
            className={`boton-vista ${vistaActual === 'favoritos' ? 'activo' : ''}`}
            onClick={() => setVistaActual('favoritos')}
          >
            ⭐ Favoritos ({favoritosJuegoActual.length})
          </button>
        </div>

        {vistaActual === 'audiodiarios' && (
          <div className="vista-audiodiarios">
            <div className="portada">
              <img
                src={imagenes[juego]}
                alt={juego}
                className="imagen-juego"
              />
              <div className="info-juego">
                <h2>{juego}</h2>
              </div>
            </div>

            {loading && <p className="cargando">⏳ Cargando...</p>}

            <div className="lista-audiodiarios">
              {audiodiarioActuales.map((audio) => (
                <div key={audio.id} className="audiodiario-card">
                  <div className="audiodiario-header">
                    <h3>#{audio.numero} - {audio.nombre}</h3>
                  </div>
                  <p className="descripcion">{audio.descripcion}</p>
                  <button
                    className="boton-favorito"
                    onClick={() => addFavorito(audio)}
                    disabled={loading || favoritos.some(f => f.id === audio.id)}
                  >
                    {favoritos.some(f => f.id === audio.id) ? '⭐ EN FAVORITOS' : '☆ AÑADIR A FAVORITOS'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {vistaActual === 'favoritos' && (
          <div className="vista-favoritos">
            <h2 className="titulo-favoritos">⭐ MIS AUDIODIARIOS FAVORITOS ⭐</h2>
            
            {loading && <p className="cargando">⏳ Cargando...</p>}

            {favoritosJuegoActual.length === 0 ? (
              <p className="sin-favoritos">
                No tienes audiodiarios favoritos de {juego} aún.
                <br />
                ¡Ve a la sección de audiodiarios y añade algunos!
              </p>
            ) : (
              <div className="lista-favoritos">
                {favoritosJuegoActual.map((favorito) => (
                  <div key={favorito.id} className="favorito-card">
                    <div className="favorito-header">
                      <h3>#{favorito.numero} - {favorito.nombre}</h3>
                      <span className="badge">{favorito.juego}</span>
                    </div>
                    <p className="descripcion">{favorito.descripcion}</p>
                    <button
                      className="boton-eliminar"
                      onClick={() => deleteFavorito(favorito.id)}
                      disabled={loading}
                    >
                      🗑️ ELIMINAR DE FAVORITOS
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <footer className="footer">
          <p>🎮 Audiodiarios Bioshock - Despliegue Final 🎮</p>
          <p>Conectado a: {API_URL}</p>
        </footer>
      </div>
    </div>
  )
}

export default App
