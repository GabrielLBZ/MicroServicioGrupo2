import {
  CrearViajeSurvey,
  viajesSurveyCollection,
} from "../models/viajeSurvey.model";

export class ViajeSurveyRepository {
  static async crear(viajeSurvey: CrearViajeSurvey) {
    try {
      const now = new Date();
      const nuevoViajeSurvey = {
        ...viajeSurvey,
        createdAt: now,
        updatedAt: now,
      };

      const resultado = await viajesSurveyCollection().insertOne(nuevoViajeSurvey);
      return { _id: resultado.insertedId, ...nuevoViajeSurvey };
    } catch (err) {
      throw new Error("Error al guardar el viaje para survey: " + err);
    }
  }
}
