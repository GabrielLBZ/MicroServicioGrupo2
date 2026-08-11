import { ObjectId } from "mongodb";
import {
  ActualizarUsuario,
  CrearUsuario,
  usuariosCollection,
} from "../models/user.model";

export class UsuariosRepository {
  static async obtenerTodos() {
    try {
      return await usuariosCollection().find().sort({ createdAt: -1 }).toArray();
    } catch (err) {
      throw new Error("Error al obtener los usuarios: " + err);
    }
  }

  static async obtenerPorId(id: string) {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }

      return await usuariosCollection().findOne({ _id: new ObjectId(id) });
    } catch (err) {
      throw new Error("Error al obtener el usuario: " + err);
    }
  }

  static async crear(usuario: CrearUsuario) {
    try {
      const now = new Date();
      const nuevoUsuario = {
        ...usuario,
        createdAt: now,
        updatedAt: now,
      };

      const resultado = await usuariosCollection().insertOne(nuevoUsuario);
      return { _id: resultado.insertedId, ...nuevoUsuario };
    } catch (err) {
      throw new Error("Error al crear el usuario: " + err);
    }
  }

  static async actualizar(id: string, usuario: ActualizarUsuario) {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }

      const resultado = await usuariosCollection().findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...usuario, updatedAt: new Date() } },
        { returnDocument: "after" }
      );

      return resultado;
    } catch (err) {
      throw new Error("Error al actualizar el usuario: " + err);
    }
  }

  static async eliminar(id: string) {
    try {
      if (!ObjectId.isValid(id)) {
        return false;
      }

      const resultado = await usuariosCollection().deleteOne({
        _id: new ObjectId(id),
      });

      return resultado.deletedCount === 1;
    } catch (err) {
      throw new Error("Error al eliminar el usuario: " + err);
    }
  }
}
