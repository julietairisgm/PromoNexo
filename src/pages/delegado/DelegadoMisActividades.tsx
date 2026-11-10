import { useMemo, useState } from 'react';
import { CalendarDays, Pencil, Plus, Trash2, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Actividad } from '../../types';
import { formatearFecha } from '../../utils';
import { Boton } from '../../components/ui/Boton';
import { EstadoVacio, PaginaPanel } from '../../components/ui/Tarjeta';
import { EtiquetaEstadoActividad } from '../../components/ui/Etiquetas';
import { Modal } from '../../components/ui/Modal';
import { Confirmacion } from '../../components/ui/Confirmacion';
import { FormularioActividad } from '../../components/dominio/FormularioActividad';

export function DelegadoMisActividades() {
  const { sesion, instituciones, actividades, guardarActividad, eliminarActividad, avisar } = useApp();

  const institucionPropia = instituciones.filter((i) => i.id === sesion?.institucionId);

  const propias = useMemo(() => {
    const peso = (estado: string) =>
      estado === 'proxima' ? 0 : estado === 'finalizada' ? 1 : 2;
    return actividades
      .filter((a) => a.institucionId === sesion?.institucionId)
      .sort((a, b) => {
        const diferencia = peso(a.estado) - peso(b.estado);
        if (diferencia !== 0) return diferencia;
        return a.estado === 'proxima'
          ? a.fecha.localeCompare(b.fecha)
          : b.fecha.localeCompare(a.fecha);
      });
  }, [actividades, sesion]);

  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState<Actividad | undefined>(undefined);
  const [eliminando, setEliminando] = useState<Actividad | undefined>(undefined);

  const abrirNueva = () => {
    setEditando(undefined);
    setFormAbierto(true);
  };

  const abrirEdicion = (actividad: Actividad) => {
    setEditando(actividad);
    setFormAbierto(true);
  };

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
      titulo="Mis actividades"
      descripcion="Creá, editá y eliminá las actividades de tu institución. Solo podés gestionar las actividades de tu propia institución."
      acciones={
        <Boton onClick={abrirNueva} icono={<Plus size={17} />}>
          Nueva actividad
        </Boton>
      }
    >
      
{propias.length > 0 ? (
  <div className="overflow-x-auto rounded-2xl bg-blanco shadow-sm ring-1 ring-violeta/10">
    <table className="w-full min-w-[850px] text-sm">
      <thead>
        <tr className="border-b border-violeta/10 bg-violeta-oscuro text-left text-xs uppercase tracking-wider text-amarillo">
          <th className="px-5 py-4 font-bold">Actividad</th>
          <th className="px-5 py-4 font-bold">Fecha y hora</th>
          <th className="px-5 py-4 font-bold">Lugar</th>
          <th className="px-5 py-4 font-bold">Estado</th>
          <th className="px-5 py-4 text-right font-bold">Acciones</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-humo">
        {propias.map((actividad) => (
          <tr
            key={actividad.id}
            className="transition-colors hover:bg-violeta/[0.03]"
          >
            {/* Actividad */}
            <td className="px-5 py-4">
              <p className="font-bold text-violeta-oscuro">
                {actividad.nombre}
              </p>
              <p className="mt-1 text-xs font-medium text-negro/50">
                {actividad.tipo}
              </p>
            </td>

            {/* Fecha y hora */}
            <td className="whitespace-nowrap px-5 py-4">
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={16}
                  className="shrink-0 text-verde"
                />
                <div>
                  <p className="font-semibold text-negro">
                    {formatearFecha(actividad.fecha)}
                  </p>
                  <p className="mt-0.5 text-xs text-negro/50">
                    {actividad.hora} h
                  </p>
                </div>
              </div>
            </td>

            {/* Lugar */}
            <td className="max-w-[220px] px-5 py-4">
              <div className="flex items-start gap-2">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-amarillo-anaranjado"
                />
                <span className="leading-relaxed text-negro/70">
                  {actividad.lugar}
                </span>
              </div>
            </td>

            {/* Estado */}
            <td className="whitespace-nowrap px-5 py-4">
              <EtiquetaEstadoActividad estado={actividad.estado} />
            </td>

            {/* Acciones */}
            <td className="px-5 py-4">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => abrirEdicion(actividad)}
                  aria-label={`Editar ${actividad.nombre}`}
                  title="Editar actividad"
                  className="rounded-lg p-2 text-negro transition hover:bg-verde/70 hover:text-blanco"
                >
                  <Pencil size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => setEliminando(actividad)}
                  aria-label={`Eliminar ${actividad.nombre}`}
                  title="Eliminar actividad"
                  className="rounded-lg p-2 text-blanck transition hover:bg-[#FF746C] hover:text-blanco"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <EstadoVacio
    titulo="Todavía no cargaste actividades"
    mensaje="Creá la primera actividad de tu institución para que aparezca en el sitio público."
    icono={<CalendarDays size={34} />}
  >
    <Boton
      onClick={abrirNueva}
      tamano="chico"
      icono={<Plus size={15} />}
    >
      Crear actividad
    </Boton>
  </EstadoVacio>
)}


      {/* Formulario crear / editar */}
      <Modal
        abierto={formAbierto}
        titulo={editando ? 'Editar actividad' : 'Nueva actividad'}
        onCerrar={() => setFormAbierto(false)}
      >
        <FormularioActividad
          actividad={editando}
          instituciones={institucionPropia}
          onGuardar={guardar}
          onCancelar={() => setFormAbierto(false)}
        />
      </Modal>

      {/* Confirmación de eliminación */}
      <Confirmacion
        abierto={Boolean(eliminando)}
        titulo="Eliminar actividad"
        mensaje={`Se eliminará la actividad “${eliminando?.nombre}” de la institución. Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setEliminando(undefined)}
      />
    </PaginaPanel>
  );
}
