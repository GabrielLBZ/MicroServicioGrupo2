import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Falta GEMINI_API_KEY en las variables de entorno");
}

const ai = new GoogleGenAI({
  apiKey,
});

export class GeminiService {
  static async generarRespuesta(prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    return response.text ?? "";
  }
}