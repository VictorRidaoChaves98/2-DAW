import { Router } from "express";
import { login, tokenOnly } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/token", tokenOnly);

export default router;
