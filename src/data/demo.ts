import json from '../../datos-demo-promonexo.json';
import type { DatosDemo, Institucion, ItemGaleria, Actividad } from '../types';

/**
 * Fuente única de los datos iniciales de demostración.
 * El archivo datos-demo-promonexo.json no se modifica: se lee tal cual.
 */
export const datosDemo = json as unknown as DatosDemo;

export const CICLO = datosDemo.ciclo;
export const NOTA_DEMO = datosDemo.nota;

export const institucionesDemo = datosDemo.instituciones;
export const actividadesDemo = datosDemo.actividades;
export const rankingEstudiantina = datosDemo.rankingEstudiantina;
export const reconocimientosDemo = datosDemo.reconocimientos;
export const mejorHinchada = datosDemo.reconocimientoEstudiantina;
export const galeriaDemo = datosDemo.galeria;
export const anuariosDemo = datosDemo.anuarios;
export const usuariosDemo = datosDemo.usuariosDemo;

/* ---------------- Instituciones ---------------- */

export function institucionPorId(
  id: string | undefined,
  lista: Institucion[] = institucionesDemo
): Institucion | undefined {
  if (!id) return undefined;
  return lista.find((i) => i.id === id);
}

export function nombreInstitucion(
  id: string | undefined,
  lista: Institucion[] = institucionesDemo
): string {
  return institucionPorId(id, lista)?.nombre ?? 'Institución no encontrada';
}

/** Instituciones habilitadas para cargar actividades (respeta "usarEnActividades": false). */
export function institucionesParaActividades(lista: Institucion[]): Institucion[] {
  return lista.filter((i) => i.usarEnActividades !== false);
}

/* ---------------- Imágenes ilustrativas ---------------- */

/**
 * Fotografías ilustrativas asociadas a cada actividad.
 * La elección de reina y la Estudiantina se muestran también en la galería pública;
 * las fotos de actividades (Bingo, Eco Emprende, Expo Técnica, Actividades estudiantiles)
 * se reutilizan aquí como imágenes de las actividades correspondientes.
 */
export const imagenesActividad: Record<string, string> = {
  'actividad-01': '/images/galeria/bingo-estudiantil.jpg',
  'actividad-03': '/images/galeria/eco-emprende.jpg',
  'actividad-05': '/images/galeria/eleccion-reina.jpg',
  'actividad-06': '/images/galeria/expo-tecnica.jpg',
  'actividad-07': '/images/galeria/expo-tecnica.jpg',
};

export const imagenGeneralActividades = '/images/galeria/actividades-estudiantiles.jpg';

export function imagenDeActividad(idActividad: string): string | undefined {
  return imagenesActividad[idActividad];
}

/* ---------------- Galería ---------------- */

const TEMAS_GALERIA_ACTUAL = /reina|departamental|estudiantina/i;

/**
 * La galería actual contiene únicamente fotografías de:
 * elección de reina, elección departamental y Estudiantina (según especificación).
 * El resto de las imágenes del JSON se usan como ilustraciones de Actividades.
 */
export function esGaleriaActual(item: ItemGaleria): boolean {
  return TEMAS_GALERIA_ACTUAL.test(item.titulo) || TEMAS_GALERIA_ACTUAL.test(item.categoria);
}

export function galeriaActual(lista: ItemGaleria[] = galeriaDemo): ItemGaleria[] {
  return lista.filter(esGaleriaActual);
}

/** Relaciona una foto con su institución cuando el título coincide con una actividad. */
export function institucionDeGaleria(item: ItemGaleria, actividades: Actividad[]): string | undefined {
  if (item.institucionId) return item.institucionId;
  const relacionada = actividades.find(
    (a) => a.nombre.trim().toLowerCase() === item.titulo.trim().toLowerCase()
  );
  return relacionada?.institucionId;
}
