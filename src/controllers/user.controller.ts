import { Request, Response, NextFunction } from "express";
import { UsuariosService } from "../services/user.service";

export class UsuariosController {
  static async obtenerTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarios = await UsuariosService.obtenerTodos();
      res.json(usuarios);
    } catch (err) {
      next(err);
    }
  }

  static async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = await UsuariosService.obtenerPorId(req.params.id);

      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      res.json(usuario);
    } catch (err) {
      next(err);
    }
  }

  static async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = await UsuariosService.crear(req.body);
      res.status(201).json(usuario);
    } catch (err) {
      next(err);
    }
  }

  static async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = await UsuariosService.actualizar(req.params.id, req.body);

      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      res.json(usuario);
    } catch (err) {
      next(err);
    }
  }

  static async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const eliminado = await UsuariosService.eliminar(req.params.id);

      if (!eliminado) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
