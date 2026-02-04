# 🎙️ Audiodiarios Bioshock - Aplicación Web Interactiva

Una aplicación web que permite explorar, reproducir y guardar audiodiarios de los videojuegos de la saga Bioshock. Con una interfaz Art Déco inspirada en Rapture y Columbia, la aplicación ofrece una experiencia inmersiva para coleccionar los secretos de estos mundos distópicos.

---

## 🎮 Características Principales

✅ **Tres juegos disponibles:**
- Bioshock 1 (Rapture)
- Bioshock 2 (Rapture - Futuro)
- Bioshock Infinite (Columbia)

✅ **Reproducción de audio:**
- 15 audiodiarios (5 por juego)
- Reproductor integrado con controles de volumen y progreso

✅ **Interfaz de usuario:**
- Diseño Art Déco con fuente Playfair Display (1920s-1930s)
- Paleta de colores: Oro (#d4af37), Rojo (#c1272d), Negro (#0a0a0a)
- Vista detallada con imagen del personaje, audio y transcripción
- Lista navegable de audiodiarios por juego

✅ **Sistema de favoritos:**
- Guardar audiodiarios favoritos en base de datos MongoDB
- Reproducir audios desde la sección de favoritos
- Eliminar favoritos con un clic
- Persistencia de datos en el servidor

✅ **Responsive Design:**
- Adaptado para dispositivos móviles
- Interfaz centrada y escalable

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19.2.0** - Framework JavaScript
- **Vite 7.2.4** - Build tool y dev server
- **CSS3** - Estilos personalizados (Grid, Flexbox, Animaciones)
- **JavaScript ES6+** - Lógica de la aplicación

### Backend
- **Node.js 22.22.0** - Runtime de JavaScript
- **Express 5.2.1** - Framework web
- **Mongoose** - ODM para MongoDB
- **CORS** - Seguridad de cross-origin requests

### Base de Datos
- **MongoDB Atlas** - Base de datos NoSQL en la nube
- **Colección: favoritos** - Almacena audiodiarios guardados

### Hosting
- **Vercel** - Despliegue del frontend
- **Render** - Despliegue del backend

---

## 📁 Estructura del Proyecto

```
tareaDespliegue/
├── react-render-app/              # Backend (Node.js + Express)
│   ├── server.js                  # Servidor principal
│   ├── package.json               # Dependencias
│   ├── config/
│   │   └── database.js            # Conexión MongoDB
│   ├── models/
│   │   └── Favorito.js            # Schema MongoDB
│   └── data/
│       └── audiodiarios.json      # Datos iniciales
│
├── react-vercel-app/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx                # Componente principal
│   │   ├── App.css                # Estilos
│   │   ├── main.jsx               # Punto de entrada
│   │   └── index.css              # Estilos globales
│   ├── public/
│   │   ├── audios/                # Archivos MP3 (15 audiodiarios)
│   │   └── images/                # Imágenes de personajes y portadas
│   ├── package.json               # Dependencias
│   ├── vite.config.js             # Configuración Vite
│   └── vercel.json                # Configuración Vercel
│
└── README.md                      # Este archivo
```

---

## 🚀 Despliegue en Vivo

- **Frontend:** https://tarea-despliegue-brown.vercel.app/
- **Backend API:** https://api-tarea-despliegue-vercel-render.onrender.com/

---

## 📦 Instalación Local

### Requisitos
- Node.js 18+
- MongoDB (local o atlas)
- npm o yarn

### Backend (Render App)

```bash
cd react-render-app

# Instalar dependencias
npm install

# Crear archivo .env
echo "MONGODB_URI=mongodb+srv://VictorDB:DWES123@cluster0.zmarxtq.mongodb.net/tareaDespliegue?retryWrites=true&w=majority" > .env
echo "PORT=3000" >> .env

# Ejecutar servidor
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Frontend (Vercel App)

```bash
cd react-vercel-app

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📋 API Endpoints

### GET /favoritos
Obtiene todos los audiodiarios guardados como favoritos.

```javascript
GET https://api-tarea-despliegue-vercel-render.onrender.com/favoritos
```

**Respuesta:**
```json
{
  "data": [
    {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "juego": "Bioshock 1",
      "nombre": "La Gran Cadena",
      "numero": 1,
      "descripcion": "...",
      "fecha_guardado": "2024-02-04T10:30:00Z"
    }
  ]
}
```

### GET /favoritos/:id
Obtiene un audiodiario favorito específico.

```javascript
GET https://api-tarea-despliegue-vercel-render.onrender.com/favoritos/65a1b2c3d4e5f6g7h8i9j0k1
```

### POST /favoritos
Añade un nuevo audiodiario a favoritos.

```javascript
POST https://api-tarea-despliegue-vercel-render.onrender.com/favoritos
Content-Type: application/json

{
  "juego": "Bioshock 1",
  "nombre": "La Gran Cadena",
  "numero": 1,
  "descripcion": "..."
}
```

### DELETE /favoritos/:id
Elimina un audiodiario de favoritos.

```javascript
DELETE https://api-tarea-despliegue-vercel-render.onrender.com/favoritos/65a1b2c3d4e5f6g7h8i9j0k1
```

---

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Oro (Primary) | #d4af37 | Bordes, títulos, acentos |
| Rojo (Accent) | #c1272d | Resaltados, alertas |
| Negro (Dark) | #0a0a0a | Fondo, textos oscuros |
| Gris Claro | #ddd | Textos secundarios |
| Gris Oscuro | #333 | Textos principales |

---

## 🎵 Estructura de Audiodiarios

Cada audiodiario contiene:

```javascript
{
  id: Number,           // ID único
  nombre: String,       // Título del audiodiario
  numero: Number,       // Número (1-5)
  personaje: String,    // Nombre del personaje que habla
  texto: String,        // Transcripción del audio original
  descripcion: String,  // Traducción/explicación del audio
  audio: String,        // Ruta del archivo MP3
  imagen: String        // Ruta de la imagen del personaje
}
```

---

## 🔐 Variables de Entorno

### Backend (.env)
```
MONGODB_URI=mongodb+srv://VictorDB:DWES123@cluster0.zmarxtq.mongodb.net/tareaDespliegue?retryWrites=true&w=majority
PORT=3000
NODE_ENV=production
```

### Frontend
No requiere variables de entorno (la URL del API está hardcodeada en App.jsx).

---

## 🌐 CORS Configuration

El backend permite solicitudes desde:
- `localhost:5173` (desarrollo local)
- `localhost:3000` (desarrollo alternativo)
- Cualquier dominio `*.vercel.app` (producción)

---

## 📱 Características Responsive

- **Desktop:** Vista completa con lista lateral y detalle a la derecha
- **Tablet:** Ajustes de tamaño de fuente y espaciado
- **Mobile:** Una columna, elementos apilados verticalmente

---

## 🔧 Desarrollo

### Scripts disponibles (Frontend)

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Compila para producción
npm run preview  # Previsualiza el build
npm run lint     # Ejecuta linter
```

### Scripts disponibles (Backend)

```bash
npm start        # Inicia el servidor
npm run dev      # Inicia con nodemon (desarrollo)
```

---

## 📝 Notas de Despliegue

- **Render (Backend):** Tiene "sleep mode" después de 15 minutos de inactividad en plan gratuito. Primera solicitud tardará ~50 segundos en despertar.
- **Vercel (Frontend):** Redepliegue automático al hacer push a la rama `main`.
- **MongoDB Atlas:** Conexión desde cualquier IP permitida (0.0.0.0/0).

---

## 📚 Audiodiarios Incluidos

### Bioshock 1 (5)
1. La Gran Cadena - Andrew Ryan
2. Parásitos - Andrew Ryan
3. Año Nuevo - Diane McClintock
4. Cambios - Dr. Steinman
5. ADAM - Brigid Tenenbaum

### Bioshock 2 (5)
1. Alexander - Alexander
2. Charles - Charles Lee Ray
3. Lamb - Sofia Lamb
4. Reed - Reed Wahl
5. Reed - Túnel - Reed Wahl

### Bioshock Infinite (5)
1. Booker - Booker DeWitt
2. Comstock - Zachary Hale Comstock
3. Elizabeth - Elizabeth
4. Lady - Mysterious Lady
5. Lutece - The Lutece Twins

---

## 📖 Guía de Uso

1. **Seleccionar Juego:** Click en BIOSHOCK 1, 2 o INFINITE
2. **Ver Audiodiarios:** Se muestra lista a la izquierda
3. **Reproducir Audio:** Click en cualquier audiodiario, aparecerá el detalle con:
   - Imagen del personaje
   - Reproductor de audio
   - Texto original
   - Traducción/explicación
4. **Añadir a Favoritos:** Click en el botón "☆ AÑADIR A FAVORITOS"
5. **Ver Favoritos:** Click en la pestaña "⭐ Favoritos (X)"
6. **Reproducir desde Favoritos:** Selecciona un favorito y reproduce igual que en audiodiarios
7. **Eliminar Favorito:** Click en "🗑️ ELIMINAR DE FAVORITOS"

---

## 🐛 Troubleshooting

### El backend no responde
- El servidor Render puede estar dormido (plan gratuito). Espera 50-60 segundos.

### Las imágenes no se cargan
- Verifica que los archivos estén en `/public/images/` con los nombres correctos.

### Los audios no se reproducen
- Verifica que los archivos MP3 estén en `/public/audios/` con las rutas correctas en App.jsx.

### Error de CORS
- Verifica que la URL del API sea correcta en App.jsx.
- Asegúrate de que el origen del navegador esté permitido en el servidor.

---

## 📄 Licencia

Este proyecto es de uso educativo. Los audios y contenido de Bioshock son propiedad de Irrational Games y 2K Games.

---

## 👤 Autor

Desarrollado por **Victor Ridao Chaves**  
Curso: 2º Desarrollo de Aplicaciones Web (2-DAW)  
Asignatura: Despliegue de Aplicaciones Web  
Fecha: Febrero 2026

---

## 📞 Contacto

Para reportar bugs o sugerencias, crea un issue en el repositorio:
https://github.com/victormanuel-98/2-DAW

---

**¡Disfruta explorando los secretos de Rapture y Columbia! 🎮🎙️**
