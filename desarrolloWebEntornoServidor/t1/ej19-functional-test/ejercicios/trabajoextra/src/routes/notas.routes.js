import { Router } from "express";
import * as notasController from "../controllers/notas.controller.js";

const router = Router();

router.get("/", notasController.getAll);
router.get("/:id", notasController.getById);
router.post("/", notasController.create);
router.put("/:id", notasController.update);
router.delete("/:id", notasController.remove);

export default router;
