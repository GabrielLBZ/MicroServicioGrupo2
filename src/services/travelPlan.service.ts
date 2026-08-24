import { GoogleGenAI } from "@google/genai";
import { crearPromptTravelPlan } from "../models/promtIA.model";
import { TravelPlanRepository } from "../repositorys/travelPlan.repository";

type GeminiResponse = {
  text?: string;
};

export class TravelPlanService {
  private static geminiClient: GoogleGenAI | null = null;

  private static getGeminiClient() {
    if (this.geminiClient) {
      return this.geminiClient;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Falta GEMINI_API_KEY en las variables de entorno");
    }

    this.geminiClient = new GoogleGenAI({ apiKey });
    return this.geminiClient;
  }

  static async obtenerTodos() {
    return await TravelPlanRepository.obtenerTodos();
  }

  static async obtenerPorId(id: string) {
    return await TravelPlanRepository.obtenerPorId(id);
  }

  static async generarDesdePrompt(promptUsuario: string) {
    const geminiPrompt = crearPromptTravelPlan(promptUsuario);
    const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

    const response = (await this.getGeminiClient().models.generateContent({
      model,
      contents: geminiPrompt,
    })) as GeminiResponse;

    const respuesta = response.text || "";

    return await TravelPlanRepository.crear({
      prompt: promptUsuario,
      geminiPrompt,
      respuesta,
    });
  }
}
