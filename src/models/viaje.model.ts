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

export interface PreguntaViaje {
  campo: string;
  pregunta: string;
  motivo: string;
}

/** Respuesta que devuelve el modelo en cada turno de la conversación. */
export interface RespuestaExtraccionViaje {
  viaje: Viaje;
  estado: EstadoViaje;
  camposFaltantesImportantes: string[];
  preguntas: PreguntaViaje[];
}
