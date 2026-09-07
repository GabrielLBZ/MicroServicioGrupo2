import { Router } from "express";
import { ConversacionController } from "../controllers/conversacion.controller";

const router = Router();

router.post("/mensaje", ConversacionController.enviarMensaje);
router.get("/", ConversacionController.listar);
router.get("/:id", ConversacionController.obtenerPorId);

export default router;