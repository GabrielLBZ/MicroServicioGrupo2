import { Collection, ObjectId } from "mongodb";
import { mongoDb } from "../config/mongodb.config";
import { Viaje } from "./viaje.model";

export interface ViajeSurvey {
  _id?: ObjectId;
  usuarioId: ObjectId;
  conversacionId: ObjectId;
  viaje: Viaje;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CrearViajeSurvey = Omit<ViajeSurvey, "_id" | "createdAt" | "updatedAt">;

export function viajesSurveyCollection(): Collection<ViajeSurvey> {
  return mongoDb().collection<ViajeSurvey>("viajesSurvey");
}
