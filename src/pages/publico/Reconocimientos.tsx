import { Award, HeartHandshake, Info,Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CICLO, mejorHinchada } from '../../data/demo';
import { EncabezadoSeccion, EstadoVacio } from '../../components/ui/Tarjeta';
import { TarjetaMejorHinchada, TarjetaReconocimiento } from '../../components/dominio/TarjetaReconocimiento';

export function Reconocimientos() {
  const { reconocimientos, instituciones, tablaEstrellas } = useApp();

  return (
    <>
      {/* Encabezado */}
      <section className="bg-gradient-to-br from-violeta via-violeta-oscuro to-violeta text-blanco rejilla-textura">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="text-xs font-black uppercase tracking-widest text-amarillo">
            Ciclo {CICLO}
          </span>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Reconocimientos</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blanco/85 sm:text-base">
            Reconocimientos generales de las promociones y reconocimiento exclusivo a la Mejor
            Hinchada de la Estudiantina.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        {/* 1) Reconocimientos generales */}
        <section>
          <EncabezadoSeccion
            titulo="Reconocimientos generales"
            descripcion="Premios a las promociones por sus acciones durante el ciclo."
            accion={
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amarillo/30 px-3 py-1 text-xs font-bold text-violeta ring-1 ring-amarillo-anaranjado/60">
                <Award size={14} /> Generales
              </span>
            }
          />

          {reconocimientos.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reconocimientos.map((reconocimiento) => (
                <TarjetaReconocimiento
                  key={reconocimiento.id}
                  reconocimiento={reconocimiento}
                  instituciones={instituciones}
                />
              ))}
            </div>
          ) : (
            <EstadoVacio
              titulo="Sin reconocimientos generales"
              mensaje="Cuando se publiquen nuevos reconocimientos generales van a aparecer en esta sección."
              icono={<Award size={34} />}
            />
          )}
        </section>

        {/* TABLA DE ESTRELLAS */}
<section className="overflow-hidden rounded-2xl border border-violeta/10 bg-blanco shadow-sm">
  <div className="border-b border-violeta/10 bg-blanco p-5">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amarillo/60 text-violeta-oscuro">
        <Star size={23} />
      </div>

      <div>
        <h2 className="text-lg font-extrabold text-violeta-oscuro">
          Participación por promociones
        </h2>
        <p className="text-sm text-negro/60">
          Estrellas obtenidas mediante evidencias aprobadas · Ciclo {CICLO}
        </p>
      </div>
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full min-w-[650px] text-left text-sm">
      <thead className="bg-negro text-xs font-bold uppercase text-blanco">
        <tr>
          <th className="px-5 py-4">Institución</th>
          <th className="px-4 py-4 text-center">Colaboración</th>
          <th className="px-4 py-4 text-center">Solidaridad</th>
          <th className="px-4 py-4 text-center">Difusión</th>
          <th className="px-5 py-4 text-center">Total</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-humo">
        {instituciones.map((institucion) => {
          const fila = tablaEstrellas.find(
            (f) => f.institucionId === institucion.id
          );

          const total = fila?.total ?? 0;

          return (
            <tr key={institucion.id} className="transition hover:bg-violeta/5">
              <td className="px-5 py-4 font-bold text-negro">
                {institucion.nombre}
              </td>

              <td className="px-4 py-4 text-center">
                <span className="inline-flex items-center gap-1 font-bold">
                  <Star size={15} className="fill-amarillo text-amarillo-anaranjado" />
                  {fila?.colaboracion ?? 0}
                </span>
              </td>

              <td className="px-4 py-4 text-center">
                <span className="inline-flex items-center gap-1 font-bold">
                  <Star size={15} className="fill-amarillo text-amarillo-anaranjado" />
                  {fila?.solidaridad ?? 0}
                </span>
              </td>

              <td className="px-4 py-4 text-center">
                <span className="inline-flex items-center gap-1 font-bold">
                  <Star size={15} className="fill-amarillo text-amarillo-anaranjado" />
                  {fila?.comunicacion ?? 0}
                </span>
              </td>

              <td className="px-5 py-4 text-center">
                <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-violeta/10 px-3 py-1.5 font-black text-violeta-oscuro">
                  {total}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
  </section>

        {/* 3) Separación entre categorías */}
        <div className="flex items-start gap-3 rounded-2xl bg-blanco p-8 ring-1 ring-violeta/10">
          <Info size={20} className="mt-0.5 shrink-0 text-violeta" />
          <p className="text-sm leading-relaxed text-negro/70">
            Las <strong className="text-violeta-oscuro">puntuaciones competitivas</strong> de la
            Estudiantina y los <strong className="text-violeta-oscuro">reconocimientos generales</strong>{' '}
            se mantienen separados: los puntajes corresponden al ciclo competitivo, mientras que
            los reconocimientos premian acciones y trayectorias de las promociones. La Mejor Hinchada
            forma parte exclusivamente de la Estudiantina.
          </p>
        </div>
      </div>
    </>
  );
}
