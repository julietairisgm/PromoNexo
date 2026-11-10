/* Tipos compartidos del prototipo PromoNexo.
   Los tipos marcados con "datos demo" provienen de datos-demo-promonexo.json. */

export type Rol = 'administrador' | 'delegado';

/* ---------- Datos demo (JSON) ---------- */

export interface Institucion {
  id: string;
  nombre: string;
  localidad: string;
  escudo: string;
  /** Algunas instituciones no participan de la carga de actividades */
  usarEnActividades?: boolean;
}

export type EstadoActividad = 'proxima' | 'finalizada' | 'cancelada';

export interface Actividad {
  id: string;
  nombre: string;
  tipo: string;
  origen: 'estudiantina' | 'municipal' | 'promocion';
  institucionId: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  lugar: string;
  modalidadPago: string;
  estado: EstadoActividad;
  dato: string;
}

export interface Reconocimiento {
  id: string;
  categoria: string;
  institucionId: string;
  ciclo: number;
  motivo: string;
  dato: string;
}

export interface ResultadoRanking {
  posicion: number;
  institucionId: string;
  puntaje: number;
  dato: string;
}

export interface RankingEstudiantina {
  ciclo: number;
  mostrarSoloTop: number;
  podio: number;
  resultados: ResultadoRanking[];
  nota: string;
}

export interface ReconocimientoEstudiantina {
  id: string;
  nombre: string;
  institucionId: string;
  ciclo: number;
  dato: string;
  nota: string;
}

export interface ItemGaleria {
  id: string;
  titulo: string;
  categoria: string;
  imagen: string;
  dato: string;
  institucionId?: string;
}

export interface Anuario {
  id: string;
  ciclo: number;
  titulo: string;
  descripcion: string;
  imagenes: string[];
  rankingReferencia?: string;
  reconocimientosReferencia?: string;
  dato: string;
}

export interface UsuarioDemo {
  id: string;
  usuario: string;
  contrasena: string;
  rol: Rol;
  institucionId?: string;
}

export interface DatosDemo {
  ciclo: number;
  nota: string;
  instituciones: Institucion[];
  rankingEstudiantina: RankingEstudiantina;
  actividades: Actividad[];
  reconocimientos: Reconocimiento[];
  reconocimientoEstudiantina: ReconocimientoEstudiantina;
  galeria: ItemGaleria[];
  anuarios: Anuario[];
  usuariosDemo: UsuarioDemo[];
  recursos: {
    carpetas: Record<string, string>;
    nota: string;
  };
}

/* ---------- Datos locales del prototipo (gestión en paneles) ---------- */

export type EstadoPropuesta = 'borrador' | 'enviada' | 'aprobada';

export interface Propuesta {
  id: string;
  titulo: string;
  descripcion: string;
  institucionId: string;
  fecha: string;
  estado: EstadoPropuesta;
  dato: string;
}

export type EstadoComunicado = 'borrador' | 'publicado';
export type TipoComunicado = 'reunion' | 'informativo';

export interface Comunicado {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: TipoComunicado;
  fechaPublicacion: string;
  fechaReunion?: string;
  horaReunion?: string;
  lugar?: string;
  estado: EstadoComunicado;
  dato: string;
}

export type EstadoEvidencia = 'pendiente' | 'aprobada' | 'rechazada';
export type CategoriaReconocimiento = | 'colaboracion' | 'solidaridad' | 'comunicacion';

export interface ArchivoEvidencia {
  id: string;
  nombre: string;
  tipo: 'imagen' | 'video';
  url: string;
}

export interface Evidencia {
  id: string;
  actividadId?: string;
  accionId?: string;
  institucionId: string;
  categoria: CategoriaReconocimiento;
  titulo: string;
  respuesta: string;
  archivos: ArchivoEvidencia[];
  fecha: string;
  estado: EstadoEvidencia;
  motivoRechazo?: string;
  dato: string;
}

export interface Publicacion {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  fecha: string;
  autor: string;
  estado: 'publicada' | 'borrador';
  dato: string;
}

export interface AccionReconocible {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'colaboracion' | 'solidaridad' | 'comunicacion';
  evidenciaSolicitada: string;
  estado: 'activa' | 'finalizada';
}

/* ---------- Sesión ---------- */

export interface Sesion {
  id: string;
  usuario: string;
  rol: Rol;
  institucionId?: string;
}

export interface Mensaje {
  id: number;
  texto: string;
  tipo: 'exito' | 'error' | 'info';
}
