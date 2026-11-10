import { Award, PartyPopper } from 'lucide-react';
import type { Institucion, Reconocimiento, ReconocimientoEstudiantina } from '../../types';
import { institucionPorId } from '../../data/demo';
import { Escudo } from './Escudo';
import type { ReactNode } from 'react';

interface Props {
  reconocimiento: Reconocimiento;
  instituciones: Institucion[];
  mostrarAcciones?: React.ReactNode;
}

/** Reconocimiento general de las promociones (categorías del ciclo). */
export function TarjetaReconocimiento({ reconocimiento, instituciones, mostrarAcciones }: Props) {
  const institucion = institucionPorId(reconocimiento.institucionId, instituciones);

  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl bg-blanco p-5 shadow-sm ring-1 ring-violeta/10 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-violeta/30">
      <div className="flex items-start justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-violeta">
          <Award size={16} className="shrink-0" />
          {reconocimiento.categoria}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Escudo
          nombre={institucion?.nombre ?? 'Institución'}
          escudo={institucion?.escudo}
          className="h-14 w-14 shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-bold leading-snug text-violeta-oscuro">{institucion?.nombre}</p>
          <p className="text-xs text-negro/60">
            {institucion?.localidad} · Ciclo {reconocimiento.ciclo}
          </p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-negro/75">{reconocimiento.motivo}</p>

      {mostrarAcciones && (
        <div className="mt-auto flex justify-end gap-2 border-t border-violeta/10 pt-3">
          {mostrarAcciones}
        </div>
      )}
    </article>
  );
}

/**
 * Reconocimiento exclusivo de la Estudiantina (Mejor Hinchada).
 * Se muestra separado de los reconocimientos generales.
 */

export function TarjetaMejorHinchada({
  reconocimiento,
  instituciones,
}: {
  reconocimiento: ReconocimientoEstudiantina;
  instituciones: Institucion[];
}) {
  const institucion = institucionPorId(reconocimiento.institucionId, instituciones);

  return (
    <article className="relative isolate overflow-hidden rounded-3xl border border-amarillo-anaranjado/30 bg-gradient-to-br from-amarillo via-amarillo-anaranjado/90 to-amarillo p-6 text-negro shadow-xl rejilla-textura transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-violeta/30">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blanco/30" aria-hidden />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-violeta/15" aria-hidden />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <Escudo
          nombre={institucion?.nombre ?? 'Institución'}
          escudo={institucion?.escudo}
          className="h-20 w-20 shrink-0 rounded-2xl border border-negro/10 bg-blanco p-1.5 shadow-md"
        />

        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-negro/10 bg-blanco/70 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-negro">
            <PartyPopper size={13} />
            Reconocimiento {reconocimiento.ciclo}
          </span>

          <h3 className="mt-3 text-2xl font-black leading-tight text-violeta-oscuro">
            {reconocimiento.nombre}
          </h3>

          <p className="mt-1 text-base font-extrabold text-negro">
            {institucion?.nombre}
          </p>

        </div>
      </div>
    </article>
  );
}

/**
 * Reconocimiento a la institución ganadora de la Estudiantina.
 */
export function TarjetaGanadoraEstudiantina({
  reconocimiento,
  instituciones,
}: {
  reconocimiento: ReconocimientoEstudiantina;
  instituciones: Institucion[];
}) {
  const institucion = institucionPorId(
    reconocimiento.institucionId,
    instituciones
  );

  return (
    <article className="relative isolate overflow-hidden rounded-3xl border border-violeta-oscuro/30 bg-gradient-to-br from-violeta via-violeta-oscuro to-violeta p-6 text-blanco shadow-xl rejilla-textura transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-violeta/30">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amarillo/25" aria-hidden />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-verde/25" aria-hidden />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <Escudo
          nombre={institucion?.nombre ?? 'Institución'}
          escudo={institucion?.escudo}
          className="h-20 w-20 shrink-0 rounded-2xl border border-blanco/30 bg-blanco p-1.5 shadow-md"
        />

        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amarillo/40 bg-amarillo/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amarillo">
            <Award size={13} />
            Campeona {reconocimiento.ciclo}
          </span>

          <h3 className="mt-3 text-2xl font-black leading-tight text-blanco">
            Ganadora de la Estudiantina
          </h3>

          <p className="mt-1 text-base font-extrabold text-amarillo">
            {institucion?.nombre}
          </p>

          <p className="mt-2 text-sm font-medium leading-relaxed text-blanco/90">
            {reconocimiento.nota}
          </p>
        </div>
      </div>
    </article>
  );
}

