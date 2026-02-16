import { Router } from "express";
import { getAll, getById, create, update, remove } from "../controllers/notas.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Obtener todas las notas
router.get("/", verifyToken, getAll);

// Obtener una nota por ID
router.get("/:id", verifyToken, getById);

// Crear nota
router.post("/", verifyToken, create);

// Actualizar nota
router.put("/:id", verifyToken, update);

// Eliminar nota
router.delete("/:id", verifyToken, remove);

export default router;
