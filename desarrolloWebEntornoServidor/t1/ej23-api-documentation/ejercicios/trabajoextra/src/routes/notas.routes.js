import { Router } from "express";
import multer from "multer";
import { getAll, getById, create, update, remove, importNotes, exportNotes } from "../controllers/notas.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    let folder = 'others';
    if (ext === '.note') folder = 'notes';
    else if (ext === '.pdf') folder = 'pdf';
    const dest = path.join(process.cwd(), 'files', folder);
    try { if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true }); } catch (e) { /* ignore */ }
    cb(null, dest);
  },
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

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
