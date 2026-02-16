import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from '../config/env.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  const adminUser = config.ADMIN_USER;
  const adminPass = config.ADMIN_PASS;
  const jwtSecret = config.JWT_SECRET;
  const jwtExpires = config.JWT_EXPIRES_IN;

  if (!username || !password)
    return res.status(400).json({ message: "Faltan datos" });

  if (!adminUser || !adminPass || !jwtSecret) {
    console.error("Auth env vars missing", {
      hasAdminUser: Boolean(adminUser),
      hasAdminPass: Boolean(adminPass),
      hasJwtSecret: Boolean(jwtSecret)
    });
    return res.status(500).json({ message: "Error de configuración del servidor" });
  }

  // No revelar si es usuario o contraseña lo que falla
  if (username !== adminUser)
    return res.status(401).json({ message: "Usuario o contraseña incorrectos" });

  let passwordCorrect = false;
  try {
    // Si adminPass parece un hash bcrypt (ej.: empieza por $2), usar compare
    if (typeof adminPass === "string" && adminPass.startsWith("$2")) {
      passwordCorrect = await bcrypt.compare(password, adminPass);
    } else {
      // adminPass en texto plano en .env (no recomendado en producción)
      passwordCorrect = password === adminPass;
    }
  } catch (err) {
    console.error("Error verificando contraseña:", err);
    return res.status(500).json({ message: "Error interno" });
  }

  if (!passwordCorrect)
    return res.status(401).json({ message: "Usuario o contraseña incorrectos" });

  let token;
  try {
    token = jwt.sign({ username: adminUser, role: "admin" }, jwtSecret, { expiresIn: jwtExpires });
  } catch (err) {
    console.error("Error firmando JWT:", err);
    return res.status(500).json({ message: "Error interno" });
  }

  return res.json({ message: "Login correcto", token, expiresIn: jwtExpires });
};

// Devuelve solo el token como texto plano (útil para scripts/curl simples)
export const tokenOnly = async (req, res) => {
  const { username, password } = req.body;

  const adminUser = config.ADMIN_USER;
  const adminPass = config.ADMIN_PASS;
  const jwtSecret = config.JWT_SECRET;
  const jwtExpires = config.JWT_EXPIRES_IN;

  if (!username || !password)
    return res.status(400).json({ message: "Faltan datos" });

  if (!adminUser || !adminPass || !jwtSecret) {
    console.error("Auth env vars missing");
    return res.status(500).json({ message: "Error de configuración del servidor" });
  }

  let passwordCorrect = false;
  try {
    if (typeof adminPass === "string" && adminPass.startsWith("$2")) {
      passwordCorrect = await bcrypt.compare(password, adminPass);
    } else {
      passwordCorrect = password === adminPass;
    }
  } catch (err) {
    console.error("Error verificando contraseña:", err);
    return res.status(500).json({ message: "Error interno" });
  }

  if (!passwordCorrect)
    return res.status(401).json({ message: "Usuario o contraseña incorrectos" });

  let token;
  try {
    token = jwt.sign({ username: adminUser, role: "admin" }, jwtSecret, { expiresIn: jwtExpires });
  } catch (err) {
    console.error("Error firmando JWT:", err);
    return res.status(500).json({ message: "Error interno" });
  }

  return res.type("text").send(token);
};
