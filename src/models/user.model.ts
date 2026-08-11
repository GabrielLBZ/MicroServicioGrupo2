import { Collection, ObjectId } from "mongodb";
import { mongoDb } from "../config/mongodb.config";

export interface Usuario {
  _id?: ObjectId;
  nombre: string;
  email: string;
  edad?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CrearUsuario = Omit<Usuario, "_id" | "createdAt" | "updatedAt">;
export type ActualizarUsuario = Partial<CrearUsuario>;

export function usuariosCollection(): Collection<Usuario> {
  return mongoDb().collection<Usuario>("usuarios");
}
