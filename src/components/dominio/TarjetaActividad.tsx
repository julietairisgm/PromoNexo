import { Link } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, MapPin, Ticket } from 'lucide-react';
import type { Actividad, Institucion } from '../../types';
import { institucionPorId } from '../../data/demo';
import { formatearFecha } from '../../utils';
import { Escudo } from './Escudo';
import { Etiqueta, EtiquetaEstadoActividad } from '../ui/Etiquetas';
import { Boton } from '../ui/Boton';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  actividad: Actividad;
  instituciones: Institucion[];
}

export function TarjetaActividad({ actividad, instituciones }: Props) {
  const institucion = institucionPorId(actividad.institucionId, instituciones);
  const [modalAbierto, setModalAbierto] = useState(false);
  
  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-2xl bg-blanco shadow-sm ring-1 ring-violeta/10 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-violeta/30">

        {/* Etiquetas */}
        <div className="relative h-10">
          <span className="absolute left-3 top-3">
            <Etiqueta tono="negro">{actividad.tipo}</Etiqueta>
          </span>

          <span className="absolute right-3 top-3">
            <EtiquetaEstadoActividad estado={actividad.estado} />
          </span>
        </div>

        {/* Información */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-violeta-oscuro transition group-hover:text-violeta">
            {actividad.nombre}
          </h3>

          <ul className="space-y-1.5 text-sm text-negro/70">
            <li className="flex items-center gap-2">
              <CalendarDays size={15} className="shrink-0 text-verde" />
              {formatearFecha(actividad.fecha)} · {actividad.hora} h
            </li>

            <li className="flex items-center gap-2">
              <MapPin size={15} className="shrink-0 text-amarillo-anaranjado" />
              <span className="truncate">{actividad.lugar}</span>
            </li>

            <li className="flex items-center gap-2">
              <Ticket size={15} className="shrink-0 text-violeta" />
              {actividad.modalidadPago === 'sin pago'
                ? 'Sin pago'
                : `Pago ${actividad.modalidadPago}`}
            </li>
          </ul>

          {/* Institución y botón de detalle */}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-humo pt-3">
            <span className="flex min-w-0 items-center gap-2">
              <Escudo
                nombre={institucion?.nombre ?? 'Institución'}
                escudo={institucion?.escudo}
                className="h-8 w-8 shrink-0"
              />

              <span className="truncate text-xs font-semibold text-violeta-oscuro">
                {institucion?.nombre ?? 'Institución'}
              </span>
            </span>

            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              className="flex shrink-0 items-center gap-1 text-xs font-bold text-violeta transition hover:text-violeta-oscuro"
            >
              Ver detalle <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </article>

      {/* Modal de detalle */}
      {modalAbierto && createPortal (
        <div
  className="fixed inset-0 z-[9999] flex items-center justify-center bg-negro/20 p-4 backdrop-blur-xs"
  onClick={() => setModalAbierto(false)}
>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`titulo-actividad-${actividad.id}`}
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-blanco shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado */}
            <div className="flex items-start justify-between gap-4 border-b border-humo p-5">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Etiqueta tono="negro">{actividad.tipo}</Etiqueta>
                  <EtiquetaEstadoActividad estado={actividad.estado} />
                </div>

                <h2
                  id={`titulo-actividad-${actividad.id}`}
                  className="text-xl font-extrabold text-violeta-oscuro"
                >
                  {actividad.nombre}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                aria-label="Cerrar detalle"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-negro/60 transition hover:bg-violeta/10 hover:text-violeta"
              >
                ✕
              </button>
            </div>

            {/* Contenido */}
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <CalendarDays size={19} className="shrink-0 text-verde" />
                <div>
                  <p className="text-xs font-semibold text-negro/50">Fecha y hora</p>
                  <p className="text-sm font-medium text-negro">
                    {formatearFecha(actividad.fecha)} · {actividad.hora} h
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={19} className="shrink-0 text-amarillo-anaranjado" />
                <div>
                  <p className="text-xs font-semibold text-negro/50">Lugar</p>
                  <p className="text-sm font-medium text-negro">
                    {actividad.lugar}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Ticket size={19} className="shrink-0 text-violeta" />
                <div>
                  <p className="text-xs font-semibold text-negro/50">Modalidad de pago</p>
                  <p className="text-sm font-medium text-negro">
                    {actividad.modalidadPago === 'sin pago'
                      ? 'Sin pago'
                      : `Pago ${actividad.modalidadPago}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-humo pt-4">
                <Escudo
                  nombre={institucion?.nombre ?? 'Institución'}
                  escudo={institucion?.escudo}
                  className="h-10 w-10 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-negro/50">
                    Organiza
                  </p>
                  <p className="truncate text-sm font-semibold text-violeta-oscuro">
                    {institucion?.nombre ?? 'Institución'}
                  </p>
                </div>
              </div>
            </div>

            {/* Pie */}
            <div className="flex justify-end border-t border-humo p-4">
              <Boton
                variante="secundario"
                tamano="chico"
                onClick={() => setModalAbierto(false)}
              >
                Cerrar
              </Boton>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
