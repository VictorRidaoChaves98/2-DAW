use('sample_mflix');

// 1.1. Devolver la cuenta de cuántas películas y series hay en español. (añadir los nombres de cada película en un array).

db.movies.aggregate([
    {
        $match: { languages: 'Spanish' }
    },
    {
        $group: {
            _id: null,
            total: { $count: {} },
            peliculas: { $push: '$title' }
        }
    }
]);



/* 1.2. Devolver la cuenta de cuántas películas y series hay en español. En lugar de array de nombres, que sean objetos que contengan:
- nombre
- año
- valoración IMDb
- géneros
*/

db.movies.aggregate([
    {
        $match: { languages: 'Spanish' }
    },
    {
        $group: {
            _id: null,
            total: { $count: {} },
            peliculas: {
                $push: {
                    nombre: '$title',
                    año: '$year',
                    valoracionImdb: '$imdb.rating',
                    generos: '$genres'
                }
            }
        }
    }
]);



/* 2. Devolver las películas agrupadas:
- Primer nivel por género
- Segundo nivel por año
*/

db.movies.aggregate([
    { $unwind: '$genres' },
    {
        $group: {
            _id: {
                genero: '$genres',
                año: '$year'
            },
            peliculas: { $push: '$title' }
        }
    },
    {
        $sort: {
            '_id.genero': 1,
            '_id.año': 1
        }
    }
]);




/* 3. Agrupar las películas por valoración.
- La agrupación se hace por valores enteros.
Ej: en la categoría 7 estarán todos los comprendidos entre [7, 8).]
*/

db.movies.aggregate([
    {
        $match: { "imdb.rating": { $type: "number" } }
    },
    {
        $group: {
            _id: { $floor: "$imdb.rating" },
            totalPeliculas: { $sum: 1 }
        }
    },
    {
        $project: {
            _id: 0,
            categoria: "$_id",
            rango: {
                $concat: [
                    "[",
                    { $toString: "$_id" },
                    ", ",
                    { $toString: { $add: ["$_id", 1] } },
                    ")"
                ]
            },
            totalPeliculas: 1
        }
    },
    { $sort: { categoria: 1 } }
]);



/* 4. Agrupar las películas por categorías y coger sólo:
- nombre
- año
- valoración media calculada
*/

db.movies.aggregate([
    { $unwind: '$genres' },
    {
        $group: {
            _id: '$genres',
            peliculas: {
                $push: {
                    nombre: '$title',
                    año: '$year',
                    valoracionMedia: '$imdb.rating'
                }
            }
        }
    }
]);




