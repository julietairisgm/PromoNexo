
import { useState } from 'react';
import { CalendarDays, Clock, MapPin, Megaphone, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Comunicado, TipoComunicado } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatearFecha, generarId } from '../../utils';
import { PaginaPanel, Tarjeta } from '../../components/ui/Tarjeta';
import { Modal } from '../../components/ui/Modal';
import { Campo, Entrada, Seleccion, AreaTexto } from '../../components/ui/Campos';
import { Boton } from '../../components/ui/Boton';

export function MunicipalComunicados() {
  const { comunicados, guardarComunicado, eliminarComunicado } = useApp();

  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [comunicadoEditando, setComunicadoEditando] = useState<Comunicado | null>(null);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState<TipoComunicado>('informativo');
  const [fechaReunion, setFechaReunion] = useState('');
  const [horaReunion, setHoraReunion] = useState('');
  const [lugar, setLugar] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});

  const comunicadosOrdenados = [...comunicados].sort(
    (a, b) => b.fechaPublicacion.localeCompare(a.fechaPublicacion)
  );

  function limpiarFormulario() {
    setErrores({});
    setTitulo('');
    setDescripcion('');
    setTipo('informativo');
    setFechaReunion('');
    setHoraReunion('');
    setLugar('');
    setComunicadoEditando(null);
    setFormularioAbierto(false);
  }

  function abrirNuevo() {
    limpiarFormulario();
    setFormularioAbierto(true);
  }

  function editar(comunicado: Comunicado) {
    setErrores({});
    setComunicadoEditando(comunicado);
    setTitulo(comunicado.titulo);
    setDescripcion(comunicado.descripcion);
    setTipo(comunicado.tipo);
    setFechaReunion(comunicado.fechaReunion ?? '');
    setHoraReunion(comunicado.horaReunion ?? '');
    setLugar(comunicado.lugar ?? '');
    setFormularioAbierto(true);
  }

  function guardar(estado: 'borrador' | 'publicado') {
  const nuevos: Record<string, string> = {};

  if (titulo.trim().length < 3) {
    nuevos.titulo = 'Ingresá un título de al menos 3 caracteres.';
  }

  if (!descripcion.trim()) {
    nuevos.descripcion = 'Ingresá la descripción del comunicado.';
  }

  if (estado === 'publicado' && tipo === 'reunion') {
    if (!fechaReunion) nuevos.fechaReunion = 'Elegí la fecha de reunión.';
    if (!horaReunion) nuevos.horaReunion = 'Elegí una hora.';
    if (!lugar.trim()) nuevos.lugar = 'Indicá el lugar de la reunión.';
  }

  setErrores(nuevos);

  if (Object.keys(nuevos).length > 0) return;

  const comunicado: Comunicado = {
    id: comunicadoEditando?.id ?? generarId('comunicado'),
    titulo: titulo.trim(),
    descripcion: descripcion.trim(),
    tipo,
    fechaPublicacion:
      estado === 'publicado'
        ? new Date().toISOString().slice(0, 10)
        : comunicadoEditando?.fechaPublicacion ??
          new Date().toISOString().slice(0, 10),
    fechaReunion,
horaReunion,
lugar: lugar.trim(),
    estado,
    dato: 'Dirección de Juventud',
  };

  guardarComunicado(comunicado);
  limpiarFormulario();
}

  function eliminar(id: string) {
    if (window.confirm('¿Seguro que querés eliminar este comunicado?')) {
      eliminarComunicado(id);
    }
  }

  return (
    <PaginaPanel
      titulo="Comunicados"
      descripcion="Creá y administrá los avisos oficiales destinados a los delegados de las promociones."
      acciones={
        <Boton
          variante="primario"
          tamano="chico"
          onClick={abrirNuevo}
          icono={<Plus size={17} />}
        >
          Nuevo comunicado
        </Boton>
      }
    >
      <Modal
  abierto={formularioAbierto}
  titulo={comunicadoEditando ? 'Editar comunicado' : 'Nuevo comunicado'}
  onCerrar={limpiarFormulario}
>
  <form
    id="form-comunicado"
    onSubmit={(e) => e.preventDefault()}
    noValidate
    className="space-y-4"
  >
    <p className="text-sm text-negro/60">
      Completá la información que recibirán los delegados.
    </p>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Campo etiqueta="Título" error={errores.titulo}>
          <Entrada
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej.: Reunión general de delegados"
            aria-invalid={Boolean(errores.titulo)}
          />
        </Campo>
      </div>

      <div className="sm:col-span-2">
        <Campo etiqueta="Descripción" error={errores.descripcion}>
          <AreaTexto
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            placeholder="Escribí el contenido del comunicado..."
            aria-invalid={Boolean(errores.descripcion)}
          />
        </Campo>
      </div>

      <Campo etiqueta="Tipo de comunicado">
        <Seleccion
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value as TipoComunicado);
            setErrores({});
          }}
        >
          <option value="informativo">Informativo</option>
          <option value="reunion">Reunión</option>
        </Seleccion>
      </Campo>
          <Campo etiqueta="Fecha" error={errores.fechaReunion}>
  <Entrada
    type="date"
    value={fechaReunion}
    onChange={(e) => setFechaReunion(e.target.value)}
    aria-invalid={Boolean(errores.fechaReunion)}
  />
</Campo>

<Campo etiqueta="Hora" error={errores.horaReunion}>
  <Entrada
    type="time"
    value={horaReunion}
    onChange={(e) => setHoraReunion(e.target.value)}
    aria-invalid={Boolean(errores.horaReunion)}
  />
</Campo>

<Campo etiqueta="Lugar" error={errores.lugar}>
  <Entrada
    value={lugar}
    onChange={(e) => setLugar(e.target.value)}
    placeholder="Ej.: Salón municipal"
    aria-invalid={Boolean(errores.lugar)}
  />
</Campo>
    </div>

    <div className="flex flex-col-reverse gap-2 border-t border-humo pt-4 sm:flex-row sm:justify-end">
      <Boton
        type="button"
        variante="secundario"
        onClick={limpiarFormulario}
      >
        Cancelar
      </Boton>

      <Boton
        type="button"
        variante="secundario"
        onClick={() => guardar('borrador')}
      >
        Guardar borrador
      </Boton>

      <Boton
        type="button"
        variante="primario"
        onClick={() => guardar('publicado')}
      >
        Publicar comunicado
      </Boton>
    </div>
  </form>
</Modal>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-violeta-oscuro">
            Comunicados registrados
          </h2>
          <span className="text-sm text-negro/50">
            {comunicados.length} en total
          </span>
        </div>

        {comunicadosOrdenados.length === 0 ? (
          <Tarjeta className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-violeta/10 text-violeta">
              <Megaphone size={28} />
            </div>
            <h3 className="font-bold text-violeta-oscuro">
              Todavía no hay comunicados
            </h3>
            <p className="max-w-md text-sm text-negro/60">
              Creá el primer comunicado para compartir información con los delegados.
            </p>
            <Boton variante="primario" tamano="chico" onClick={abrirNuevo}>
              <Plus size={16} /> Crear comunicado
            </Boton>
          </Tarjeta>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
  {comunicadosOrdenados.map((comunicado) => (
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

    {/* Pie de la tarjeta: publicación y acciones */}
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-humo pt-3">
      <p className="text-xs text-negro/50">
        {comunicado.estado === 'publicado'
          ? `Publicado el ${formatearFecha(comunicado.fechaPublicacion)}`
          : 'Todavía no visible para los delegados'}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => editar(comunicado)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-violeta transition hover:bg-violeta/10"
          aria-label="Editar comunicado"
          title="Editar"
        >
          <Pencil size={16} />
          <span>Editar</span>
        </button>

        <button
          type="button"
          onClick={() => eliminar(comunicado.id)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-rojo transition hover:bg-rojo/10"
          aria-label="Eliminar comunicado"
          title="Eliminar"
        >
          <Trash2 size={16} />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  </div>
</Tarjeta>
  ))}
</div>
        )}
      </section>
    </PaginaPanel>
  );
}
