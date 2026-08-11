import { Router } from "express";
import { UsuariosController } from "../controllers/user.controller";

const router = Router();

router.get("/", UsuariosController.obtenerTodos);
router.get("/:id", UsuariosController.obtenerPorId);
router.post("/", UsuariosController.crear);
router.put("/:id", UsuariosController.actualizar);
router.delete("/:id", UsuariosController.eliminar);

export default router;
