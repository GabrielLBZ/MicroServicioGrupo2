import { Router } from "express";
import { TravelPlanController } from "../controllers/travelPlan.controller";

const router = Router();

router.get("/", TravelPlanController.obtenerTodos);
router.get("/:id", TravelPlanController.obtenerPorId);
router.post("/generar", TravelPlanController.generarDesdePrompt);

export default router;
