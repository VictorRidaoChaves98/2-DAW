// index.js
import express from "express";
import { machineMove } from "./game.js"; // lógica del juego

const app = express();
app.use(express.json()); // Para recibir JSON en POST

// Ruta POST /play
app.post("/play", (req, res) => {
    const gameState = req.body;

    if (!gameState || !gameState.history || !gameState.history.player) {
        return res.status(400).json({ error: "JSON inválido o incompleto" });
    }

    // Si finish es true, devolveremos análisis final
    if (gameState.finish) {
        const playerMoves = gameState.history.player;
        const machineMoves = gameState.history.machine;

        // Patrón simple: jugada más frecuente
        const counts = { piedra: 0, papel: 0, tijeras: 0 };
        playerMoves.forEach(m => counts[m]++);

        const mainPattern = Object.keys(counts).reduce((a, b) =>
            counts[a] > counts[b] ? a : b
        );

        // Predictibilidad aproximada
        let aciertos = 0;
        playerMoves.forEach((p, i) => {
            if (i < machineMoves.length) {
                const beats = { piedra: "papel", papel: "tijeras", tijeras: "piedra" };
                if (machineMoves[i] === beats[p]) aciertos++;
            }
        });
        const predictability = ((aciertos / playerMoves.length) * 100).toFixed(1);

        return res.send(
            `Análisis final de la partida:\n` +
            `- Patrón principal del jugador: ${mainPattern}\n` +
            `- Predictibilidad final: ${predictability}%`
        );
    }


    // Predicción de la máquina
    const result = machineMove(gameState.history);

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(result, null, 2));

});

// Ruta GET / para probar que el servidor funciona
app.get("/", (req, res) => {
    res.send("<h1>Servidor Piedra-Papel-Tijeras activo. Usa POST /play con tu JSON</h1>");
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor activo en http://localhost:${PORT}`);
});
