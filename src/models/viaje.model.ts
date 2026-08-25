import { Usuario } from "./user.model";

export interface Persona {
  edad: number | null;
  tipo: "adulto" | "menor" | "bebe" | null;
}

export interface InformacionTemporal {
  mes: number | null;
  anio: number | null;
  duracionDiasAproximada: number | null;
  flexibilidadDias: number | null;
}

export interface Presupuesto {
  monto: number | null;
  moneda: string | null;
  incluyeTransporte: boolean | null;
}

export interface Viajeros {
  cantidadTotal: number | null;
  personas: Persona[];
}

export interface LugarSalida {
  ciudad: string | null;
  provincia: string | null;
  pais: string | null;
}

export interface LugarPreferido {
  ciudad?: string | null;
  provincia?: string | null;
  pais?: string | null;
  region?: string | null;
}

export interface Destino {
  lugaresPreferidos: LugarPreferido[];
  destinosAbiertos: boolean;
}

export type NivelInteres = "nada" | "poca" | "bastante" | "prioridad";

export interface Preferencias {
  clima: string[];
  tipoViaje: string[];
  intereses: string[];
  ritmoViaje: "tranquilo" | "equilibrado" | "intenso" | null;
  vidaNocturna: NivelInteres | null;
  naturaleza: NivelInteres | null;
  gastronomia: NivelInteres | null;
  cultura: NivelInteres | null;
  socializar: "noImporta" | "meGustaria" | "prioridad" | null;
}

export interface VueloPreferencias {
  clase: "economica" | "premiumEconomy" | "business" | "primeraClase" | null;
  escalas: "sinEscalas" | "maxUna" | "indiferente" | null;
}

export interface Transporte {
  vuelo: VueloPreferencias;
}

export interface Restricciones {
  destinosExcluidos: string[];
  transportesExcluidos: string[];
  actividadesExcluidas: string[];
  restriccionesAlimentarias: string[];
  necesidadesMovilidad: string[];
}

export type UsuarioViaje = Omit<Usuario, "_id" | "createdAt" | "updatedAt"> | null;

/** Perfil de viaje que se va completando progresivamente a lo largo de la conversación. */
export interface Viaje {
  usuario: UsuarioViaje;
  fechaSalida: string | null;
  fechaFin: string | null;
  informacionTemporal: InformacionTemporal;
  presupuesto: Presupuesto;
  viajeros: Viajeros;
  lugarSalida: LugarSalida;
  destino: Destino;
  preferencias: Preferencias;
  transporte: Transporte;
  restricciones: Restricciones;
}

export function crearViajeVacio(): Viaje {
  return {
    usuario: null,
    fechaSalida: null,
    fechaFin: null,
    informacionTemporal: {
      mes: null,
      anio: null,
      duracionDiasAproximada: null,
      flexibilidadDias: null,
    },
    presupuesto: {
      monto: null,
      moneda: null,
      incluyeTransporte: null,
    },
    viajeros: {
      cantidadTotal: null,
      personas: [],
    },
    lugarSalida: {
      ciudad: null,
      provincia: null,
      pais: null,
    },
    destino: {
      lugaresPreferidos: [],
      destinosAbiertos: true,
    },
    preferencias: {
      clima: [],
      tipoViaje: [],
      intereses: [],
      ritmoViaje: null,
      vidaNocturna: null,
      naturaleza: null,
      gastronomia: null,
      cultura: null,
      socializar: null,
    },
    transporte: {
      vuelo: {
        clase: null,
        escalas: null,
      },
    },
    restricciones: {
      destinosExcluidos: [],
      transportesExcluidos: [],
      actividadesExcluidas: [],
      restriccionesAlimentarias: [],
      necesidadesMovilidad: [],
    },
  };
}

export type EstadoViaje = "incompleto" | "listoParaBuscar";

export type TipoPregunta = "siNo" | "opciones" | "texto";

export interface PreguntaViaje {
  campo: string;
  pregunta: string;
  motivo: string;
  tipoPregunta: TipoPregunta;
  /** Solo presente cuando tipoPregunta es "opciones": alternativas para que el usuario elija. */
  opciones?: string[];
}

/** Respuesta que devuelve el modelo en cada turno de la conversación. */
export interface RespuestaExtraccionViaje {
  viaje: Viaje;
  estado: EstadoViaje;
  camposFaltantesImportantes: string[];
  preguntas: PreguntaViaje[];
}

function esVacio(valor: unknown): boolean {
  if (valor === null || valor === undefined) return true;
  if (Array.isArray(valor)) return valor.length === 0;
  return false;
}

function esObjetoPlano(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function fusionarValor(anterior: unknown, nuevo: unknown): unknown {
  if (nuevo === undefined) return anterior;
  if (esVacio(nuevo) && !esVacio(anterior)) return anterior;
  if (esObjetoPlano(anterior) && esObjetoPlano(nuevo)) {
    return fusionarObjeto(anterior, nuevo);
  }
  return nuevo;
}

function fusionarObjeto(
  anterior: Record<string, unknown>,
  nuevo: Record<string, unknown>
): Record<string, unknown> {
  const resultado: Record<string, unknown> = { ...anterior };
  for (const key of Object.keys(nuevo)) {
    resultado[key] = fusionarValor(anterior[key], nuevo[key]);
  }
  return resultado;
}

/**
 * Combina el `viaje` que devuelve la IA en un turno con el que ya se venía
 * acumulando, conservando cualquier dato previamente completado que la IA
 * haya devuelto en `null`/vacío por error en ese turno (el prompt le pide
 * que nunca "olvide" info ya obtenida, pero esto lo garantiza del lado del
 * código en vez de confiar 100% en que el modelo lo respete siempre).
 */
export function fusionarViaje(anterior: Viaje, nuevo: Viaje): Viaje {
  return fusionarObjeto(
    anterior as unknown as Record<string, unknown>,
    nuevo as unknown as Record<string, unknown>
  ) as unknown as Viaje;
}
