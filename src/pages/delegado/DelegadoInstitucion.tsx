import { Award, CalendarDays, FileText, MapPin, School } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaginaPanel, EstadoVacio, Tarjeta, TarjetaDato } from '../../components/ui/Tarjeta';
import { Etiqueta, EtiquetaEstadoActividad, EtiquetaEstadoPropuesta } from '../../components/ui/Etiquetas';
import { Escudo } from '../../components/dominio/Escudo';
import { TarjetaGanadoraEstudiantina, TarjetaMejorHinchada, TarjetaReconocimiento } from '../../components/dominio/TarjetaReconocimiento';

export function DelegadoInstitucion() {
  const { sesion, instituciones, actividades, propuestas, reconocimientos, evidencias, } = useApp();

  const institucion = instituciones.find((i) => i.id === sesion?.institucionId);

  if (!institucion) {
    return (
      <PaginaPanel titulo="Mi institución" descripcion="No se encontró la institución asignada.">
        <EstadoVacio
          titulo="Sin institución asignada"
          mensaje="Contactá al administrador municipal para que asigne tu institución a la delegación."
          icono={<School size={34} />}
        />
      </PaginaPanel>
    );
  }

  const misActividades = actividades.filter((a) => a.institucionId === institucion.id);
  const misEvidencias = evidencias.filter((e) => e.institucionId === institucion.id);
  const misReconocimientos = reconocimientos.filter((r) => r.institucionId === institucion.id);

  return (
    <PaginaPanel
      titulo="Mi institución"
      descripcion="Información de la institución que representás. El delegado solo puede consultarla y no puede editar sus datos."
    >
      {/* Ficha */}
      <Tarjeta className="overflow-hidden">
        <div className="bg-gradient-to-r from-violeta to-violeta-oscuro p-6 text-blanco rejilla-textura">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Escudo
              nombre={institucion.nombre}
              escudo={institucion.escudo}
              className="h-24 w-24 shrink-0 rounded-2xl bg-blanco p-2"
            />
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amarillo px-3 py-1 text-[11px] font-black uppercase tracking-wider text-negro">
                <School size={13} /> Institución
              </span>
              <h2 className="mt-3 text-xl font-extrabold leading-snug sm:text-2xl">
                {institucion.nombre}
              </h2>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-blanco/85">
                <MapPin size={15} /> {institucion.localidad}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-violeta">Resumen</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 rounded-xl bg-fondo px-4 py-3 ring-1 ring-violeta/10">
                <dt className="flex items-center gap-2 text-negro/70">
                  <CalendarDays size={16} className="text-verde" /> Actividades cargadas
                </dt>
                <dd className="font-extrabold text-violeta-oscuro">{misActividades.length}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl bg-fondo px-4 py-3 ring-1 ring-violeta/10">
                <dt className="flex items-center gap-2 text-negro/70">
                  <FileText size={16} className="text-violeta" /> Evidencias cargadas
                </dt>
                <dd className="font-extrabold text-violeta-oscuro">{misEvidencias.length}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl bg-fondo px-4 py-3 ring-1 ring-violeta/10">
                <dt className="flex items-center gap-2 text-negro/70">
                  <Award size={16} className="text-amarillo-anaranjado" /> Reconocimientos
                </dt>
                <dd className="font-extrabold text-violeta-oscuro">{misReconocimientos.length}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-verde">
              Reconocimientos de la institución
            </h3>
            <div>

  {misReconocimientos.length > 0 ? (
    <div className="mt-4 space-y-4">
      {misReconocimientos.map((reconocimiento) => (
        <TarjetaReconocimiento
          key={reconocimiento.id}
          reconocimiento={reconocimiento}
          instituciones={instituciones}
        />
      ))}
    </div>
  ) : (
    <p className="mt-4 rounded-xl bg-fondo px-4 py-3 text-sm text-negro/60 ring-1 ring-violeta/10">
      Esta institución todavía no tiene reconocimientos cargados.
    </p>
  )}
</div>
          </div>
        </div>
      </Tarjeta>

      {/* Propuestas recientes */}
      <section>
        <h2 className="mb-4 text-lg font-extrabold text-violeta-oscuro">Actividades recientes</h2>
        {misActividades.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {misActividades.map((actividades) => (
              <Tarjeta key={actividades.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-md font-bold text-violeta-oscuro">{actividades.nombre}</h3>
                  <EtiquetaEstadoActividad estado={actividades.estado} />
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-negro/70">
                  {actividades.tipo}
                </p>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-negro">
                  {actividades.fecha} - {actividades.hora}
                </p>
              </Tarjeta>
            ))}
          </div>
        ) : (
          <EstadoVacio
            titulo="Sin propuestas"
            mensaje="Todavía no cargaste propuestas para tu institución."
            icono={<FileText size={34} />}
          />
        )}
      </section>
    </PaginaPanel>
  );
}
