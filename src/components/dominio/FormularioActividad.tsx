import { useState, type FormEvent } from 'react';
import { useApp } from '../../context/AppContext';
import type { Actividad, EstadoActividad, Institucion } from '../../types';
import { generarId } from '../../utils';
import { Campo, Entrada, Seleccion } from '../ui/Campos';
import { Boton } from '../ui/Boton';

interface Props {
  actividad?: Actividad;
  instituciones: Institucion[];
  onGuardar: (actividad: Actividad) => void;
  onCancelar: () => void;
}

/**
 * Formulario para crear o editar actividades.
 * El delegado carga actividades de su institución; el municipal gestiona todas.
 */
export function FormularioActividad({ actividad, instituciones, onGuardar, onCancelar }: Props) {
  const { actividades } = useApp();

  const [form, setForm] = useState({
    nombre: actividad?.nombre ?? '',
    tipo: actividad?.tipo ?? '',
    institucionId: actividad?.institucionId ?? instituciones[0]?.id ?? '',
    fecha: actividad?.fecha ?? '',
    hora: actividad?.hora ?? '',
    lugar: actividad?.lugar ?? '',
    modalidadPago: actividad?.modalidadPago ?? 'presencial',
    estado: (actividad?.estado ?? 'proxima') as EstadoActividad,
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  const tipos = Array.from(
    new Set([...actividades.map((a) => a.tipo), actividad?.tipo].filter(Boolean) as string[])
  ).sort((a, b) => a.localeCompare(b));

  const set = <C extends keyof typeof form>(campo: C, valor: (typeof form)[C]) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const validar = (): Record<string, string> => {
    const nuevos: Record<string, string> = {};
    if (form.nombre.trim().length < 3) nuevos.nombre = 'Ingresá un nombre de al menos 3 caracteres.';
    if (!form.tipo.trim()) nuevos.tipo = 'Indicá el tipo de actividad.';
    if (!form.institucionId) nuevos.institucionId = 'Seleccioná la institución.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.fecha)) nuevos.fecha = 'Elegí una fecha válida.';
    if (!form.hora) nuevos.hora = 'Elegí una hora.';
    if (!form.lugar.trim()) nuevos.lugar = 'Indicá el lugar de la actividad.';
    return nuevos;
  };

  const enviar = (evento: FormEvent) => {
    evento.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    onGuardar({
      id: actividad?.id ?? generarId('actividad'),
      nombre: form.nombre.trim(),
      tipo: form.tipo.trim(),
      origen: actividad?.origen ?? 'municipal',
      institucionId: form.institucionId,
      fecha: form.fecha,
      hora: form.hora,
      lugar: form.lugar.trim(),
      modalidadPago: form.modalidadPago,
      estado: form.estado,
      dato: actividad?.dato ?? 'ficticio',
    });
  };

  return (
    <form id="form-actividad" onSubmit={enviar} noValidate className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Campo etiqueta="Nombre de la actividad" error={errores.nombre}>
            <Entrada
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              placeholder="Ej.: Bingo estudiantil"
              aria-invalid={Boolean(errores.nombre)}
            />
          </Campo>
        </div>

        <Campo etiqueta="Tipo de actividad" ayuda="Podés elegir un tipo existente o escribir uno nuevo." error={errores.tipo}>
          <Entrada
            list="tipos-actividad"
            value={form.tipo}
            onChange={(e) => set('tipo', e.target.value)}
            placeholder="Ej.: Rifa"
            aria-invalid={Boolean(errores.tipo)}
          />
          <datalist id="tipos-actividad">
            {tipos.map((tipo) => (
              <option key={tipo} value={tipo} />
            ))}
          </datalist>
        </Campo>

        <Campo etiqueta="Institución" error={errores.institucionId}>
          <Seleccion
            value={form.institucionId}
            onChange={(e) => set('institucionId', e.target.value)}
            aria-invalid={Boolean(errores.institucionId)}
          >
            {instituciones.length === 0 && <option value="">Sin instituciones disponibles</option>}
            {instituciones.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nombre}
              </option>
            ))}
          </Seleccion>
        </Campo>

        <Campo etiqueta="Fecha" error={errores.fecha}>
          <Entrada
            type="date"
            value={form.fecha}
            onChange={(e) => set('fecha', e.target.value)}
            aria-invalid={Boolean(errores.fecha)}
          />
        </Campo>

        <Campo etiqueta="Hora" error={errores.hora}>
          <Entrada
            type="time"
            value={form.hora}
            onChange={(e) => set('hora', e.target.value)}
            aria-invalid={Boolean(errores.hora)}
          />
        </Campo>

        <div className="sm:col-span-2">
          <Campo etiqueta="Lugar" error={errores.lugar}>
            <Entrada
              value={form.lugar}
              onChange={(e) => set('lugar', e.target.value)}
              placeholder="Ej.: Escuela de Comercio Dr. José Ingenieros"
              aria-invalid={Boolean(errores.lugar)}
            />
          </Campo>
        </div>

        <Campo etiqueta="Modalidad de pago">
          <Seleccion value={form.modalidadPago} onChange={(e) => set('modalidadPago', e.target.value)}>
            <option value="presencial">Presencial</option>
            <option value="sin pago">Sin pago</option>
          </Seleccion>
        </Campo>

        <Campo etiqueta="Estado">
          <Seleccion
            value={form.estado}
            onChange={(e) => set('estado', e.target.value as EstadoActividad)}
          >
            <option value="proxima">Próxima</option>
            <option value="finalizada">Finalizada</option>
            <option value="cancelada">Cancelada</option>
          </Seleccion>
        </Campo>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-humo pt-4 sm:flex-row sm:justify-end">
        <Boton type="button" variante="secundario" onClick={onCancelar}>
          Cancelar
        </Boton>
        <Boton type="submit" variante="primario">
          {actividad ? 'Guardar cambios' : 'Crear actividad'}
        </Boton>
      </div>
    </form>
  );
}
