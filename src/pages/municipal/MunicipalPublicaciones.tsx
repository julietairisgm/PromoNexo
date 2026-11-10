import { useMemo, useState, type FormEvent } from 'react';
import { Eye, EyeOff, Newspaper, Pencil, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Publicacion } from '../../types';
import { esDatoDemo, formatearFecha, generarId } from '../../utils';
import { CICLO } from '../../data/demo';
import { Boton } from '../../components/ui/Boton';
import { AreaTexto, Campo, Entrada, Seleccion } from '../../components/ui/Campos';
import { Buscador, EstadoVacio, PaginaPanel } from '../../components/ui/Tarjeta';
import { Etiqueta } from '../../components/ui/Etiquetas';
import { Modal } from '../../components/ui/Modal';
import { Confirmacion } from '../../components/ui/Confirmacion';

interface DatosPublicacion {
  titulo: string;
  resumen: string;
  contenido: string;
  fecha: string;
  autor: string;
  estado: 'publicada' | 'borrador';
}

function FormularioPublicacion({
  publicacion,
  onGuardar,
  onCancelar,
}: {
  publicacion?: Publicacion;
  onGuardar: (datos: DatosPublicacion) => void;
  onCancelar: () => void;
}) {
  const [form, setForm] = useState<DatosPublicacion>({
    titulo: publicacion?.titulo ?? '',
    resumen: publicacion?.resumen ?? '',
    contenido: publicacion?.contenido ?? '',
    fecha: publicacion?.fecha ?? '',
    autor: publicacion?.autor ?? 'Municipalidad de San Pedro de Jujuy',
    estado: publicacion?.estado ?? 'borrador',
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  const enviar = (evento: FormEvent) => {
    evento.preventDefault();
    const nuevos: Record<string, string> = {};
    if (form.titulo.trim().length < 5) nuevos.titulo = 'Ingresá un título de al menos 5 caracteres.';
    if (form.resumen.trim().length < 10) nuevos.resumen = 'Escribí un resumen breve (10 caracteres mínimo).';
    if (form.contenido.trim().length < 20) nuevos.contenido = 'Desarrollá la publicación (20 caracteres mínimo).';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.fecha)) nuevos.fecha = 'Elegí una fecha.';
    if (!form.autor.trim()) nuevos.autor = 'Indicá el autor de la publicación.';
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    onGuardar({
      ...form,
      titulo: form.titulo.trim(),
      resumen: form.resumen.trim(),
      contenido: form.contenido.trim(),
      autor: form.autor.trim(),
    });
  };

  return (
    <form id="form-publicacion" onSubmit={enviar} noValidate className="space-y-4">
      <Campo etiqueta="Título" error={errores.titulo}>
        <Entrada
          value={form.titulo}
          onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
          placeholder="Ej.: Calendario de actividades"
        />
      </Campo>

      <Campo etiqueta="Resumen" error={errores.resumen}>
        <Entrada
          value={form.resumen}
          onChange={(e) => setForm((f) => ({ ...f, resumen: e.target.value }))}
          placeholder="Breve descripción que se muestra en el inicio"
        />
      </Campo>

      <Campo etiqueta="Contenido" error={errores.contenido}>
        <AreaTexto
          value={form.contenido}
          onChange={(e) => setForm((f) => ({ ...f, contenido: e.target.value }))}
          placeholder="Texto completo de la publicación…"
        />
      </Campo>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Campo etiqueta="Fecha" error={errores.fecha}>
          <Entrada
            type="date"
            value={form.fecha}
            onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))}
          />
        </Campo>
        <Campo etiqueta="Autor" error={errores.autor}>
          <Entrada value={form.autor} onChange={(e) => setForm((f) => ({ ...f, autor: e.target.value }))} />
        </Campo>
        <Campo etiqueta="Estado">
          <Seleccion
            value={form.estado}
            onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value as DatosPublicacion['estado'] }))}
          >
            <option value="borrador">Borrador</option>
            <option value="publicada">Publicada</option>
          </Seleccion>
        </Campo>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-humo pt-4 sm:flex-row sm:justify-end">
        <Boton type="button" variante="secundario" onClick={onCancelar}>
          Cancelar
        </Boton>
        <Boton type="submit">{publicacion ? 'Guardar cambios' : 'Crear publicación'}</Boton>
      </div>
    </form>
  );
}

export function MunicipalPublicaciones() {
  const { publicaciones, guardarPublicacion, eliminarPublicacion, avisar } = useApp();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState<Publicacion | undefined>(undefined);
  const [eliminando, setEliminando] = useState<Publicacion | undefined>(undefined);

  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return publicaciones
      .filter((p) => {
        const coincideBusqueda =
          !texto || p.titulo.toLowerCase().includes(texto) || p.autor.toLowerCase().includes(texto);
        const coincideEstado = filtroEstado === 'todos' || p.estado === filtroEstado;
        return coincideBusqueda && coincideEstado;
      })
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [publicaciones, busqueda, filtroEstado]);

  const guardar = (datos: DatosPublicacion) => {
    const esEdicion = Boolean(editando);
    guardarPublicacion({
      id: editando?.id ?? generarId('publicacion'),
      dato: editando?.dato ?? 'ficticio',
      ...datos,
    });
    setFormAbierto(false);
    avisar(esEdicion ? 'Publicación actualizada.' : 'Publicación creada correctamente.');
  };

  const alternarEstado = (publicacion: Publicacion) => {
    const nuevoEstado = publicacion.estado === 'publicada' ? 'borrador' : 'publicada';
    guardarPublicacion({ ...publicacion, estado: nuevoEstado });
    avisar(nuevoEstado === 'publicada' ? 'Publicación habilitada.' : 'Publicación ocultada.', 'info');
  };

  const confirmarEliminacion = () => {
    if (!eliminando) return;
    eliminarPublicacion(eliminando.id);
    setEliminando(undefined);
    avisar('Publicación eliminada.');
  };

  return (
    <PaginaPanel
      titulo="Publicaciones"
      descripcion="Gestioná las novedades y comunicados que se muestran en el inicio del sitio público."
      acciones={
        <Boton
          onClick={() => {
            setEditando(undefined);
            setFormAbierto(true);
          }}
          icono={<Plus size={17} />}
        >
          Nueva publicación
        </Boton>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Buscador
          valor={busqueda}
          onCambio={setBusqueda}
          placeholder="Buscar publicación…"
          etiqueta="Buscar publicaciones"
        />
        <Campo etiqueta="Estado">
          <Seleccion value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            <option value="publicada">Publicadas</option>
            <option value="borrador">Borradores</option>
          </Seleccion>
        </Campo>
      </div>

      {filtradas.length > 0 ? (
        <div className="space-y-4">
          {filtradas.map((publicacion) => (
            <TarjetaPublicacion
              key={publicacion.id}
              publicacion={publicacion}
              onEditar={() => {
                setEditando(publicacion);
                setFormAbierto(true);
              }}
              onEliminar={() => setEliminando(publicacion)}
              onAlternar={() => alternarEstado(publicacion)}
            />
          ))}
        </div>
      ) : (
        <EstadoVacio
          titulo="No hay publicaciones"
          mensaje="Creá una publicación para que aparezca en la sección de novedades del inicio."
          icono={<Newspaper size={34} />}
        />
      )}

      <Modal
        abierto={formAbierto}
        titulo={editando ? 'Editar publicación' : 'Nueva publicación'}
        onCerrar={() => setFormAbierto(false)}
      >
        <FormularioPublicacion
          publicacion={editando}
          onGuardar={guardar}
          onCancelar={() => setFormAbierto(false)}
        />
      </Modal>

      <Confirmacion
        abierto={Boolean(eliminando)}
        titulo="Eliminar publicación"
        mensaje={`Se eliminará “${eliminando?.titulo}”. Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setEliminando(undefined)}
      />
    </PaginaPanel>
  );
}

function TarjetaPublicacion({
  publicacion,
  onEditar,
  onEliminar,
  onAlternar,
}: {
  publicacion: Publicacion;
  onEditar: () => void;
  onEliminar: () => void;
  onAlternar: () => void;
}) {
  const publicada = publicacion.estado === 'publicada';

  return (
    <article className="rounded-2xl bg-blanco p-5 shadow-sm ring-1 ring-violeta/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Etiqueta tono={publicada ? 'verde' : 'amarillo'}>
              {publicada ? 'Publicada' : 'Borrador'}
            </Etiqueta>
            <span className="text-xs font-semibold text-negro/55">
              {formatearFecha(publicacion.fecha)} · {CICLO}
            </span>
            {esDatoDemo(publicacion.dato)}
          </div>
          <h3 className="mt-2 text-base font-bold text-violeta-oscuro">{publicacion.titulo}</h3>
          <p className="mt-1 text-sm leading-relaxed text-negro/70">{publicacion.resumen}</p>
          <p className="mt-2 text-xs font-semibold text-negro/50">Autor: {publicacion.autor}</p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-1.5">
          <Boton
            variante="fantasma"
            tamano="chico"
            onClick={onAlternar}
            icono={publicada ? <EyeOff size={15} /> : <Eye size={15} />}
          >
            {publicada ? 'Ocultar' : 'Publicar'}
          </Boton>
          <button
            type="button"
            onClick={onEditar}
            aria-label={`Editar ${publicacion.titulo}`}
            className="rounded-lg p-2 text-violeta transition hover:bg-violeta/10"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={onEliminar}
            aria-label={`Eliminar ${publicacion.titulo}`}
            className="rounded-lg p-2 text-negro/60 transition hover:bg-amarillo/30 hover:text-negro"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
