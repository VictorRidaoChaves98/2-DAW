// chat-backend/index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db"); // Asegúrate de tener db.js configurado

// Forzar uso de UTF-8 en la conexión (ayuda con tildes/emoji)
db.query("SET NAMES utf8mb4").catch(err => console.error("Error setting connection charset:", err));

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Simple users table creation (if it doesn't exist) at startup
db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`).catch(err => console.error("Error ensuring users table:", err));

// 🔹 Crear nueva conversación
app.post("/conversations", async (req, res) => {
    try {
        const { name } = req.body;
        const [result] = await db.query("INSERT INTO conversations (name) VALUES (?)", [name || "Nueva conversación"]);
        res.json({ id: result.insertId, name: name || "Nueva conversación" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Registro de usuario
const bcrypt = require('bcryptjs');

app.post('/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'username and password required' });

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const [result] = await db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
        res.json({ id: result.insertId, username });
    } catch (err) {
        if (err && err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'username_exists' });
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Login
app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'username and password required' });

        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];
        if (!user) return res.status(401).json({ error: 'invalid_credentials' });

        const ok = bcrypt.compareSync(password, user.password_hash);
        if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

        // For simplicity return user id and username (no JWT)
        res.json({ id: user.id, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Listar todas las conversaciones
app.get("/conversations", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM conversations ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Obtener mensajes de una conversación
app.get("/conversations/:id/messages", async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
            [id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Agregar un mensaje a una conversación
app.post("/conversations/:id/messages", async (req, res) => {
    try {
        const { id } = req.params;
        const { role, content } = req.body;
        const [result] = await db.query(
            "INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)",
            [id, role, content]
        );
        res.json({ id: result.insertId, role, content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Eliminar conversación (y sus mensajes automáticamente)
app.delete("/conversations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM conversations WHERE id = ?", [id]);
        res.json({ deleted: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
