// index.js
import express from "express";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

// Mensaje secreto original
const secretMessage = "I know your secret";

// Generamos un hash del mensaje secreto (simula el token que tendría el cliente)
const saltRounds = 10;
let tokenHash;

bcrypt.hash(secretMessage, saltRounds).then(hash => {
    tokenHash = hash;
    console.log("Token hash generado:", tokenHash);
});

// Middleware para validar token
const authMiddleware = async (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Token requerido" });

    try {
        const isValid = await bcrypt.compare(token, tokenHash);
        if (isValid) {
            next(); // Acceso permitido
        } else {
            res.status(403).json({ message: "Token inválido" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al verificar token" });
    }
};

// Ruta protegida con middleware
app.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "¡Acceso concedido!" });
});

// Servidor
app.listen(3000, () => console.log("Servidor iniciado en http://localhost:3000"));
