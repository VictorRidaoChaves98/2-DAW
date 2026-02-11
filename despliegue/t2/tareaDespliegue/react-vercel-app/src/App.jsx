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
      texto: 'Sangre en las calles.',
      descripcion: '¿Hay sangre en las calles? Por supuesto. ¿Han elegido algunos destruirse con empalmes descuidados? Innegable. Pero no haré proclamaciones ni dictaré leyes. La Gran Cadena avanza despacio, pero con sabiduría. Es nuestra impaciencia la que invita al Parásito del gran gobierno. Y una vez que lo hayas invitado, nunca dejará de alimentarse del cuerpo de la ciudad .',
      audio: '/audios/AndrewGranCadena.mp3',
      imagen: '/images/AndrewAudio.png'
    },
    {
      id: 2,
      nombre: 'Parásitos',
      numero: 2,
      personaje: 'Andrew Ryan',
      texto: 'Expectativas de los parásitos.',
      descripcion: 'A primera vista, el Parásito espera que el médico lo cure gratis y que el granjero lo alimente por caridad. Qué poco se diferencian del pervertido que ronda las calles en busca de una víctima para su grotesca diversión.',
      audio: '/audios/AndrewParasitos.mp3',
      imagen: '/images/AndrewAudio.png'
    },
    {
      id: 3,
      nombre: 'Año Nuevo',
      numero: 3,
      personaje: 'Diane McClintock',
      texto: 'Nochevieja sola... de nuevo.',
      descripcion: 'Otro Año Nuevo , otra noche sola. Yo salí, y tú te quedaste en Hephaestus , trabajando. Imagina mi sorpresa. Supongo que tomaré otra copa... Brindemos por Diane McClintock, la chica más tonta de Rapture . Tan tonta como para enamorarse de Andrew Ryan , tan tonta como para... (Sonidos de explosiones y gritos) ¿Qué… qué pasó…? Estoy sangrando… Oh, Dios… ¿Qué está pasando…?',
      audio: '/audios/DianeAñoNuevo.mp3',
      imagen: '/images/DianeAudio.png'
    },
    {
      id: 4,
      nombre: 'Cambios',
      numero: 4,
      personaje: 'Dr. Steinman',
      texto: 'El ADAM brinda cambios.',
      descripcion: ' Ryan y ADAM , ADAM y Ryan… Todos esos años de estudio, ¿y fui realmente cirujano antes de conocerlos? Cómo desgranábamos con nuestros bisturíes y nuestra moral de juguete. Sí, podíamos cortar un forúnculo por aquí y afeitar un pico por allá, pero… ¿podríamos realmente cambiar algo? No. Pero ADAM nos da los medios para hacerlo. Y Ryan nos libera de la falsa ética que nos frenaba. Cambia tu apariencia, cambia tu sexo, cambia tu raza. Es tuyo para cambiar, de nadie más.',
      audio: '/audios/SteinmannCambios.mp3',
      imagen: '/images/SteinmannAudio.png'
    },
    {
      id: 5,
      nombre: 'ADAM',
      numero: 5,
      personaje: 'Brigid Tenenbaum',
      texto: 'Producción masiva de ADAM.',
      descripcion: 'El procedimiento de aumento es un éxito. Las babosas por sí solas no podían proporcionar suficiente ADAM para un trabajo serio. Pero combinadas con el huésped… ahora tenemos algo. La babosa se incrusta en el revestimiento del estómago del huésped y, después de que este se alimenta, inducimos la regurgitación, y entonces obtenemos una producción de ADAM utilizable de veinte a treinta veces. El problema ahora es la escasez de huéspedes. Fontaine dice: «Paciencia, Tenenbaum. Pronto abrirá el primer hogar para Hermanitas , y ese problema estará resuelto…».',
      audio: '/audios/TenenbaumAdam.mp3',
      imagen: '/images/tenenbamumAudio.png'
    }
  ],
  'Bioshock 2': [
    {
      id: 6,
      nombre: 'La Big Sister',
      numero: 1,
      personaje: 'Gilbert Alexander',
      texto: 'Una gran evolución.',
      descripcion: ' Sometimos a nuestra Big Sister a un nuevo régimen de acondicionamiento físico y mental, y la equipamos con equipo de protector modificado de mi diseño. Las niñas la han apodado "Big Sister". Lamentablemente, esto es una solución provisional. Entre los splicers rebeldes y el envejecimiento de las pequeñas, pronto nos quedaremos sin Little Sisters viables. Después de eso... la superficie puede ser nuestra única fuente...',
      audio: '/audios/AlexanderAudio2.mp3',
      imagen: '/images/AlexanderAudio2.png'
    },
    {
      id: 7,
      nombre: 'El Pensador',
      numero: 2,
      personaje: 'Charles Milton Porter',
      texto: 'Una IA peculiar.',
      descripcion: ' El Sr. Ryan me contrató para construir un ordenador capaz de mantener una ciudad entera funcionando a tiempo completo: la Red de Interpretación de Datos Operacionales de Rapture. La gente la llama "El Pensador". Hemos aprovechado el poder del ADAM incluso en esto, permitiendo que el ordenador central procese datos a la velocidad del pensamiento. En otras palabras, piensa por nosotros, sí... y con la finalización del Procesador de Razonamiento Independiente, finalmente podría pensar... por sí mismo. Si Turing pudiera verme ahora...',
      audio: '/audios/ChalesAudio2.mp3',
      imagen: '/images/CharlesAudio2.png'
    },
    {
      id: 8,
      nombre: 'Un nuevo modelo cognitivo',
      numero: 3,
      personaje: 'Sofia Lamb',
      texto: 'La psiquiatría como profesión.',
      descripcion: 'Esto... esto lo pone todo en duda. Incluso mientras escribo esto, me cuesta creerlo... La psiquiatría ha sido mi estudio continuo... para cartografiar la conciencia en todos sus estratos. Pero la inteligencia no requiere introspección... el hijo de Ryan fue más eficaz que todos sus rivales conscientes de sí mismos. Vivió sin cuestionamientos. Podría acabar con el yo... y salvar el mundo.',
      audio: '/audios/LambAudio2.mp3',
      imagen: '/images/LambAudio2.png'
    },
    {
      id: 9,
      nombre: 'El potencial del pensador',
      numero: 4,
      personaje: 'Reed Wahl',
      texto: 'Porter está loco.',
      descripcion: ' Porter y yo somos socios, pero... está desperdiciando esa máquina. En mis horas libres, la he estado usando para predecir los resultados de los partidos de béisbol, y es increíblemente precisa. ¿Aplicar esas ecuaciones a los mercados de Rapture? Esta cosa es el Santo Grial de la rentabilidad. Pero Porter... lo he oído alimentándola con grabaciones de su difunta esposa. El tonto que quiere convertir al Pensador en una "persona". No podría imaginar un destino más triste para una máquina tan perfecta.',
      audio: '/audios/ReedAudio2.mp3',
      imagen: '/images/ReedAudio2.png'
    },
    {
      id: 10,
      nombre: '¡Detonad el túnel!',
      numero: 5,
      personaje: 'Reed Wahl',
      texto: 'Ya viene...',
      descripcion: 'La ironía de mi ecuación predictiva… es que a veces requiere fe ciega. Veo cómo los elementos individuales chocan entre sí y la urgencia de lo que debo hacer para cumplir mi parte en el plan es clara... pero no siempre veo exactamente POR QUÉ. Un Serie Alfa se dirige a la Guarida de Minerva, el Sujeto Sigma... y ​​la ecuación dice que si llega al Núcleo de la Computadora, ¡catástrofe! No sé por qué... todavía, pero sé lo que debo hacer... El Sujeto Sigma se acerca a la Guarida de Minerva. No debe llegar al Pensador . ¡DETONAD EL TÚNEL!.',
      audio: '/audios/ReedAudioTunel2.mp3',
      imagen: '/images/ReedAudio2.png'
    }
  ],
  'Bioshock Infinite': [
    {
      id: 11,
      nombre: 'Disculpa',
      numero: 1,
      personaje: 'Booker DeWitt',
      texto: 'Una guerra sin vencedores',
      descripcion: '*Tose* Fitzroy... si ganas esta guerra estúpida, envías esto a Nueva York. *Tose mucho* No van a conseguir a la chica . Quienquiera que sean... *Hace una mueca* Quizás hice lo correcto contigo y con Vox , pero al final... eso no soluciona nada. *Jadeando* Anna... Anna... Lo siento...',
      audio: '/audios/BookerAudio3.mp3',
      imagen: '/images/BookerAudio3.png'
    },
    {
      id: 12,
      nombre: 'Todos a la vez',
      numero: 2,
      personaje: 'Zachary Hale Comstock',
      texto: 'Un nuevo hombre',
      descripcion: 'Un hombre entra en las aguas del bautismo. Un hombre diferente sale, nacido de nuevo. Pero, ¿quién es ese hombre que yace sumergido? Quizás ese nadador sea a la vez pecador y santo, hasta que se revele a los ojos del hombre',
      audio: '/audios/ComstockAudio3.mp3',
      imagen: '/images/ComstockAudio3.png'
    },
    {
      id: 13,
      nombre: 'Fin de la historia',
      numero: 3,
      personaje: 'Elizabeth',
      texto: 'Puedo ver todas las puertas... y lo que hay detrás de ellas.',
      descripcion: 'Mañana me soltarán, porque todo esto... tiene que terminar. Pero incluso si destruyo el Sifón... ¿seré lo suficientemente fuerte para ver todas las puertas y abrir la que elija? Y si lo traigo aquí, ¿quién dice que será rival para los monstruos que he creado?',
      audio: '/audios/ElizabethAudio3.mp3',
      imagen: '/images/ElizabethAudio3.png'
    },
    {
      id: 14,
      nombre: 'Ama al pecador',
      numero: 4,
      personaje: 'Lady Comstock',
      texto: 'Ama al profeta',
      descripcion: 'Ama al Profeta, porque ama al pecador. Ama al pecador, porque él es tú. Sin el pecador, ¿qué necesidad hay de un redentor? Sin pecado, ¿qué gracia tiene el perdón?',
      audio: '/audios/LadyAudio3.mp3',
      imagen: '/images/LadyAudio3.png'
    },
    {
      id: 15,
      nombre: 'Viendo el infinito',
      numero: 5,
      personaje: 'Rosalind Lutece',
      texto: 'Un futuro prometedor',
      descripcion: 'De niña, soñé que estaba en una habitación mirando a una chica que era y no era yo, y que esta miraba a otra chica, que también era y no era yo. Mi madre lo interpretó como una pesadilla. Yo lo vi como el comienzo de una carrera en física.',
      audio: '/audios/LuteceAudio3.mp3',
      imagen: '/images/LuteceAudio3.png'
    }
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
  const [favoritoSeleccionadoId, setFavoritoSeleccionadoId] = useState(null)

  const API_URL = 'https://api-tarea-despliegue-vercel-render.onrender.com'

  useEffect(() => {
    obtenerFavoritos()
  }, [])

  useEffect(() => {
    const primero = audiodiarios[juego][0]
    setAudiodiarioSeleccionadoId(primero ? primero.id : null)
    setFavoritoSeleccionadoId(null)
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
        setSuccess('Añadido a favoritos')
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
        setSuccess('Eliminado de favoritos')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.mensaje || 'Error al eliminar')
      }
    } catch (err) {
      setError('Error de conexión con el server')
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
          <h1 className="titulo">🎙️ AUDIOLOGS SAGA BIOSHOCK 🎙️</h1>
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
                      <h4>Texto Original</h4>
                      <p>{audiodiarioSeleccionado.texto || 'Texto pendiente de completar.'}</p>
                      
                      <h4>Traducción/Explicación</h4>
                      <p>{audiodiarioSeleccionado.descripcion || 'Traducción pendiente de completar.'}</p>
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
                  <p className="sin-audio">Selecciona un audiolog para verlo en detalle</p>
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
              <div className="audiodiarios-layout">
                <div className="lista-nombres">
                  {favoritosJuegoActual.map((favorito) => (
                    <button
                      key={favorito.id}
                      className={`item-nombre ${favorito.id === favoritoSeleccionadoId ? 'activo' : ''}`}
                      onClick={() => setFavoritoSeleccionadoId(favorito.id)}
                    >
                      #{favorito.numero} - {favorito.nombre}
                    </button>
                  ))}
                </div>

                <div className="detalle-audio">
                  {favoritosJuegoActual.length > 0 && favoritoSeleccionadoId ? (() => {
                    const favoritoActual = favoritosJuegoActual.find(f => f.id === favoritoSeleccionadoId)
                    if (!favoritoActual) return <p>Favorito no encontrado.</p>
                    const audioCompleto = audiodiarios[juego].find(a => a.numero === favoritoActual.numero)
                    return (
                      <>
                        <h3 className="detalle-titulo">#{favoritoActual.numero} - {favoritoActual.nombre}</h3>
                        <p className="detalle-personaje">Voz: {audioCompleto?.personaje || 'Personaje pendiente'}</p>

                        <div className="detalle-media">
                          {audioCompleto?.imagen ? (
                            <img
                              src={audioCompleto.imagen}
                              alt={audioCompleto.personaje || 'Personaje'}
                              className="imagen-personaje"
                            />
                          ) : (
                            <div className="imagen-placeholder">Sin imagen</div>
                          )}

                          <div className="audio-box">
                            {audioCompleto?.audio ? (
                              <audio controls src={audioCompleto.audio} />
                            ) : (
                              <p className="sin-audio">Audio pendiente</p>
                            )}
                          </div>
                        </div>

                        <div className="texto-completo">
                          <h4>Texto Original</h4>
                          <p>{audioCompleto?.texto || 'Texto pendiente de completar.'}</p>
                          
                          <h4>Traducción/Explicación</h4>
                          <p>{audioCompleto?.descripcion || favoritoActual.descripcion || 'Traducción pendiente de completar.'}</p>
                        </div>

                        <button
                          className="boton-eliminar"
                          onClick={() => deleteFavorito(favoritoActual.id)}
                          disabled={loading}
                        >
                          🗑️ ELIMINAR DE FAVORITOS
                        </button>
                      </>
                    )
                  })() : (
                    <p className="sin-audio">Selecciona un audiodiario para ver su detalle</p>
                  )}
                </div>
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
