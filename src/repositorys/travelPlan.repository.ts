import { ObjectId } from "mongodb";
import {
  CrearTravelPlan,
  travelPlansCollection,
} from "../models/travelPlan.model";

export class TravelPlanRepository {
  static async obtenerTodos() {
    try {
      return await travelPlansCollection()
        .find()
        .sort({ createdAt: -1 })
        .toArray();
    } catch (err) {
      throw new Error("Error al obtener los planes de viaje: " + err);
    }
  }

  static async obtenerPorId(id: string) {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }

      return await travelPlansCollection().findOne({ _id: new ObjectId(id) });
    } catch (err) {
      throw new Error("Error al obtener el plan de viaje: " + err);
    }
  }

  static async crear(travelPlan: CrearTravelPlan) {
    try {
      const now = new Date();
      const nuevoTravelPlan = {
        ...travelPlan,
        createdAt: now,
        updatedAt: now,
      };

      const resultado = await travelPlansCollection().insertOne(nuevoTravelPlan);
      return { _id: resultado.insertedId, ...nuevoTravelPlan };
    } catch (err) {
      throw new Error("Error al guardar el plan de viaje: " + err);
    }
  }
}
