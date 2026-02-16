# Mongoose Queries - Ejercicio 35 ✅

Proyecto educativo de **consultas avanzadas con Mongoose** que implementa paginación, populate, lookup y agregaciones sobre las bases de datos de ejemplo de MongoDB (sample_weatherdata, sample_mflix, sample_training).

---

## Estructura

```
ej35-mongoose-queries/
├── src/
│   ├── config/
│   │   └── database.js                    # Configuración de conexión
│   ├── models/
│   │   ├── weather.model.js               # Modelo de datos meteorológicos
│   │   ├── mflix.model.js                 # Modelos Movie & Comment
│   │   └── grade.model.js                 # Modelo de calificaciones
│   └── queries/
│       ├── weatherdata-pagination.js      # Ejercicio 1: Paginación
│       ├── mflix-populate-lookup.js       # Ejercicio 2: Populate & Lookup
│       └── grades-aggregation.js          # Ejercicio 3: Agregaciones
├── bd/                                    # Datos JSON (no en git)
├── docker/
│   └── mongo/data/                        # Base de datos MongoDB (no en git)
├── docker-compose.yml
├── package.json
├── README.md                              # Este archivo
├── RESUMEN.md                             # Resumen de reestructuración
└── CLEANUP.md                             # Guía para limpiar archivos antiguos
```

---

## Instalación

### 1. Clonar el repositorio
```
git clone <url-del-repositorio>
cd ej35-mongoose-queries
```

### 2. Instalar dependencias
```
npm install
```

### 3. Iniciar MongoDB con Docker
```
docker-compose up -d
```

### 4. Importar datos de ejemplo

#### Datos de Sample Weatherdata (10,000 documentos)
```
docker exec -i mongo mongoimport --db sample_weatherdata --collection data < bd/sample_weatherdata/data.json
```

#### Datos de Sample Mflix
```
# Comentarios (50,304 documentos)
docker exec -i mongo mongoimport --db sample_mflix --collection comments < bd/sample_mflix/comments.json

# Películas (23,539 documentos)
docker exec -i mongo mongoimport --db sample_mflix --collection movies < bd/sample_mflix/movies.json
```

#### Datos de Sample Training (100,000 documentos)
```
docker exec -i mongo mongoimport --db sample_training --collection grades < bd/sample_training/grades.json
```

---

## Ejercicios Realizados

### 1: Paginación (sample_weatherdata)

**Archivo:** `src/queries/weatherdata-pagination.js`

**Descripción:**
Implementa dos métodos de paginación de documentos meteorológicos almacenados en MongoDB.

**Base de Datos:** sample_weatherdata
**Colección:** data
**Documentos:** 10,000 registros

#### 1.1. Paginación Nativa (skip & limit)

```
npm run weatherdata
```

**Código:**
```javascript
const docs = await Weather
    .find()
    .skip((page - 1) * limit)  // Saltar documentos
    .limit(limit);              // Limitar resultados

const totalDocs = await Weather.countDocuments();
const totalPages = Math.ceil(totalDocs / limit);
```

**Ejemplo de salida:**
```
Página: 2 de 2000
Documentos por página: 5
Total de documentos: 10000
Mostrando 5 documentos:

--- Documento 6 ---
{
  "_id": "...",
  "st": "x+59500+001500",
  "ts": "1984-03-05T15:00:00.000Z",
  "position": { "type": "Point", "coordinates": [1.5, 59.5] },
  "elevation": 9999,
  "airTemperature": { "value": 6.3, "quality": "1" },
  ...
}
```
---

#### 1.2. Paginación con Plugin mongoose-paginate-v2

**Características:**
- Metadatos automáticos (totalPages, hasNextPage, hasPrevPage, etc.)
- Menos código
- Más conveniente para aplicaciones web

**Código:**
```
const options = {
    page: 2,
    limit: 5,
    sort: { _id: 1 },
    lean: false
};

const result = await WeatherWithPlugin.paginate({}, options);
```

**Metadatos retornados:**
```
{
  docs: [...],
  totalDocs: 10000,
  limit: 5,
  page: 2,
  totalPages: 2000,
  hasNextPage: true,
  hasPrevPage: true,
  nextPage: 3,
  prevPage: 1
}
```
---

#### 1.3. Paginación Avanzada

**Características adicionales:**
- Filtros en la consulta
- Proyección de campos
- `lean: true` para mejor rendimiento

```
const result = await WeatherWithPlugin.paginate(
    {},  // Query (filtros)
    {
        page: 1,
        limit: 10,
        select: '_id ts position',  // Solo estos campos
        lean: true,                  // Objetos planos
        sort: { _id: -1 }            // Ordenamiento
    }
);
```

---

### 2: Populate & Lookup (sample_mflix)

**Archivo:** `src/queries/mflix-populate-lookup.js`

**Descripción:**
Demuestra dos formas de relacionar comentarios con películas usando Mongoose.

**Base de Datos:** sample_mflix
**Colecciones:** movies (23,539), comments (50,304)

#### 2.1. Populate: Comentario con Película

```
npm run mflix
```

**Objetivo:** Obtener un comentario junto con los datos de la película referenciada.

**Código:**
```javascript
const comentario = await Comment
    .findOne()
    .populate({
        path: 'movie_id',
        select: 'title genres year rated type'  // Solo estos campos
    });
```

**Datos Seleccionados:**
```
{
  title: "The Land Beyond the Sunset",
  genres: ["Short", "Drama", "Fantasy"],
  year: 1912,
  rated: "UNRATED",
  type: "movie"
}
```

---

#### 2.2. Aggregate $lookup: Película con Comentarios

**Objetivo:** Obtener una película junto con TODOS sus comentarios.

**Código:**
```
const resultado = await Movie.aggregate([
    {
        $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'movie_id',
            as: 'comentarios'
        }
    },
    {
        $match: {
            'comentarios.0': { $exists: true }  // Solo películas con comentarios
        }
    },
    {
        $project: {
            title: 1,
            genres: 1,
            year: 1,
            rated: 1,
            type: 1,
            comentarios: { name: 1, email: 1, text: 1, date: 1 },
            totalComentarios: { $size: '$comentarios' }
        }
    },
    { $limit: 1 }
]);
```

---

#### 2.3. Películas con Estadísticas (Ejemplo Avanzado)

Encuentra películas con 5+ comentarios y muestra estadísticas:

```
const resultado = await Movie.aggregate([
    { $lookup: {...} },
    {
        $match: {
            $expr: { $gte: [{ $size: '$comentarios' }, 5] }
        }
    },
    { $project: {...} },
    { $sort: { totalComentarios: -1 } },
    { $limit: 5 }
]);
```
---

### 3: Agregaciones (sample_training)

**Archivo:** `src/queries/grades-aggregation.js`

**Descripción:**
Calcula estadísticas de calificaciones usando agregaciones complejas.

**Base de Datos:** sample_training
**Colección:** grades
**Documentos:** 100,000 registros con arrays de scores

#### 3.1 Notas por Estudiante y Tipo

```
npm run grades
```

**Objetivo:** Calcular media, máxima y mínima por estudiante y tipo de evaluación.

**Estructura de datos:**
```
{
  _id: ObjectId,
  student_id: 1,
  class_id: 481,
  scores: [
    { type: "exam", score: 89.5 },
    { type: "quiz", score: 75.2 },
    { type: "homework", score: 92.1 }
  ]
}
```

**Código:**
```
const resultado = await Grade.aggregate([
    { $unwind: '$scores' },  // Descomponer arrays
    {
        $group: {
            _id: {
                student_id: '$student_id',
                type: '$scores.type'
            },
            notaMedia: { $avg: '$scores.score' },
            notaMaxima: { $max: '$scores.score' },
            notaMinima: { $min: '$scores.score' },
            totalNotas: { $sum: 1 }
        }
    },
    { $sort: { '_id.student_id': 1, '_id.type': 1 } }
]);
```

---

#### 3.2. Notas por Clase

**Objetivo:** Estadísticas por clase, mostrando cuántos estudiantes hay.

**Código:**
```
const resultado = await Grade.aggregate([
    { $unwind: '$scores' },
    {
        $group: {
            _id: '$class_id',
            notaMedia: { $avg: '$scores.score' },
            notaMaxima: { $max: '$scores.score' },
            notaMinima: { $min: '$scores.score' },
            totalEstudiantes: { $addToSet: '$student_id' },
            totalNotas: { $sum: 1 }
        }
    },
    {
        $project: {
            class_id: '$_id',
            notaMedia: 1,
            totalEstudiantes: { $size: '$totalEstudiantes' },
            totalNotas: 1
        }
    }
]);
```

---

#### 3.3. Ranking de Estudiantes por Clase

Top 10 estudiantes de una clase específica ordenados por nota media.

```
const resultado = await Grade.aggregate([
    { $match: { class_id: 481 } },
    { $unwind: '$scores' },
    { $group: {...} },
    { $sort: { notaMedia: -1 } },
    { $limit: 10 }
]);
```

---

#### 3.4. Estadísticas por Tipo de Evaluación

Muestra estadísticas generales incluyendo desviación estándar.

```
const resultado = await Grade.aggregate([
    { $unwind: '$scores' },
    {
        $group: {
            _id: '$scores.type',
            notaMedia: { $avg: '$scores.score' },
            notaMaxima: { $max: '$scores.score' },
            notaMinima: { $min: '$scores.score' },
            desviacionEstandar: { $stdDevPop: '$scores.score' },
            totalEvaluaciones: { $sum: 1 }
        }
    }
]);
```

---

## ⚙️ Ejecución

### Ejecutar ejercicio individual
```
npm run weatherdata
npm run mflix
npm run grades
```

### Ejecutar todos los ejercicios
```
npm run all
```

### Ejecutar directamente con Node
```
node src/queries/weatherdata-pagination.js
node src/queries/mflix-populate-lookup.js
node src/queries/grades-aggregation.js
```

---

## Configuración de Conexión

La conexión a MongoDB se realiza automáticamente a través de `src/config/database.js`:

```javascript
mongodb://localhost:27017/<database_name>
```

**Bases de datos utilizadas:**
- `sample_weatherdata` - Datos meteorológicos
- `sample_mflix` - Películas y comentarios
- `sample_training` - Calificaciones de estudiantes
