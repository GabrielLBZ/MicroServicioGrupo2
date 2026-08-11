import { NextFunction, Request, Response } from "express";
import { TravelPlanService } from "../services/travelPlan.service";

export class TravelPlanController {
  static async obtenerTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const travelPlans = await TravelPlanService.obtenerTodos();
      res.json(travelPlans);
    } catch (err) {
      next(err);
    }
  }

  static async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const travelPlan = await TravelPlanService.obtenerPorId(req.params.id);

      if (!travelPlan) {
        return res.status(404).json({ mensaje: "Plan de viaje no encontrado" });
      }

      res.json(travelPlan);
    } catch (err) {
      next(err);
    }
  }

  static async generarDesdePrompt(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const prompt = req.body.prompt || req.body.promt;

      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({
          mensaje: "Debes enviar un prompt como cadena de texto",
        });
      }

      const travelPlan = await TravelPlanService.generarDesdePrompt(prompt);
      res.status(201).json(travelPlan);
    } catch (err) {
      next(err);
    }
  }
}
