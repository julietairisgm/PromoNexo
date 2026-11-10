import { useMemo, useState, type FormEvent } from 'react';
import { Building2, Pencil, Plus, School, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Institucion } from '../../types';
import { generarId, generarSlug } from '../../utils';
import { Boton } from '../../components/ui/Boton';
import { Campo, Entrada } from '../../components/ui/Campos';
import { Buscador, EstadoVacio, PaginaPanel, Tarjeta } from '../../components/ui/Tarjeta';
import { Etiqueta } from '../../components/ui/Etiquetas';
import { Modal } from '../../components/ui/Modal';
import { Confirmacion } from '../../components/ui/Confirmacion';
import { Escudo } from '../../components/dominio/Escudo';

interface DatosInstitucion {
  nombre: string;
  localidad: string;
  escudo: string;
  usarEnActividades: boolean;
}

function FormularioInstitucion({
  institucion,
  onGuardar,
  onCancelar,
}: {
  institucion?: Institucion;
  onGuardar: (datos: DatosInstitucion) => void;
  onCancelar: () => void;
}) {
  const [form, setForm] = useState<DatosInstitucion>({
    nombre: institucion?.nombre ?? '',
    localidad: institucion?.localidad ?? 'San Pedro de Jujuy',
    escudo: institucion?.escudo ?? '',
    usarEnActividades: institucion?.usarEnActividades !== false,
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  const enviar = (evento: FormEvent) => {
    evento.preventDefault();
    const nuevos: Record<string, string> = {};
    if (form.nombre.trim().length < 4) nuevos.nombre = 'Ingresá el nombre completo de la institución.';
    if (!form.localidad.trim()) nuevos.localidad = 'Indicá la localidad.';
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    onGuardar({
      ...form,
      nombre: form.nombre.trim(),
      localidad: form.localidad.trim(),
      escudo: form.escudo.trim(),
    });
  };

  return (
    <form id="form-institucion" onSubmit={enviar} noValidate className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl bg-fondo p-4 ring-1 ring-violeta/10">
        <Escudo
          nombre={form.nombre || 'Institución nueva'}
          escudo={form.escudo}
          className="h-16 w-16 shrink-0"
          mostrarLeyenda
        />
        <p className="text-xs leading-relaxed text-negro/65">
          Si no se carga un archivo de escudo, se mostrará un escudo genérico con el nombre de la
          institución. Para usar el escudo oficial, indicá la ruta de la imagen.
        </p>
      </div>

      <Campo etiqueta="Nombre" error={errores.nombre}>
        <Entrada
          value={form.nombre}
          onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          placeholder="Ej.: Escuela de Comercio Dr. José Ingenieros"
        />
      </Campo>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Campo etiqueta="Localidad" error={errores.localidad}>
          <Entrada
            value={form.localidad}
            onChange={(e) => setForm((f) => ({ ...f, localidad: e.target.value }))}
          />
        </Campo>
        <Campo
          etiqueta="Escudo (ruta de imagen)"
          ayuda="Ej.: /images/instituciones/escuela.png — opcional."
        >
          <Entrada
            value={form.escudo}
            onChange={(e) => setForm((f) => ({ ...f, escudo: e.target.value }))}
            placeholder="/images/instituciones/…"
          />
        </Campo>
      </div>

      <label className="flex items-start gap-3 rounded-xl bg-violeta/5 px-4 py-3 ring-1 ring-violeta/15">
        <input
          type="checkbox"
          checked={form.usarEnActividades}
          onChange={(e) => setForm((f) => ({ ...f, usarEnActividades: e.target.checked }))}
          className="mt-0.5 h-4 w-4 accent-[#5321BF]"
        />
        <span>
          <span className="block text-sm font-bold text-violeta-oscuro">
            Participa de la carga de actividades
          </span>
          <span className="block text-xs text-negro/60">
            Si se desmarca, la institución no aparecerá en los formularios de actividades.
          </span>
        </span>
      </label>

      <div className="flex flex-col-reverse gap-2 border-t border-humo pt-4 sm:flex-row sm:justify-end">
        <Boton type="button" variante="secundario" onClick={onCancelar}>
          Cancelar
        </Boton>
        <Boton type="submit">{institucion ? 'Guardar cambios' : 'Crear institución'}</Boton>
      </div>
    </form>
  );
}

export function MunicipalInstituciones() {
  const { instituciones, actividades, guardarInstitucion, eliminarInstitucion, avisar } = useApp();
  const [busqueda, setBusqueda] = useState('');
  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState<Institucion | undefined>(undefined);
  const [eliminando, setEliminando] = useState<Institucion | undefined>(undefined);

  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return instituciones.filter(
      (i) => !texto || i.nombre.toLowerCase().includes(texto) || i.localidad.toLowerCase().includes(texto)
    );
  }, [instituciones, busqueda]);

  const guardar = (datos: DatosInstitucion) => {
    const esEdicion = Boolean(editando);
    let id = editando?.id ?? (generarSlug(datos.nombre) || generarId('institucion'));
    if (!esEdicion && instituciones.some((i) => i.id === id)) {
      id = `${id}-${Math.random().toString(36).slice(2, 6)}`;
    }
    guardarInstitucion({
      id,
      nombre: datos.nombre,
      localidad: datos.localidad,
      escudo: datos.escudo,
      usarEnActividades: datos.usarEnActividades,
    });
    setFormAbierto(false);
    avisar(esEdicion ? 'Institución actualizada.' : 'Institución creada correctamente.');
  };

  const confirmarEliminacion = () => {
    if (!eliminando) return;
    const resultado = eliminarInstitucion(eliminando.id);
    if (resultado.ok) {
      avisar('Institución eliminada.');
    } else {
      avisar(resultado.mensaje ?? 'No se pudo eliminar la institución.', 'error');
    }
    setEliminando(undefined);
  };

  return (
    <PaginaPanel
      titulo="Instituciones"
      descripcion="Consultá y administrá las instituciones participantes. Los escudos se muestran desde la ruta indicada o, en su defecto, con un escudo genérico que incluye el nombre."
      acciones={
        <Buscador
          valor={busqueda}
          onCambio={setBusqueda}
          placeholder="Buscar institución…"
          className="w-full sm:w-64"
          etiqueta="Buscar instituciones"
        />
      }
    >
      <div className="flex justify-end">
        <Boton
          icono={<Plus size={17} />}
          onClick={() => {
            setEditando(undefined);
            setFormAbierto(true);
          }}
        >
          Nueva institución
        </Boton>
      </div>

      {filtradas.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {filtradas.map((institucion) => {
            const cantidadActividades = actividades.filter(
              (a) => a.institucionId === institucion.id
            ).length;
            return (
              <Tarjeta key={institucion.id} className="flex gap-4 p-5">
                <Escudo
                  nombre={institucion.nombre}
                  escudo={institucion.escudo}
                  className="h-16 w-16 shrink-0"
                  mostrarLeyenda
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold leading-snug text-violeta-oscuro">
                      {institucion.nombre}
                    </h3>
                    <span className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditando(institucion);
                          setFormAbierto(true);
                        }}
                        aria-label={`Editar ${institucion.nombre}`}
                        className="rounded-lg p-2 text-violeta transition hover:bg-violeta/10"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEliminando(institucion)}
                        aria-label={`Eliminar ${institucion.nombre}`}
                        className="rounded-lg p-2 text-negro/60 transition hover:bg-amarillo/30 hover:text-negro"
                      >
                        <Trash2 size={16} />
                      </button>
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-negro/60">
                    <School size={13} /> {institucion.localidad}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Etiqueta tono="violeta">
                      {cantidadActividades}{' '}
                      {cantidadActividades === 1 ? 'actividad' : 'actividades'}
                    </Etiqueta>
                    {institucion.usarEnActividades === false && (
                      <Etiqueta tono="negro">no carga actividades</Etiqueta>
                    )}
                  </div>
                </div>
              </Tarjeta>
            );
          })}
        </div>
      ) : (
        <EstadoVacio
          titulo="No se encontraron instituciones"
          mensaje="Probá con otro término de búsqueda."
          icono={<Building2 size={34} />}
        />
      )}

      <Modal
        abierto={formAbierto}
        titulo={editando ? 'Editar institución' : 'Nueva institución'}
        onCerrar={() => setFormAbierto(false)}
      >
        <FormularioInstitucion
          institucion={editando}
          onGuardar={guardar}
          onCancelar={() => setFormAbierto(false)}
        />
      </Modal>

      <Confirmacion
        abierto={Boolean(eliminando)}
        titulo="Eliminar institución"
        mensaje={`Se eliminará “${eliminando?.nombre}”. Solo es posible eliminar instituciones sin actividades, propuestas ni reconocimientos asociados.`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setEliminando(undefined)}
      />
    </PaginaPanel>
  );
}
