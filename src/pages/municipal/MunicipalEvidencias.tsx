import { useMemo, useState } from 'react';
import { CalendarDays, Check, ClipboardCheck, FileText, Image, Video, X,} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Evidencia, EstadoEvidencia } from '../../types';
import { formatearFecha } from '../../utils';
import { Boton } from '../../components/ui/Boton';
import { Buscador, EstadoVacio, PaginaPanel, Tarjeta, TarjetaDato, } from '../../components/ui/Tarjeta';
import { Campo, Seleccion } from '../../components/ui/Campos';
import { EtiquetaEstadoEvidencia } from '../../components/ui/Etiquetas';
import { Confirmacion } from '../../components/ui/Confirmacion';

interface AccionEvidencia {
  evidencia: Evidencia;
  estado: EstadoEvidencia;
}

export function MunicipalEvidencias() {
  const {
    evidencias,
    actividades,
    instituciones,
    validarEvidencia,
  } = useApp();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [accion, setAccion] = useState<AccionEvidencia | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  const conteos = useMemo(() => ({
      pendientes: evidencias.filter((e) => e.estado === 'pendiente').length,
      aprobadas: evidencias.filter((e) => e.estado === 'aprobada').length,
      rechazadas: evidencias.filter((e) => e.estado === 'rechazada').length,
    }),
    [evidencias]
  );

  // Solo se muestran envíos de evidencias existentes.
  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return evidencias.filter((evidencia) => {
      const institucion = instituciones.find((i) => i.id === evidencia.institucionId);
      const actividad = actividades.find((a) => a.id === evidencia.actividadId);
      const coincideBusqueda = !texto || evidencia.titulo.toLowerCase().includes(texto) || evidencia.respuesta.toLowerCase().includes(texto) || institucion?.nombre.toLowerCase().includes(texto) || actividad?.nombre.toLowerCase().includes(texto);
      const coincideEstado = filtroEstado === 'todos' || evidencia.estado === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }, [evidencias, instituciones, actividades, busqueda, filtroEstado]);

  const confirmar = () => {
    if (!accion) return;

    if (
      accion.estado === 'rechazada' &&
      !motivoRechazo.trim()
    ) {
      return;
    }

    validarEvidencia(
      accion.evidencia.id,
      accion.estado,
      accion.estado === 'rechazada' ? motivoRechazo.trim() : undefined
    );

    setAccion(null);
    setMotivoRechazo('');
  };

  const cancelar = () => {
    setAccion(null);
    setMotivoRechazo('');
  };

  return (
    <PaginaPanel
      titulo="Gestión de evidencias"
      descripcion="Revisá las presentaciones enviadas por los delegados, consultá sus archivos adjuntos y validá su participación."
    >
      {/* Resumen */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TarjetaDato
          valor={conteos.pendientes}
          texto="Pendientes de revisión"
          icono={<ClipboardCheck size={18} />}
        />

        <TarjetaDato
          valor={conteos.aprobadas}
          texto="Aprobadas"
          icono={<Check size={18} />}
        />

        <TarjetaDato
          valor={conteos.rechazadas}
          texto="Rechazadas"
          icono={<X size={18} />}
        />
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Buscador
          valor={busqueda}
          onCambio={setBusqueda}
          placeholder="Buscar por promoción, acción o descripción..."
          etiqueta="Buscar evidencias"
        />

        <Campo etiqueta="Estado de validación">
          <Seleccion
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobada">Aprobadas</option>
            <option value="rechazada">Rechazadas</option>
          </Seleccion>
        </Campo>
      </div>

      {/* Resultados */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold text-violeta-oscuro">
          Presentaciones recibidas
        </h2>

        <span className="text-xs font-semibold text-negro/55">
          {filtradas.length}{' '}
          {filtradas.length === 1 ? 'presentación' : 'presentaciones'}
        </span>
      </div>

      {/* Listado */}
      {filtradas.length > 0 ? (
        <div className="space-y-5">
          {filtradas.map((evidencia) => {
            const institucion = instituciones.find(
              (i) => i.id === evidencia.institucionId
            );

            const actividad = actividades.find(
              (a) => a.id === evidencia.actividadId
            );

            const esActividad = Boolean(evidencia.actividadId);

            return (
              <Tarjeta key={evidencia.id} className="p-5">
                {/* Encabezado */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-violeta/10 px-3 py-1 text-xs font-bold text-violeta">
                        {esActividad
                          ? 'Actividad municipal'
                          : 'Acción reconocible'}
                      </span>

                      <EtiquetaEstadoEvidencia estado={evidencia.estado} />
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-violeta-oscuro">
                      {evidencia.titulo}
                    </h3>

                    <p className="mt-1 text-sm text-negro/65">
                      <span className="font-semibold">Promoción:</span>{' '}
                      {institucion?.nombre ?? 'Institución no disponible'}
                    </p>

                    {esActividad && (
                      <p className="mt-1 text-sm text-negro/65">
                        <span className="font-semibold">Actividad:</span>{' '}
                        {actividad?.nombre ?? 'Actividad no disponible'}
                      </p>
                    )}

                    <p className="mt-2 flex items-center gap-1.5 text-xs text-negro/50">
                      <CalendarDays size={14} />
                      Presentada el {formatearFecha(evidencia.fecha)}
                    </p>
                  </div>
                </div>

                {/* Respuesta del delegado */}
                <div className="mt-5 rounded-xl bg-fondo p-4">
                  <h4 className="text-sm font-bold text-violeta-oscuro">
                    Descripción de la participación
                  </h4>

                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-negro/75">
                    {evidencia.respuesta}
                  </p>
                </div>

                {/* Archivos adjuntos */}
                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-violeta-oscuro">
                      <FileText size={17} />
                      Archivos adjuntos
                    </h4>

                    <span className="text-xs text-negro/50">
                      {evidencia.archivos.length}{' '}
                      {evidencia.archivos.length === 1
                        ? 'archivo'
                        : 'archivos'}
                    </span>
                  </div>

                  {evidencia.archivos.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {evidencia.archivos.map((archivo) => (
                        <div
                          key={archivo.id}
                          className="overflow-hidden rounded-xl border border-negro/10 bg-white"
                        >
                          {archivo.tipo === 'imagen' ? (
                            <a
                              href={archivo.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block"
                            >
                              <img
                                src={archivo.url}
                                alt={archivo.nombre}
                                className="h-44 w-full object-cover"
                              />
                            </a>
                          ) : (
                            <video
                              src={archivo.url}
                              controls
                              preload="metadata"
                              className="h-44 w-full bg-negro object-contain"
                            />
                          )}

                          <div className="flex items-center gap-2 p-3">
                            {archivo.tipo === 'imagen' ? (
                              <Image size={16} className="shrink-0 text-violeta" />
                            ) : (
                              <Video size={16} className="shrink-0 text-violeta" />
                            )}

                            <span className="truncate text-xs font-medium text-negro/70">
                              {archivo.nombre}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-dashed border-negro/20 p-4 text-sm text-negro/50">
                      Esta presentación no contiene archivos adjuntos.
                    </p>
                  )}
                </div>

                {/* Motivo de rechazo anterior */}
                {evidencia.estado === 'rechazada' &&
                  evidencia.motivoRechazo && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="text-sm font-bold text-red-700">
                        Motivo del rechazo
                      </p>

                      <p className="mt-1 text-sm text-red-700/80">
                        {evidencia.motivoRechazo}
                      </p>
                    </div>
                  )}

                {/* Acciones */}
                <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-negro/10 pt-4">
                  <Boton
                    variante="peligro"
                    tamano="chico"
                    disabled={evidencia.estado === 'rechazada'}
                    onClick={() => {
                      setMotivoRechazo('');
                      setAccion({ evidencia, estado: 'rechazada' });
                    }}
                    icono={<X size={15} />}
                  >
                    Rechazar
                  </Boton>

                  <Boton
                    variante="verde"
                    tamano="chico"
                    disabled={evidencia.estado === 'aprobada'}
                    onClick={() =>
                      setAccion({ evidencia, estado: 'aprobada' })
                    }
                    icono={<Check size={15} />}
                  >
                    Aprobar
                  </Boton>
                </div>
              </Tarjeta>
            );
          })}
        </div>
      ) : (
        <EstadoVacio
          titulo="No hay evidencias para mostrar"
          mensaje="Las presentaciones enviadas por los delegados aparecerán aquí para su revisión."
          icono={<ClipboardCheck size={34} />}
        />
      )}

      {/* Confirmación de aprobación */}
      <Confirmacion
        abierto={accion?.estado === 'aprobada'}
        titulo="Aprobar evidencia"
        mensaje={
          accion
            ? `Se aprobará la presentación "${accion.evidencia.titulo}". Quedará registrada como validada por la Municipalidad.`
            : ''
        }
        textoConfirmar="Aprobar"
        onConfirmar={confirmar}
        onCancelar={cancelar}
      />

      {/* Rechazo con motivo */}
      {accion?.estado === 'rechazada' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-negro/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-violeta-oscuro">
                  Rechazar evidencia
                </h3>

                <p className="mt-1 text-sm text-negro/60">
                  Indicá por qué la presentación no puede ser aprobada.
                </p>
              </div>

              <button
                type="button"
                onClick={cancelar}
                className="rounded-lg p-1 text-negro/50 hover:bg-negro/5"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-negro">
                {accion.evidencia.titulo}
              </p>

              <Campo etiqueta="Motivo del rechazo">
                <textarea
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  placeholder="Explicá qué debe corregir el delegado..."
                  rows={4}
                  className="w-full rounded-xl border border-negro/15 bg-white p-3 text-sm outline-none focus:border-violeta"
                />
              </Campo>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Boton
                variante="secundario"
                tamano="chico"
                onClick={cancelar}
              >
                Cancelar
              </Boton>

              <Boton
                variante="secundario"
                tamano="chico"
                disabled={!motivoRechazo.trim()}
                onClick={confirmar}
                icono={<X size={15} />}
              >
                Confirmar rechazo
              </Boton>
            </div>
          </div>
        </div>
      )}
    </PaginaPanel>
  );
}
