import { ObjectId } from "mongodb";
import {
  ConversacionViaje,
  CrearConversacion,
  conversacionesCollection,
} from "../models/conversacionViaje.model";
import { Viaje } from "../models/viaje.model";

export class ConversacionRepository {
  static async obtenerPorId(id: string) {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }

      return await conversacionesCollection().findOne({ _id: new ObjectId(id) });
    } catch (err) {
      throw new Error("Error al obtener la conversación: " + err);
    }
  }

  static async obtenerEnProgresoPorUsuario(usuarioId: ObjectId) {
    try {
      return await conversacionesCollection()
        .find({ usuarioId, estado: "en_progreso" })
        .sort({ updatedAt: -1 })
        .limit(1)
        .next();
    } catch (err) {
      throw new Error(
        "Error al buscar la conversación en progreso del usuario: " + err
      );
    }
  }

  static async crear(conversacion: CrearConversacion) {
    try {
      const now = new Date();
      const nuevaConversacion = {
        ...conversacion,
        createdAt: now,
        updatedAt: now,
      };

      const resultado = await conversacionesCollection().insertOne(nuevaConversacion);
      return { _id: resultado.insertedId, ...nuevaConversacion };
    } catch (err) {
      throw new Error("Error al crear la conversación: " + err);
    }
  }

  static async actualizar(
    id: string,
    cambios: {
      mensajes: ConversacionViaje["mensajes"];
      viaje: Viaje;
      estado: ConversacionViaje["estado"];
    }
  ) {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }

      return await conversacionesCollection().findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...cambios, updatedAt: new Date() } },
        { returnDocument: "after" }
      );
    } catch (err) {
      throw new Error("Error al actualizar la conversación: " + err);
    }
  }
}
