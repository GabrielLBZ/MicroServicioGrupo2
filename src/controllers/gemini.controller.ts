import type { Request, Response } from "express";
import { GeminiService } from "../services/gemini.service";

export class GeminiController {
  static async preguntar(req: Request, res: Response): Promise<void> {
    try {
      const { mensaje } = req.body;

      if (!mensaje || typeof mensaje !== "string") {
        res.status(400).json({
          ok: false,
          mensaje: "Debés enviar un mensaje",
        });
        return;
      }

      const respuesta = await GeminiService.generarRespuesta(mensaje);

      res.status(200).json({
        ok: true,
        respuesta,
      });
    } catch (error) {
      console.error("Error Gemini:", error);

      res.status(500).json({
        ok: false,
        mensaje: "Error al consultar Gemini",
      });
    }
  }
}