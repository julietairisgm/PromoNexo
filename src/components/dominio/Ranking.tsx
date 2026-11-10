import type { Institucion, ResultadoRanking } from '../../types';
import { institucionPorId } from '../../data/demo';
import { cx, formatearPuntaje } from '../../utils';
import { Escudo } from './Escudo';
import { Crown } from 'lucide-react';

interface Props {
  resultados: ResultadoRanking[];
  instituciones: Institucion[];
}

/** Podio visual de las tres primeras posiciones de la Estudiantina. */
export function Podio({ resultados, instituciones }: Props) {
  const primero = resultados.find((r) => r.posicion === 1);
  const segundo = resultados.find((r) => r.posicion === 2);
  const tercero = resultados.find((r) => r.posicion === 3);

  const orden = [segundo, primero, tercero].filter(Boolean) as ResultadoRanking[];

  const plataformas: Record<number, string> = {
    1: 'bg-gradient-to-b from-[#F9D976] to-[#D4A017] h-24 sm:h-32',
    2: 'bg-gradient-to-b from-[#E8E8E8] to-[#A7A7A7] h-16 sm:h-24',
    3: 'bg-gradient-to-b from-[#D99A6C] to-[#A65E35] h-12 sm:h-16',
  };

  const coloresTexto: Record<number, string> = {
    1: 'text-[#765000]',
    2: 'text-[#454545]',
    3: 'text-[#FFFFFF]',
  };

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6">
      {orden.map((resultado) => {
        const institucion = institucionPorId(
          resultado.institucionId,
          instituciones
        );

        return (
          <div
            key={resultado.posicion}
            className="flex w-28 flex-col items-center sm:w-44"
          >
            {/* Escudo y datos, sin tarjeta */}
            <div className="mb-4 flex w-full flex-col items-center text-center">
              {resultado.posicion === 1 && (
                <Crown
                  size={24}
                  className="mb-2 fill-[#D4A017] text-[#D4A017]"
                />
              )}

              <Escudo
                nombre={institucion?.nombre ?? 'Institución'}
                escudo={institucion?.escudo}
                className="h-24 w-24 object-contain sm:h-32 sm:w-32"
              />

              {/*<p className="mt-3 line-clamp-3 text-xs font-bold leading-snug text-violeta-oscuro sm:text-sm">
                {institucion?.nombre ?? 'Institución'}
              </p>*/}

              <p className="mt-1 text-base font-extrabold text-violeta sm:text-xl">
                {formatearPuntaje(resultado.puntaje)} pts
              </p>
            </div>

            {/* Plataforma metálica */}
            <div
              className={cx(
                'flex w-full items-start justify-center rounded-t-2xl border border-black/5 pt-3 shadow-sm',
                plataformas[resultado.posicion],
                coloresTexto[resultado.posicion]
              )}
            >
              <span className="text-2xl font-black sm:text-3xl">
                {resultado.posicion}°
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Tabla con las cinco primeras posiciones (no se muestran posiciones adicionales). */
export function TablaPuntuaciones({ resultados, instituciones }: Props) {
  const filas = [...resultados].sort((a, b) => a.posicion - b.posicion);

  return (
    <div className="overflow-x-auto rounded-2xl bg-blanco shadow-sm ring-1 ring-negro/10">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="bg-amarillo text-left text-[11px] uppercase tracking-wider text-violeta-oscuro">
            <th className="px-4 py-3 font-bold">Posición</th>
            <th className="px-4 py-3 font-bold">Institución</th>
            <th className="px-4 py-3 text-right font-bold">Puntaje</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-humo">
          {filas.map((resultado) => {
            const institucion = institucionPorId(resultado.institucionId, instituciones);
            return (
              <tr key={`${resultado.posicion}-${resultado.institucionId}`} className="transition hover:bg-amarillo/35">
                <td className="px-4 py-3">
                  <span
                    className={cx(
                      'inline-flex h-8 w-8 items-center justify-center rounded-full text-md font-black'
                    )}
                  >
                    {resultado.posicion}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    <Escudo
                      nombre={institucion?.nombre ?? 'Institución'}
                      escudo={institucion?.escudo}
                      className="h-9 w-9 shrink-0"
                    />
                    <span className="font-semibold leading-snug text-negro">{institucion?.nombre}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-extrabold text-violeta">
                  {formatearPuntaje(resultado.puntaje)}
                  <span className="ml-1 text-xs font-semibold text-negro/50">pts</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Barras horizontales de puntaje (panel municipal / resultados). */
export function BarrasPuntuaciones({ resultados, instituciones }: Props) {
  const maximo = Math.max(...resultados.map((r) => r.puntaje), 1);
  return (
    <ul className="space-y-3">
      {[...resultados]
        .sort((a, b) => a.posicion - b.posicion)
        .map((resultado) => {
          const institucion = institucionPorId(resultado.institucionId, instituciones);
          return (
            <li key={`${resultado.posicion}-${resultado.institucionId}`}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
                <span className="font-semibold text-violeta-oscuro">
                  {resultado.posicion}° · {institucion?.nombre}
                </span>
                <span className="font-extrabold text-violeta">{formatearPuntaje(resultado.puntaje)}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-violeta/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violeta to-amarillo transition-all duration-500"
                  style={{ width: `${Math.round((resultado.puntaje / maximo) * 100)}%` }}
                />
              </div>
            </li>
          );
        })}
    </ul>
  );
}
