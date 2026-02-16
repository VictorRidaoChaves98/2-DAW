const express = require("express");
const app = express();

app.use(express.json());

// Datos de ejemplo
const items = [
    { id: 1, titulo: "Repasar paginado en NodeJS", categoria: "estudio", texto: "Revisar filtrado, orden y paginado", fecha: "2025-12-01", tam: 20 },
    { id: 2, titulo: "Comprar regalo cumpleaños", categoria: "personal", texto: "Buscar algo útil y económico", fecha: "2025-11-20", tam: 15 },
    { id: 3, titulo: "Proyecto final DWES", categoria: "estudio", texto: "Implementar API completa con Express", fecha: "2025-11-15", tam: 120 },
    { id: 4, titulo: "Entrenamiento pierna", categoria: "salud", texto: "Hacer sentadillas y prensa", fecha: "2025-12-03", tam: 30 },
    { id: 5, titulo: "Leer artículo sobre Express", categoria: "estudio", texto: "Profundizar en middleware y rutas", fecha: "2025-10-10", tam: 45 },
    { id: 6, titulo: "Preparar cena Navidad", categoria: "personal", texto: "Comprar ingredientes y plan menú", fecha: "2025-12-05", tam: 60 },
    { id: 7, titulo: "Revisar notas del examen", categoria: "estudio", texto: "Analizar resultados y puntos débiles", fecha: "2025-11-25", tam: 25 }
];

// GET con filtros, ordenación y paginación
app.get("/items", (req, res) => {
    let {
        page = 1,
        limit = 5,
        sort = "id",
        order = "asc",
        minTam,
        maxTam,
        titulo,
        texto,
        categoria,
        desde,
        hasta
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let results = [...items];

    // Filtros numéricos
    if (minTam) results = results.filter(i => i.tam >= parseInt(minTam));
    if (maxTam) results = results.filter(i => i.tam <= parseInt(maxTam));

    // Filtros de texto
    if (titulo) results = results.filter(i => i.titulo.toLowerCase().includes(titulo.toLowerCase()));
    if (texto) results = results.filter(i => i.texto.toLowerCase().includes(texto.toLowerCase()));
    if (categoria) results = results.filter(i => i.categoria.toLowerCase() === categoria.toLowerCase());

    // Filtros por fecha
    if (desde) results = results.filter(i => new Date(i.fecha) >= new Date(desde));
    if (hasta) results = results.filter(i => new Date(i.fecha) <= new Date(hasta));

    // Ordenación
    results.sort((a, b) => {
        const fieldA = a[sort];
        const fieldB = b[sort];

        if (typeof fieldA === "string" && typeof fieldB === "string") {
            return order === "desc"
                ? fieldB.localeCompare(fieldA)
                : fieldA.localeCompare(fieldB);
        }
        if (typeof fieldA === "number" && typeof fieldB === "number") {
            return order === "desc" ? fieldB - fieldA : fieldA - fieldB;
        }
        if (sort === "fecha") {
            return order === "desc"
                ? new Date(fieldB) - new Date(fieldA)
                : new Date(fieldA) - new Date(fieldB);
        }
        return 0;
    });

    // Paginación
    const start = (page - 1) * limit;
    const end = start + limit;

    res.json({
        page,
        total: results.length,
        pages: Math.ceil(results.length / limit),
        data: results.slice(start, end)
    });
});

// Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
