import { Collection, ObjectId } from "mongodb";
import { mongoDb } from "../config/mongodb.config";

export interface TravelPlan {
  _id?: ObjectId;
  prompt: string;
  geminiPrompt: string;
  respuesta: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CrearTravelPlan = Omit<TravelPlan, "_id" | "createdAt" | "updatedAt">;

export function travelPlansCollection(): Collection<TravelPlan> {
  return mongoDb().collection<TravelPlan>("travelPlans");
}
