import { Collection, ObjectId } from "mongodb";
import { mongoDb } from "../config/mongodb.config";
import { Viaje } from "./viaje.model";

export type RolMensaje = "usuario" | "asistente";

export interface MensajeConversacion {
  rol: RolMensaje;
  contenido: string;
  fecha: Date;
}

export type EstadoConversacion = "en_progreso" | "completo";

export interface ConversacionViaje {
  _id?: ObjectId;
  usuarioId: ObjectId;
  mensajes: MensajeConversacion[];
  viaje: Viaje;
  estado: EstadoConversacion;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CrearConversacion = Omit<
  ConversacionViaje,
  "_id" | "createdAt" | "updatedAt"
>;

export function conversacionesCollection(): Collection<ConversacionViaje> {
  return mongoDb().collection<ConversacionViaje>("conversacionesViaje");
}
