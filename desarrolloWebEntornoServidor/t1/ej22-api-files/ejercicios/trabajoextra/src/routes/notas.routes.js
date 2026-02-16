import { Router } from "express";
import multer from "multer";
import { getAll, getById, create, update, remove, importNotes, exportNotes } from "../controllers/notas.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Obtener todas las notas
router.get("/", verifyToken, getAll);
// Crear nota
router.post("/", verifyToken, create);

// Importar ficheros .note (subida de uno o varios)
router.post("/import", verifyToken, upload.array("files"), importNotes);

// Exportar notas que cumplan filtros: descarga un .note o un .zip
router.get("/export", verifyToken, exportNotes);

// Obtener una nota por ID (ruta parametrizada debe ir después de las estáticas)
router.get("/:id", verifyToken, getById);
// Actualizar nota
router.put("/:id", verifyToken, update);

// Eliminar nota
router.delete("/:id", verifyToken, remove);

export default router;
