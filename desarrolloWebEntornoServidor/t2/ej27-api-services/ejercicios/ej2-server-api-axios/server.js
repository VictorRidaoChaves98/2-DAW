const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

const API_BASE =
    "https://crisis-core-materia-fusion-api-546461677134.us-central1.run.app";

/**
 * Ruta puente principal
 * GET /api/materia
 * Soporta filtros y paginado
 */
app.get("/api/materia", async (req, res) => {
    const { name, type, page = 1, limit = 5 } = req.query;

    try {
        const response = await axios.get(`${API_BASE}/materia`);
        let materia = response.data;

        // 🔍 Filtro por nombre
        if (name) {
            materia = materia.filter(m =>
                m.name.toLowerCase().includes(name.toLowerCase())
            );
        }

        // 🔍 Filtro por tipo (si existe en los datos)
        if (type) {
            materia = materia.filter(m =>
                m.type?.toLowerCase().includes(type.toLowerCase())
            );
        }

        // 📄 Paginado
        const start = (page - 1) * limit;
        const end = start + Number(limit);
        const paginatedData = materia.slice(start, end);

        res.json({
            page: Number(page),
            limit: Number(limit),
            total: materia.length,
            data: paginatedData
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al consumir la API externa"
        });
    }
});

/**
 * Ruta de estado de la API externa
 * GET /api/status
 */
app.get("/api/status", async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE}/status`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: "No se pudo obtener el estado del servicio"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
