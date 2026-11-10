import { useMemo, useState } from 'react';
import { CalendarDays, Pencil, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Actividad } from '../../types';
import { formatearFecha } from '../../utils';
import { institucionesParaActividades } from '../../data/demo';
import { Boton } from '../../components/ui/Boton';
import { Buscador, EstadoVacio, PaginaPanel } from '../../components/ui/Tarjeta';
import { Campo, Seleccion } from '../../components/ui/Campos';
import { EtiquetaEstadoActividad } from '../../components/ui/Etiquetas';
import { Modal } from '../../components/ui/Modal';
import { Confirmacion } from '../../components/ui/Confirmacion';
import { FormularioActividad } from '../../components/dominio/FormularioActividad';

/** Gestión municipal de actividades (institucionales y municipales). */
export function MunicipalActividades() {
  const { instituciones, actividades, guardarActividad, eliminarActividad, avisar } = useApp();

  const [busqueda, setBusqueda] = useState('');
  const [filtroInstitucion, setFiltroInstitucion] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState<Actividad | undefined>(undefined);
  const [eliminando, setEliminando] = useState<Actividad | undefined>(undefined);

  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return actividades
      .filter((a) => {
        const coincideBusqueda =
          !texto ||
          a.nombre.toLowerCase().includes(texto) ||
          a.lugar.toLowerCase().includes(texto) ||
          a.tipo.toLowerCase().includes(texto);
        const coincideInstitucion =
          filtroInstitucion === 'todas' || a.institucionId === filtroInstitucion;
        const coincideEstado = filtroEstado === 'todos' || a.estado === filtroEstado;
        return coincideBusqueda && coincideInstitucion && coincideEstado;
      })
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [actividades, busqueda, filtroInstitucion, filtroEstado]);

  const institucionesFormulario = useMemo(() => {
    const base = institucionesParaActividades(instituciones);
    if (editando && !base.some((i) => i.id === editando.institucionId)) {
      const propia = instituciones.find((i) => i.id === editando.institucionId);
      return propia ? [...base, propia] : base;
    }
    return base;
  }, [instituciones, editando]);

  const guardar = (actividad: Actividad) => {
    const esEdicion = Boolean(editando);
    guardarActividad(actividad);
    setFormAbierto(false);
    avisar(esEdicion ? 'Actividad actualizada correctamente.' : 'Actividad creada correctamente.');
  };

  const confirmarEliminacion = () => {
    if (!eliminando) return;
    eliminarActividad(eliminando.id);
    setEliminando(undefined);
    avisar('Actividad eliminada.');
  };

  return (
    <PaginaPanel
      titulo="Actividades"
      descripcion="Gestión de actividades municipales e institucionales del ciclo: creación, edición y eliminación."
      acciones={
        <Boton
          onClick={() => {
            setEditando(undefined);
            setFormAbierto(true);
          }}
          icono={<Plus size={17} />}
        >
          Nueva actividad
        </Boton>
      }
    >
      {/* Filtros */}
      <div className="grid grid-cols-1 gap-4 rounded-2xl bg-blanco p-4 shadow-sm ring-1 ring-violeta/10 md:grid-cols-3">
        <Buscador
          valor={busqueda}
          onCambio={setBusqueda}
          placeholder="Buscar por nombre, tipo o lugar…"
          etiqueta="Buscar actividades"
        />
        <Campo etiqueta="Institución">
          <Seleccion
            value={filtroInstitucion}
            onChange={(e) => setFiltroInstitucion(e.target.value)}
          >
            <option value="todas">Todas las instituciones</option>
            {instituciones.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nombre}
              </option>
            ))}
          </Seleccion>
        </Campo>
        <Campo etiqueta="Estado">
          <Seleccion value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            <option value="proxima">Próximas</option>
            <option value="finalizada">Finalizadas</option>
            <option value="cancelada">Canceladas</option>
          </Seleccion>
        </Campo>
      </div>

      <p className="text-sm font-semibold text-negro/60">
        {filtradas.length} {filtradas.length === 1 ? 'actividad' : 'actividades'}
      </p>

      {/* Listado */}
      {filtradas.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl bg-blanco shadow-sm ring-1 ring-violeta/10">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-violeta-oscuro text-left text-[13px] uppercase tracking-wider text-amarillo">
                <th className="px-4 py-3 font-bold">Actividad</th>
                <th className="px-4 py-3 font-bold">Institución</th>
                <th className="px-4 py-3 font-bold">Fecha</th>
                <th className="px-4 py-3 font-bold">Estado</th>
                <th className="px-4 py-3 text-right font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-humo">
              {filtradas.map((actividad) => {
                const institucion = instituciones.find((i) => i.id === actividad.institucionId);
                return (
                  <tr key={actividad.id} className="transition hover:bg-violeta/5">
                    <td className="px-4 py-3">
                      <p className="font-bold text-violeta-oscuro">{actividad.nombre}</p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-negro/60">
                        {actividad.tipo} · {actividad.lugar}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-negro/70">
                      {institucion?.nombre ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-negro/75">
                      {formatearFecha(actividad.fecha)}
                      <span className="block text-xs text-negro/50">{actividad.hora} h</span>
                    </td>
                    <td className="px-4 py-3">
                      <EtiquetaEstadoActividad estado={actividad.estado} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditando(actividad);
                            setFormAbierto(true);
                          }}
                          aria-label={`Editar ${actividad.nombre}`}
                          className="rounded-lg p-2 text-violeta transition hover:bg-violeta/10"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEliminando(actividad)}
                          aria-label={`Eliminar ${actividad.nombre}`}
                          className="rounded-lg p-2 text-negro/60 transition hover:bg-amarillo/30 hover:text-negro"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EstadoVacio
          titulo="No hay actividades con estos filtros"
          mensaje="Modificá la búsqueda o los filtros para ver más resultados."
          icono={<CalendarDays size={34} />}
        >
          <Boton
            variante="secundario"
            tamano="chico"
            onClick={() => {
              setBusqueda('');
              setFiltroInstitucion('todas');
              setFiltroEstado('todos');
            }}
          >
            Limpiar filtros
          </Boton>
        </EstadoVacio>
      )}

      <Modal
        abierto={formAbierto}
        titulo={editando ? 'Editar actividad' : 'Nueva actividad'}
        onCerrar={() => setFormAbierto(false)}
      >
        <FormularioActividad
          actividad={editando}
          instituciones={institucionesFormulario}
          onGuardar={guardar}
          onCancelar={() => setFormAbierto(false)}
        />
      </Modal>

      <Confirmacion
        abierto={Boolean(eliminando)}
        titulo="Eliminar actividad"
        mensaje={`Se eliminará la actividad “${eliminando?.nombre}”. Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setEliminando(undefined)}
      />
    </PaginaPanel>
  );
}
