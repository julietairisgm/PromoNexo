
import { CalendarDays, Clock, FileText, MapPin, Megaphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaginaPanel, EstadoVacio, Tarjeta  } from '../../components/ui/Tarjeta';
import { formatearFecha } from '../../utils';

export function DelegadoComunicados() {
  const { comunicados } = useApp();

  const comunicadosPublicados = comunicados
    .filter((comunicado) => comunicado.estado === 'publicado')
    .sort((a, b) => b.fechaPublicacion.localeCompare(a.fechaPublicacion));

  const reuniones = comunicadosPublicados.filter(
    (comunicado) =>
      comunicado.tipo === 'reunion' &&
      comunicado.fechaReunion &&
      comunicado.fechaReunion >= new Date().toISOString().slice(0, 10)
  );

  return (
    <PaginaPanel
      titulo="Comunicados"
      descripcion="Consultá los avisos y las novedades compartidas por la Dirección de Juventud."
    >
      {comunicadosPublicados.length === 0 ? (
        <EstadoVacio
          icono={<Megaphone size={28} />}
          titulo="Todavía no hay comunicados"
          mensaje="Cuando la Municipalidad publique un aviso, vas a poder consultarlo desde acá."
        />
      ) : (
        <div className="space-y-">
          {reuniones.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-violeta-oscuro">
                Próximas reuniones
              </h2>

              {reuniones.map((comunicado) => (
                <Tarjeta key={comunicado.id}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violeta/10 text-violeta">
                      <CalendarDays size={23} />
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <span className="inline-flex rounded-full bg-verde/15 px-3 py-1 text-xs font-bold text-verde">
                        Reunión
                      </span>

                      <h3 className="text-lg font-bold text-violeta-oscuro">
                        {comunicado.titulo}
                      </h3>

                      <p className="text-sm leading-relaxed text-negro/70">
                        {comunicado.descripcion}
                      </p>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-sm text-negro/65">
                        {comunicado.fechaReunion && (
                          <span className="flex items-center gap-2">
                            <CalendarDays size={16} />
                            {formatearFecha(comunicado.fechaReunion)}
                          </span>
                        )}

                        {comunicado.horaReunion && (
                          <span className="flex items-center gap-2">
                            <Clock size={16} />
                            {comunicado.horaReunion}
                          </span>
                        )}

                        {comunicado.lugar && (
                          <span className="flex items-center gap-2">
                            <MapPin size={16} />
                            {comunicado.lugar}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Tarjeta>
              ))}
            </section>
          )}

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-violeta-oscuro">
              Todos los comunicados
            </h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {comunicadosPublicados.map((comunicado) => (
<Tarjeta key={comunicado.id} className="p-5 sm:p-6">
  <div className="space-y-3">
    {/* Información del comunicado */}
    <div className="space-y-2">

      {/* Estados */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
            comunicado.estado === 'publicado'
              ? 'bg-verde/15 text-verde'
              : 'bg-amarillo/25 text-amarillo-anaranjado'
          }`}
        >
          {comunicado.estado === 'publicado' ? 'Publicado' : 'Borrador'}
        </span>

        <span className="rounded-full bg-violeta/10 px-2.5 py-1 text-[11px] font-bold text-violeta">
          {comunicado.tipo === 'reunion' ? 'Reunión' : 'Informativo'}
        </span>
      </div>

      {/* Título y descripción */}
      <div className="space-y-1">
        <h3 className="text-xl font-extrabold text-violeta-oscuro">
          {comunicado.titulo}
        </h3>

        <p className="whitespace-pre-line text-sm leading-5 text-negro/70">
          {comunicado.descripcion}
        </p>
      </div>

      {/* Fecha, hora y lugar */}
      <div className="space-y-1.5 pt-2">
        {comunicado.fechaReunion && (
          <span className="flex items-center gap-2 text-sm text-negro/70">
            <CalendarDays size={15} className="shrink-0 text-violeta" />
            {formatearFecha(comunicado.fechaReunion)}
          </span>
        )}

        {comunicado.horaReunion && (
          <span className="flex items-center gap-2 text-sm text-negro/70">
            <Clock size={15} className="shrink-0 text-violeta" />
            {comunicado.horaReunion}
          </span>
        )}

        {comunicado.lugar && (
          <span className="flex items-center gap-2 text-sm text-negro/70">
            <MapPin size={15} className="shrink-0 text-violeta" />
            {comunicado.lugar}
          </span>
        )}
      </div>
    </div>
  </div>
</Tarjeta>
  ))}
  </div>
          </section>
        </div>
      )}
    </PaginaPanel>
  );
}
