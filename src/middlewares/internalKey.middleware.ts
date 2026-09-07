 import { Request, Response, NextFunction } from "express";

 export function requireInternalKey(req: Request, res: Response, next: NextFunction) {
   const esperado = process.env.INTERNAL_KEY;

   if (!esperado) {
     console.error("[internalKey] INTERNAL_KEY no está configurado — rechazando por seguridad");
     return res.status(500).json({ mensaje: "El servicio no tiene configurado INTERNAL_KEY" });
   }

   if (req.headers["x-internal-key"] !== esperado) {
     return res.status(401).json({ mensaje: "x-internal-key ausente o inválido: esta ruta solo puede ser llamada por el Gateway" });
   }

   next();
}