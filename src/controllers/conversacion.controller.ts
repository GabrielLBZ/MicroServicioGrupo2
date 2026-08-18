import { NextFunction, Request, Response } from "express";
import { ConversacionError, ConversacionService } from "../services/conversacion.service";

export class ConversacionController {
  static async enviarMensaje(req: Request, res: Response, next: NextFunction) {
    try {
      const { usuarioId, mensaje, conversacionId } = req.body;

      if (!usuarioId || typeof usuarioId !== "string") {
        return res.status(400).json({ mensaje: "Debes enviar un usuarioId" });
      }

      if (!mensaje || typeof mensaje !== "string") {
        return res.status(400).json({ mensaje: "Debes enviar un mensaje" });
      }

      const resultado = await ConversacionService.enviarMensaje(
        usuarioId,
        mensaje,
        conversacionId
      );

      res.status(200).json(resultado);
    } catch (err) {
      if (err instanceof ConversacionError) {
        return res.status(err.statusCode).json({ mensaje: err.message });
      }

      next(err);
    }
  }

  static async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const conversacion = await ConversacionService.obtenerPorId(req.params.id);

      if (!conversacion) {
        return res.status(404).json({ mensaje: "Conversación no encontrada" });
      }

      res.json(conversacion);
    } catch (err) {
      next(err);
    }
  }
}
