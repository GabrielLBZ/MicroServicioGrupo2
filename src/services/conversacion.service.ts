import { GoogleGenAI } from "@google/genai";
import { ObjectId } from "mongodb";
import {
  PROMPT_EXTRACCION_VIAJE,
  crearEntradaExtraccionViaje,
} from "../models/promtIA.model";
import { crearViajeVacio, RespuestaExtraccionViaje, Viaje } from "../models/viaje.model";
import { ConversacionRepository } from "../repositorys/conversacion.repository";
import { UsuariosRepository } from "../repositorys/user.repository";

export class ConversacionError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

type GeminiResponse = {
  text?: string;
};

export class ConversacionService {
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

  static async obtenerPorId(id: string) {
    return await ConversacionRepository.obtenerPorId(id);
  }

  static async enviarMensaje(
    usuarioId: string,
    mensajeUsuario: string,
    conversacionId?: string
  ) {
    if (!ObjectId.isValid(usuarioId)) {
      throw new ConversacionError("usuarioId inválido", 400);
    }

    const usuario = await UsuariosRepository.obtenerPorId(usuarioId);

    if (!usuario) {
      throw new ConversacionError("Usuario no encontrado", 404);
    }

    let conversacion = conversacionId
      ? await ConversacionRepository.obtenerPorId(conversacionId)
      : null;

    if (conversacionId && !conversacion) {
      throw new ConversacionError("Conversación no encontrada", 404);
    }

    if (!conversacion) {
      conversacion = await ConversacionRepository.obtenerEnProgresoPorUsuario(
        new ObjectId(usuarioId)
      );
    }

    if (!conversacion) {
      conversacion = await ConversacionRepository.crear({
        usuarioId: new ObjectId(usuarioId),
        mensajes: [],
        viaje: crearViajeVacio(),
        estado: "en_progreso",
      });
    }

    if (conversacion.estado === "completo") {
      throw new ConversacionError(
        "La conversación ya finalizó con la información necesaria",
        409
      );
    }

    const fechaActual = new Date().toISOString().slice(0, 10);
    const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

    const contents = crearEntradaExtraccionViaje(
      fechaActual,
      conversacion.viaje,
      mensajeUsuario
    );

    const response = (await this.getGeminiClient().models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: PROMPT_EXTRACCION_VIAJE,
        responseMimeType: "application/json",
      },
    })) as GeminiResponse;

    const texto = response.text ?? "";
    let respuestaIA: Partial<RespuestaExtraccionViaje>;

    try {
      respuestaIA = JSON.parse(texto);
    } catch (err) {
      throw new Error("La IA devolvió una respuesta que no es JSON válido: " + texto);
    }

    const viajeActualizado: Viaje = respuestaIA.viaje ?? conversacion.viaje;
    viajeActualizado.usuario = {
      nombre: usuario.nombre,
      email: usuario.email,
      edad: usuario.edad,
    };

    const estadoIA = respuestaIA.estado === "listoParaBuscar" ? "listoParaBuscar" : "incompleto";
    const preguntas = respuestaIA.preguntas ?? [];
    const camposFaltantesImportantes = respuestaIA.camposFaltantesImportantes ?? [];

    const mensajeAsistente =
      estadoIA === "listoParaBuscar"
        ? "Ya tengo la información necesaria para buscar recomendaciones de viaje."
        : preguntas.map((p) => p.pregunta).join(" ");

    const nuevosMensajes = [
      ...conversacion.mensajes,
      { rol: "usuario" as const, contenido: mensajeUsuario, fecha: new Date() },
      { rol: "asistente" as const, contenido: mensajeAsistente, fecha: new Date() },
    ];

    const estadoConversacion = estadoIA === "listoParaBuscar" ? "completo" : "en_progreso";

    const conversacionActualizada = await ConversacionRepository.actualizar(
      conversacion._id!.toString(),
      {
        mensajes: nuevosMensajes,
        viaje: viajeActualizado,
        estado: estadoConversacion,
      }
    );

    return {
      conversacionId: conversacionActualizada!._id!.toString(),
      estado: estadoIA,
      mensaje: mensajeAsistente,
      viaje: viajeActualizado,
      camposFaltantesImportantes,
      preguntas,
    };
  }
}
