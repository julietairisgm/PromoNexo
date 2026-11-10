import { useMemo, useState, type FormEvent } from 'react';
import { Award, Lock, Pencil, Plus, Trash2, Trophy, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Reconocimiento, ReconocimientoEstudiantina } from '../../types';
import { generarId } from '../../utils';
import { CICLO, mejorHinchada } from '../../data/demo';
import { Boton } from '../../components/ui/Boton';
import { AreaTexto, Campo, Entrada, Seleccion } from '../../components/ui/Campos';
import { Buscador, EstadoVacio, PaginaPanel } from '../../components/ui/Tarjeta';
import { Modal } from '../../components/ui/Modal';
import { Confirmacion } from '../../components/ui/Confirmacion';
import { TarjetaReconocimiento, TarjetaMejorHinchada } from '../../components/dominio/TarjetaReconocimiento';

interface DatosReconocimiento {
  categoria: string;
  institucionId: string;
  motivo: string;
}

function FormularioReconocimiento({
  reconocimiento,
  opciones,
  onGuardar,
  onCancelar,
}: {
  reconocimiento?: Reconocimiento;
  opciones: { id: string; nombre: string }[];
  onGuardar: (datos: DatosReconocimiento) => void;
  onCancelar: () => void;
}) {
  const [form, setForm] = useState<DatosReconocimiento>({
    categoria: reconocimiento?.categoria ?? '',
    institucionId: reconocimiento?.institucionId ?? opciones[0]?.id ?? '',
    motivo: reconocimiento?.motivo ?? '',
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  const enviar = (evento: FormEvent) => {
    evento.preventDefault();
    const nuevos: Record<string, string> = {};
    if (form.categoria.trim().length < 3) nuevos.categoria = 'Ingresá la categoría del reconocimiento.';
    if (!form.institucionId) nuevos.institucionId = 'Seleccioná la institución.';
    if (form.motivo.trim().length < 10) nuevos.motivo = 'Describí el motivo (10 caracteres mínimo).';
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    onGuardar({
      categoria: form.categoria.trim(),
      institucionId: form.institucionId,
      motivo: form.motivo.trim(),
    });
  };

  return (
    <form id="form-reconocimiento" onSubmit={enviar} noValidate className="space-y-4">
      <Campo etiqueta="Categoría" error={errores.categoria}>
        <Entrada
          value={form.categoria}
          onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
          placeholder="Ej.: Solidaridad"
        />
      </Campo>

      <Campo etiqueta="Institución" error={errores.institucionId}>
        <Seleccion
          value={form.institucionId}
          onChange={(e) => setForm((f) => ({ ...f, institucionId: e.target.value }))}
        >
          <option value="">Seleccioná una institución</option>
          {opciones.map((i) => (
            <option key={i.id} value={i.id}>
              {i.nombre}
            </option>
          ))}
        </Seleccion>
      </Campo>

      <Campo etiqueta="Motivo" error={errores.motivo}>
        <AreaTexto
          value={form.motivo}
          onChange={(e) => setForm((f) => ({ ...f, motivo: e.target.value }))}
          placeholder="¿Por qué se otorga este reconocimiento?"
        />
      </Campo>

      <div className="flex flex-col-reverse gap-2 border-t border-humo pt-4 sm:flex-row sm:justify-end">
        <Boton type="button" variante="secundario" onClick={onCancelar}>
          Cancelar
        </Boton>
        <Boton type="submit">{reconocimiento ? 'Guardar cambios' : 'Crear reconocimiento'}</Boton>
      </div>
    </form>
  );
}

export function MunicipalReconocimientos() {
  const { instituciones, reconocimientos, tablaEstrellas, reconocimientoEstudiantina, guardarReconocimiento, eliminarReconocimiento, guardarReconocimientoEstudiantina, avisar } = useApp();

  const [busqueda, setBusqueda] = useState('');
  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState<Reconocimiento | undefined>(undefined);
  const [eliminando, setEliminando] = useState<Reconocimiento | undefined>(undefined);
  const [editarMejorHinchada, setEditarMejorHinchada] = useState(false);
  const [institucionGanadora, setInstitucionGanadora] = useState(reconocimientoEstudiantina.institucionId);

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return reconocimientos.filter(
      (r) =>
        !texto ||
        r.categoria.toLowerCase().includes(texto) ||
        r.motivo.toLowerCase().includes(texto)
    );
  }, [reconocimientos, busqueda]);

  const guardar = (datos: DatosReconocimiento) => {
    const esEdicion = Boolean(editando);
    guardarReconocimiento({
      id: editando?.id ?? generarId('reconocimiento'),
      ciclo: editando?.ciclo ?? CICLO,
      dato: editando?.dato ?? 'ficticio',
      ...datos,
    });
    setFormAbierto(false);
    avisar(esEdicion ? 'Reconocimiento actualizado.' : 'Reconocimiento creado correctamente.');
  };

  const confirmarEliminacion = () => {
    if (!eliminando) return;
    eliminarReconocimiento(eliminando.id);
    setEliminando(undefined);
    avisar('Reconocimiento eliminado.');
  };

  function abrirEdicionMejorHinchada() {
    setInstitucionGanadora(reconocimientoEstudiantina.institucionId);
    setEditarMejorHinchada(true);
  }

  function guardarMejorHinchada(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    guardarReconocimientoEstudiantina({...reconocimientoEstudiantina, institucionId: institucionGanadora,});
  
    setEditarMejorHinchada(false);
    avisar('La institución ganadora se actualizó correctamente.');
  }

  return (
    <PaginaPanel
      titulo="Reconocimientos"
      descripcion="Gestioná los reconocimientos generales de las promociones. El reconocimiento Mejor Hinchada de la Estudiantina es un resultado oficial y no se modifica desde acá."
      acciones={
        <Buscador
          valor={busqueda}
          onCambio={setBusqueda}
          placeholder="Buscar reconocimiento…"
          className="w-full sm:w-64"
          etiqueta="Buscar reconocimientos"
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
          Nuevo reconocimiento
        </Boton>
      </div>
      
      {/* TABLA DE ESTRELLAS */}
<section className="overflow-hidden rounded-2xl border border-violeta/10 bg-blanco shadow-sm">
  <div className="border-b border-violeta/10 bg-blanco p-5">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amarillo/60 text-violeta-oscuro">
        <Star size={23} />
      </div>

      <div>
        <h2 className="text-lg font-extrabold text-violeta-oscuro">
          Participación por promociones
        </h2>
        <p className="text-sm text-negro/60">
          Estrellas obtenidas mediante evidencias aprobadas · Ciclo {CICLO}
        </p>
      </div>
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full min-w-[650px] text-left text-sm">
      <thead className="bg-negro text-xs font-bold uppercase text-blanco">
        <tr>
          <th className="px-5 py-4">Institución</th>
          <th className="px-4 py-4 text-center">Colaboración</th>
          <th className="px-4 py-4 text-center">Solidaridad</th>
          <th className="px-4 py-4 text-center">Difusión</th>
          <th className="px-5 py-4 text-center">Total</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-humo">
        {instituciones.map((institucion) => {
          const fila = tablaEstrellas.find(
            (f) => f.institucionId === institucion.id
          );

          const total = fila?.total ?? 0;

          return (
            <tr key={institucion.id} className="transition hover:bg-violeta/5">
              <td className="px-5 py-4 font-bold text-negro">
                {institucion.nombre}
              </td>

              <td className="px-4 py-4 text-center">
                <span className="inline-flex items-center gap-1 font-bold">
                  <Star size={15} className="fill-amarillo text-amarillo-anaranjado" />
                  {fila?.colaboracion ?? 0}
                </span>
              </td>

              <td className="px-4 py-4 text-center">
                <span className="inline-flex items-center gap-1 font-bold">
                  <Star size={15} className="fill-amarillo text-amarillo-anaranjado" />
                  {fila?.solidaridad ?? 0}
                </span>
              </td>

              <td className="px-4 py-4 text-center">
                <span className="inline-flex items-center gap-1 font-bold">
                  <Star size={15} className="fill-amarillo text-amarillo-anaranjado" />
                  {fila?.comunicacion ?? 0}
                </span>
              </td>

              <td className="px-5 py-4 text-center">
                <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-violeta/10 px-3 py-1.5 font-black text-violeta-oscuro">
                  {total}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>

  <div className="border-t border-humo px-5 py-3">
    <p className="text-xs leading-relaxed text-negro/55">
      Cada estrella representa una evidencia aprobada. Estos indicadores
      reconocen la participación de las promociones y no modifican el
      puntaje oficial de la Estudiantina.
    </p>
  </div>
</section>

      {/* Reconocimientos generales */}
      <section>
        <h2 className="mb-4 text-lg font-extrabold text-violeta-oscuro">Reconocimientos generales</h2>
        {filtrados.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((reconocimiento) => (
              <div key={reconocimiento.id} className="relative">
                <TarjetaReconocimiento
                  reconocimiento={reconocimiento}
                  instituciones={instituciones}
                  mostrarAcciones={
                    <>
                      {/* Conservá aquí tus botones actuales de editar y eliminar */}
                      <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditando(reconocimiento);
                      setFormAbierto(true);
                    }}
                    aria-label={`Editar ${reconocimiento.categoria}`}
                    className="rounded-lg bg-blanco p-2 text-violeta shadow ring-1 ring-violeta/15 transition hover:bg-verde"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEliminando(reconocimiento)}
                    aria-label={`Eliminar ${reconocimiento.categoria}`}
                    className="rounded-lg bg-blanco p-2 text-negro/60 shadow ring-1 ring-violeta/15 transition hover:bg-amarillo hover:text-negro"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                    </>
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <EstadoVacio
            titulo="Sin reconocimientos"
            mensaje="Creá un reconocimiento o modificá la búsqueda."
            icono={<Award size={34} />}
          />
        )}
      </section>

      {/* MEJOR HINCHADA */}
<section>
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 className="text-lg font-extrabold text-violeta-oscuro">
        Mejor Hinchada
      </h2>
      <p className="mt-1 text-sm text-negro/60">
        Reconocimiento oficial de la Estudiantina.
      </p>
    </div>

    <Boton
      variante="secundario"
      icono={<Pencil size={16} />}
      onClick={abrirEdicionMejorHinchada}
    >
      Editar resultado
    </Boton>
  </div>

  <TarjetaMejorHinchada
    reconocimiento={reconocimientoEstudiantina}
    instituciones={instituciones}
  />

  <div className="mt-3 flex items-start gap-2 rounded-xl bg-violeta/5 p-4 text-xs leading-relaxed text-negro/60">
    <Trophy size={16} className="mt-0.5 shrink-0 text-violeta" />
    Este resultado corresponde exclusivamente a la Estudiantina. No forma
    parte de las categorías generales ni modifica el cálculo de estrellas.
  </div>
</section>

      <Modal
        abierto={formAbierto}
        titulo={editando ? 'Editar reconocimiento' : 'Nuevo reconocimiento'}
        onCerrar={() => setFormAbierto(false)}
      >
        <FormularioReconocimiento
          reconocimiento={editando}
          opciones={instituciones}
          onGuardar={guardar}
          onCancelar={() => setFormAbierto(false)}
        />
      </Modal>

            {/* MODAL PARA EDITAR MEJOR HINCHADA */}
      <Modal
  abierto={editarMejorHinchada}
  titulo="Editar Mejor Hinchada"
  onCerrar={() => setEditarMejorHinchada(false)}
>
  <form onSubmit={guardarMejorHinchada} className="space-y-5">
    <Campo etiqueta="Seleccionar institución ganadora">
  <select
    value={institucionGanadora}
    onChange={(evento) => setInstitucionGanadora(evento.target.value)}
    className="w-full rounded-xl border border-violeta/20 bg-blanco px-4 py-3 text-sm text-negro outline-none transition focus:border-violeta focus:ring-2 focus:ring-violeta/10"
  >
    {instituciones.map((institucion) => (
      <option key={institucion.id} value={institucion.id}>
        {institucion.nombre}
      </option>
    ))}
  </select>
</Campo>

    <div className="flex justify-end gap-3 border-t border-violeta/10 pt-4">
      <Boton
        variante="secundario"
        onClick={() => setEditarMejorHinchada(false)}
      >
        Cancelar
      </Boton>

      <Boton type="submit">
        Guardar cambios
      </Boton>
    </div>
  </form>
</Modal>

      <Confirmacion
        abierto={Boolean(eliminando)}
        titulo="Eliminar reconocimiento"
        mensaje={`Se eliminará el reconocimiento “${eliminando?.categoria}”. Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setEliminando(undefined)}
      />
    </PaginaPanel>
  );
}
