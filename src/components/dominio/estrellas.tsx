import type { Evidencia, Institucion } from '../../types';

export interface FilaEstrellas {
  institucionId: string;
  colaboracion: number;
  solidaridad: number;
  comunicacion: number;
  total: number;
}

export function calcularTablaEstrellas(
  instituciones: Institucion[],
  evidencias: Evidencia[],
  ciclo: number
): FilaEstrellas[] {
  return instituciones.map((institucion) => {
    const aprobadas = evidencias.filter(
      (e) =>
        e.institucionId === institucion.id &&
        e.estado === 'aprobada' &&
        new Date(`${e.fecha}T00:00:00`).getFullYear() === ciclo
    );

    const colaboracion = aprobadas.filter(
      (e) => e.categoria === 'colaboracion'
    ).length;

    const solidaridad = aprobadas.filter(
      (e) => e.categoria === 'solidaridad'
    ).length;

    const comunicacion = aprobadas.filter(
      (e) => e.categoria === 'comunicacion'
    ).length;

    return {
      institucionId: institucion.id,
      colaboracion,
      solidaridad,
      comunicacion,
      total: colaboracion + solidaridad + comunicacion,
    };
  });
}