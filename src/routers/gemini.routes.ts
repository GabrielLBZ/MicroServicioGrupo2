import { Router } from "express";
import { GeminiController } from "../controllers/gemini.controller";

const router = Router();

router.post("/preguntar", GeminiController.preguntar);

export default router;