use ('sample_mflix');

// 1. Películas MFlix cuyo año sea mayor o igual al año 2000

db.movies.find({ year: { $gte: 2000 } }) // 12k peliculas



// 2. Películas MFlix cuyo año sea mayor o igual al año 2000 y cuyo idioma esté en español e inglés

db.movies.find({
    year: { $gte: 2000 },
    languages: { $all: ["English", "Spanish"] } // 598 peliculas
})



// 3. Películas MFlix cuyo año sea mayor o igual al año 2000, cuyo idioma esté en español o inglés

db.movies.find({
    year: { $gte: 2000 },
    languages: { $in: ["English", "Spanish"] } // 8.807 peliculas
})



// 4. Películas MFlix cuyo año sea mayor o igual al año 2000 y que el parámetro "viewers" exista

db.movies.find({
    year: { $gte: 2000 },
    "tomatoes.viewer": { $exists: true } // 10.593 peliculas
})



// 5. Películas MFlix cuyo año sea mayor o igual al año 2000 y que tengan al menos 3 directores

db.movies.find({
    year: { $gte: 2000 },
    $expr: {
        $gte: [ { $size: "$directors" }, 3 ]
    }
})
