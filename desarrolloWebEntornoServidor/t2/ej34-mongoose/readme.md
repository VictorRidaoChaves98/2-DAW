# DWES - Tema 34: Mongoose con Node.js

---

## Estructura de carpetas

```

ej34-mongoose/
│
├─ bd/                       # Bases de datos del repositorio de GitHub
├─ node_modules/             # Dependencias Node.js
├─ models/                   # Schemas de Mongoose
│  └─ movie.js
├─ config/                   # Configuración de conexión a MongoDB
│  └─ db.js
├─ consultas.js              # Archivo de ejemplo con 5 consultas
├─ index.js                  # Archivo principal de prueba
├─ package.json
├─ package-lock.json
└─ 34-mongoose.pdf           # Temario del tema 34

```

---

## Requisitos

- Node.js >= 24
- MongoDB corriendo en Docker
- Mongoose

---

## Configuración de MongoDB en local (Docker Desktop)

1. Ejecutar MongoDB en Docker:

```
docker run -d -p 27017:27017 --name mongo mongo
```

2. Verificar que el contenedor está corriendo:

```
docker ps
```

3. Copiar los archivos JSON al contenedor:

```
docker cp bd/sample_mflix/movies.json mongo:/movies.json
```

4. Importar los datos a la base de datos `sample_mflix`:

```
docker exec -it mongo mongoimport --db sample_mflix --collection movies --file /movies.json
```

5. Verificar conexión desde `mongosh` (funciona correctamente):

```
docker exec -it mongo mongosh
> use sample_mflix
> db.movies.countDocuments()
```

---

## Conexión desde Node.js

Archivo `config/db.js`:

```
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sample_mflix');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;
```

---

## Modelo Mongoose

Archivo `models/movie.js`:

```
const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
  title: String,
  plot: String,
  genres: [String],
  year: Number,
  runtime: Number,
  directors: [String],
  cast: [String],
  imdb: {
    rating: Number,
    votes: Number,
    id: Number
  },
  num_mflix_comments: Number,
});

module.exports = mongoose.model('Movie', movieSchema);

```

---

## Ejecutar consultas

Archivo `consultas.js` contiene ejemplos de consultas:

```
node consultas.js
```

Ejemplos incluidos:

1. Buscar una película por título
2. Contar películas de un año específico
3. Listar primeras 5 películas de un género
4. Filtrar películas por rating IMDB
5. Filtrar películas con comentarios