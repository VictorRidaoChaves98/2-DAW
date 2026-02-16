// src/middlewares/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const ADMIN_USER = process.env.ADMIN_USER;

if (!JWT_SECRET) {
  console.warn("⚠️  JWT_SECRET no definido en variables de entorno.");
}
if (!ADMIN_USER) {
  console.warn("⚠️  ADMIN_USER no definido en variables de entorno.");
}

// Genera token JWT que contiene { username, role }
export function generateToken(username, role = "user") {
  const payload = { username, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Middleware: valida token Bearer y añade req.user
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { username, role, iat, exp }
    return next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
}

// Middleware: solo admin (compara username con ADMIN_USER)
export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "No autenticado" });

  if (req.user.username !== ADMIN_USER) {
    return res.status(403).json({ message: "Acceso reservado a administradores" });
  }
  next();
}
