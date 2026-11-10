import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { imagenDeActividad, institucionPorId } from '../../data/demo';
import { esDatoDemo, formatearFecha } from '../../utils';
import { BotonEnlace } from '../../components/ui/Boton';
import { EstadoVacio } from '../../components/ui/Tarjeta';
import { EtiquetaEstadoActividad } from '../../components/ui/Etiquetas';
import { Escudo } from '../../components/dominio/Escudo';
import { Imagen } from '../../components/dominio/Imagen';
import { TarjetaActividad } from '../../components/dominio/TarjetaActividad';

export function ActividadDetalle() {
  const { id } = useParams();
  const { actividades, instituciones } = useApp();

  const actividad = actividades.find((a) => a.id === id);

  if (!actividad) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EstadoVacio
          titulo="Actividad no encontrada"
          mensaje="La actividad que buscás no existe o fue eliminada de la demostración."
          icono={<CalendarDays size={34} />}
        >
          <BotonEnlace to="/actividades" variante="primario" tamano="chico">
            Volver a actividades
          </BotonEnlace>
        </EstadoVacio>
      </section>
    );
  }

  const institucion = institucionPorId(actividad.institucionId, instituciones);
  const imagen = imagenDeActividad(actividad.id);
  const relacionadas = actividades
    .filter((a) => a.institucionId === actividad.institucionId && a.id !== actividad.id)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/actividades"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-violeta transition hover:text-violeta-oscuro"
      >
        <ArrowLeft size={16} /> Volver a actividades
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl bg-blanco shadow-sm ring-1 ring-violeta/10">
        <div className="relative h-56 bg-violeta sm:h-64">
          <Imagen
            src={imagen}
            alt={actividad.nombre}
            etiqueta={imagen ? 'Imagen pendiente' : 'Sin fotografía de la actividad'}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-negro/85 to-transparent p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-amarillo px-3 py-1 text-[11px] font-black uppercase tracking-wider text-negro">
                {actividad.tipo}
              </span>
              <EtiquetaEstadoActividad estado={actividad.estado} />
              {esDatoDemo(actividad.dato)}
            </div>
            <h1 className="mt-3 text-2xl font-black leading-tight text-blanco sm:text-3xl">
              {actividad.nombre}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-[1.6fr_1fr]">
          {/* Información principal */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-violeta">
              Información de la actividad
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 rounded-xl bg-fondo px-4 py-3 ring-1 ring-violeta/10">
                <CalendarDays size={18} className="mt-0.5 shrink-0 text-verde" />
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wide text-negro/50">
                    Fecha
                  </span>
                  <span className="text-sm font-semibold text-negro">
                    {formatearFecha(actividad.fecha)}
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-xl bg-fondo px-4 py-3 ring-1 ring-violeta/10">
                <Clock size={18} className="mt-0.5 shrink-0 text-violeta" />
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wide text-negro/50">
                    Hora
                  </span>
                  <span className="text-sm font-semibold text-negro">{actividad.hora} h</span>
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-xl bg-fondo px-4 py-3 ring-1 ring-violeta/10">
                <MapPin size={18} className="mt-0.5 shrink-0 text-amarillo-anaranjado" />
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wide text-negro/50">
                    Lugar
                  </span>
                  <span className="text-sm font-semibold text-negro">{actividad.lugar}</span>
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-xl bg-fondo px-4 py-3 ring-1 ring-violeta/10">
                <Ticket size={18} className="mt-0.5 shrink-0 text-violeta-oscuro" />
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wide text-negro/50">
                    Modalidad de pago
                  </span>
                  <span className="text-sm font-semibold text-negro">
                    {actividad.modalidadPago === 'sin pago'
                      ? 'Sin pago'
                      : `Pago ${actividad.modalidadPago}`}
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Institución */}
          <aside className="rounded-2xl bg-gradient-to-br from-violeta/10 to-blanco p-5 ring-1 ring-violeta/15">
            <h2 className="text-sm font-black uppercase tracking-wide text-violeta">
              Institución organizadora
            </h2>
            <div className="mt-4 flex items-center gap-4">
              <Escudo
                nombre={institucion?.nombre ?? 'Institución'}
                escudo={institucion?.escudo}
                className="h-16 w-16 shrink-0"
                mostrarLeyenda
              />
              <div className="min-w-0">
                <p className="text-sm font-bold leading-snug text-violeta-oscuro">
                  {institucion?.nombre ?? 'Institución no encontrada'}
                </p>
                <p className="mt-1 text-xs text-negro/60">{institucion?.localidad}</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-negro/60">
              Los datos de esta actividad provienen de la demostración del prototipo y se muestran
              tal como fueron cargados en el JSON inicial.
            </p>
          </aside>
        </div>
      </div>

      {/* Otras actividades de la institución */}
      {relacionadas.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-extrabold text-violeta-oscuro">
            Otras actividades de {institucion?.nombre}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relacionadas.map((relacionada) => (
              <TarjetaActividad
                key={relacionada.id}
                actividad={relacionada}
                instituciones={instituciones}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
