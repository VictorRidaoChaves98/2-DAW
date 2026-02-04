import { useState, useEffect } from 'react'
import './App.css'

// Datos de audiodiarios
const audiodiarios = {
  'Bioshock 1': [
    {
      id: 1,
      nombre: 'La Gran Cadena',
      numero: 1,
      personaje: 'Andrew Ryan',
      texto: 'Transcripción pendiente de completar.',
      descripcion: 'Transcripción pendiente de completar.',
      audio: '/audios/AndrewGranCadena.mp3',
      imagen: '/images/AndrewAudio.png'
    },
    {
      id: 2,
      nombre: 'Parásitos',
      numero: 2,
      personaje: 'Andrew Ryan',
      texto: 'Transcripción pendiente de completar.',
      descripcion: 'Transcripción pendiente de completar.',
      audio: '/audios/AndrewParasitos.mp3',
      imagen: '/images/AndrewAudio.png'
    },
    {
      id: 3,
      nombre: 'Año Nuevo',
      numero: 3,
      personaje: 'Diane McClintock',
      texto: 'Transcripción pendiente de completar.',
      descripcion: 'Transcripción pendiente de completar.',
      audio: '/audios/DianeAñoNuevo.mp3',
      imagen: '/images/DianeAudio.png'
    },
    {
      id: 4,
      nombre: 'Cambios',
      numero: 4,
      personaje: 'Dr. Steinman',
      texto: 'Transcripción pendiente de completar.',
      descripcion: 'Transcripción pendiente de completar.',
      audio: '/audios/SteinmannCambios.mp3',
      imagen: '/images/SteinmannAudio.png'
    },
    {
      id: 5,
      nombre: 'ADAM',
      numero: 5,
      personaje: 'Brigid Tenenbaum',
      texto: 'Transcripción pendiente de completar.',
      descripcion: 'Transcripción pendiente de completar.',
      audio: '/audios/TenenbaumAdam.mp3',
      imagen: '/images/tenenbamumAudio.png'
    }
  ],
  'Bioshock 2': [
    { id: 6, nombre: 'Subject Delta Returns', numero: 1, personaje: '', texto: 'Transcripción pendiente de completar.', descripcion: 'Transcripción pendiente de completar.', audio: '', imagen: '' },
    { id: 7, nombre: 'The Rapture Family', numero: 2, personaje: '', texto: 'Transcripción pendiente de completar.', descripcion: 'Transcripción pendiente de completar.', audio: '', imagen: '' },
    { id: 8, nombre: 'Lamb\'s Cause', numero: 3, personaje: '', texto: 'Transcripción pendiente de completar.', descripcion: 'Transcripción pendiente de completar.', audio: '', imagen: '' },
    { id: 9, nombre: 'The Rumbler', numero: 4, personaje: '', texto: 'Transcripción pendiente de completar.', descripcion: 'Transcripción pendiente de completar.', audio: '', imagen: '' },
    { id: 10, nombre: 'Reunion', numero: 5, personaje: '', texto: 'Transcripción pendiente de completar.', descripcion: 'Transcripción pendiente de completar.', audio: '', imagen: '' }
  ],
  'Bioshock Infinite': [
    { id: 11, nombre: 'Welcome to Columbia', numero: 1, personaje: '', texto: 'Transcripción pendiente de completar.', descripcion: 'Transcripción pendiente de completar.', audio: '', imagen: '' },
    { id: 12, nombre: 'The Songbird', numero: 2, personaje: '', texto: 'Transcripción pendiente de completar.', descripcion: 'Transcripción pendiente de completar.', audio: '', imagen: '' },
    { id: 13, nombre: 'A New Frontier', numero: 3, personaje: '', texto: 'Transcripción pendiente de completar.', descripcion: 'Transcripción pendiente de completar.', audio: '', imagen: '' },
    { id: 14, nombre: 'Infinite Possibilities', numero: 4, personaje: '', texto: 'Transcripción pendiente de completar.', descripcion: 'Transcripción pendiente de completar.', audio: '', imagen: '' },
    { id: 15, nombre: 'The Choice', numero: 5, personaje: '', texto: 'Transcripción pendiente de completar.', descripcion: 'Transcripción pendiente de completar.', audio: '', imagen: '' }
  ]
}

const imagenes = {
  'Bioshock 1': '/images/Bioshock1.png',
  'Bioshock 2': '/images/Bioshock2.png',
  'Bioshock Infinite': '/images/BioshockInfinite.png'
}

function App() {
  const [juego, setJuego] = useState('Bioshock 1')
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [vistaActual, setVistaActual] = useState('audiodiarios')
  const [audiodiarioSeleccionadoId, setAudiodiarioSeleccionadoId] = useState(audiodiarios['Bioshock 1'][0]?.id ?? null)

  const API_URL = 'https://api-tarea-despliegue-vercel-render.onrender.com'

  useEffect(() => {
    obtenerFavoritos()
  }, [])

  useEffect(() => {
    const primero = audiodiarios[juego][0]
    setAudiodiarioSeleccionadoId(primero ? primero.id : null)
  }, [juego])

  const obtenerFavoritos = async () => {
    setLoading(true)
    setError(null)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)
      
      const response = await fetch(`${API_URL}/favoritos`, {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }
      })
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      setFavoritos(data.data || data || [])
    } catch (err) {
      console.error('Error de conexión:', err)
      if (err.name === 'AbortError') {
        setError('⏱️ Timeout: El servidor tarda demasiado (>15s)')
      } else {
        setError('❌ No se puede conectar al servidor')
      }
    } finally {
      setLoading(false)
    }
  }

  const esFavorito = (audiodiario) => {
    return favoritos.some(f => f.juego === juego && f.numero === audiodiario.numero)
  }

  const addFavorito = async (audiodiario) => {
    if (esFavorito(audiodiario)) {
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
          descripcion: audiodiario.texto || audiodiario.descripcion
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
  const audiodiarioSeleccionado = audiodiarioActuales.find(audio => audio.id === audiodiarioSeleccionadoId)

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

            <div className="audiodiarios-layout">
              <div className="lista-nombres">
                {audiodiarioActuales.map((audio) => (
                  <button
                    key={audio.id}
                    className={`item-nombre ${audio.id === audiodiarioSeleccionadoId ? 'activo' : ''}`}
                    onClick={() => setAudiodiarioSeleccionadoId(audio.id)}
                  >
                    #{audio.numero} - {audio.nombre}
                  </button>
                ))}
              </div>

              <div className="detalle-audio">
                {audiodiarioSeleccionado ? (
                  <>
                    <h3 className="detalle-titulo">#{audiodiarioSeleccionado.numero} - {audiodiarioSeleccionado.nombre}</h3>
                    <p className="detalle-personaje">Voz: {audiodiarioSeleccionado.personaje || 'Personaje pendiente'}</p>

                    <div className="detalle-media">
                      {audiodiarioSeleccionado.imagen ? (
                        <img
                          src={audiodiarioSeleccionado.imagen}
                          alt={audiodiarioSeleccionado.personaje || 'Personaje'}
                          className="imagen-personaje"
                        />
                      ) : (
                        <div className="imagen-placeholder">Sin imagen</div>
                      )}

                      <div className="audio-box">
                        {audiodiarioSeleccionado.audio ? (
                          <audio controls src={audiodiarioSeleccionado.audio} />
                        ) : (
                          <p className="sin-audio">Audio pendiente</p>
                        )}
                      </div>
                    </div>

                    <div className="texto-completo">
                      <h4>Transcripción</h4>
                      <p>{audiodiarioSeleccionado.texto || audiodiarioSeleccionado.descripcion || 'Transcripción pendiente de completar.'}</p>
                    </div>

                    <button
                      className="boton-favorito"
                      onClick={() => addFavorito(audiodiarioSeleccionado)}
                      disabled={loading || esFavorito(audiodiarioSeleccionado)}
                    >
                      {esFavorito(audiodiarioSeleccionado) ? '⭐ EN FAVORITOS' : '☆ AÑADIR A FAVORITOS'}
                    </button>
                  </>
                ) : (
                  <p className="sin-audio">Selecciona un audiodiario para ver su detalle</p>
                )}
              </div>
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
