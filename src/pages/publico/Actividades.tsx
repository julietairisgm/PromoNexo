import { useMemo, useState } from 'react';
import { CalendarDays, Filter, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CICLO, imagenGeneralActividades, institucionesParaActividades } from '../../data/demo';
import { cx } from '../../utils';
import { Buscador, EstadoVacio } from '../../components/ui/Tarjeta';
import { Campo, Seleccion } from '../../components/ui/Campos';
import { Boton } from '../../components/ui/Boton';
import { TarjetaActividad } from '../../components/dominio/TarjetaActividad';
import { Imagen } from '../../components/dominio/Imagen';

export function Actividades() {
  const { actividades, instituciones } = useApp();

  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('todos');
  const [estado, setEstado] = useState('todos');
  const [institucion, setInstitucion] = useState('todas');

  const tipos = useMemo(
    () => Array.from(new Set(actividades.map((a) => a.tipo))).sort((a, b) => a.localeCompare(b)),
    [actividades]
  );

  const institucionesDisponibles = useMemo(() => {
    const conActividades = new Set(actividades.map((a) => a.institucionId));
    return institucionesParaActividades(instituciones).filter((i) => conActividades.has(i.id));
  }, [actividades, instituciones]);

  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    const peso = (estadoActividad: string) =>
      estadoActividad === 'proxima' ? 0 : estadoActividad === 'finalizada' ? 1 : 2;

    return actividades
      .filter((a) => {
        const coincideBusqueda =
          !texto ||
          a.nombre.toLowerCase().includes(texto) ||
          a.lugar.toLowerCase().includes(texto) ||
          a.tipo.toLowerCase().includes(texto);
        const coincideTipo = tipo === 'todos' || a.tipo === tipo;
        const coincideEstado = estado === 'todos' || a.estado === estado;
        const coincideInstitucion = institucion === 'todas' || a.institucionId === institucion;
        return coincideBusqueda && coincideTipo && coincideEstado && coincideInstitucion;
      })
      .sort((a, b) => {
        const diferencia = peso(a.estado) - peso(b.estado);
        if (diferencia !== 0) return diferencia;
        return a.estado === 'proxima'
          ? a.fecha.localeCompare(b.fecha)
          : b.fecha.localeCompare(a.fecha);
      });
  }, [actividades, busqueda, tipo, estado, institucion]);

  const hayFiltros = busqueda || tipo !== 'todos' || estado !== 'todos' || institucion !== 'todas';

  const limpiar = () => {
    setBusqueda('');
    setTipo('todos');
    setEstado('todos');
    setInstitucion('todas');
  };

  return (
    <>
      {/* Encabezado con imagen ilustrativa */}
      <section className="relative overflow-hidden bg-violeta-oscuro text-blanco">
        <Imagen
          src={imagenGeneralActividades}
          alt="Actividades estudiantiles"
          decorativo
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Actividades</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blanco/85 sm:text-base">
            Actividades publicadas por las instituciones y por la Municipalidad durante el ciclo{' '}
            {CICLO}.
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-blanco p-4 shadow-sm ring-1 ring-violeta/10 sm:p-5">
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <Buscador
              valor={busqueda}
              onCambio={setBusqueda}
              placeholder="Buscar por nombre, lugar o tipo…"
              etiqueta="Buscar actividades"
            />
            <Campo etiqueta="Tipo">
              <Seleccion value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="todos">Todos los tipos</option>
                {tipos.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Seleccion>
            </Campo>
            <Campo etiqueta="Estado">
              <Seleccion value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="todos">Todos los estados</option>
                <option value="proxima">Próximas</option>
                <option value="finalizada">Finalizadas</option>
                <option value="cancelada">Canceladas</option>
              </Seleccion>
            </Campo>
            <Campo etiqueta="Institución">
              <Seleccion value={institucion} onChange={(e) => setInstitucion(e.target.value)}>
                <option value="todas">Todas las instituciones</option>
                {institucionesDisponibles.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nombre}
                  </option>
                ))}
              </Seleccion>
            </Campo>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-humo pt-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-negro/65">
              <Filter size={15} className="text-violeta" />
              {filtradas.length} {filtradas.length === 1 ? 'actividad' : 'actividades'} para mostrar
            </p>
            {hayFiltros && (
              <Boton variante="fantasma" tamano="chico" onClick={limpiar} icono={<Search size={14} />}>
                Limpiar filtros
              </Boton>
            )}
          </div>
        </div>

        {/* Listado */}
        <div className="mt-8 mb-10">
          {filtradas.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtradas.map((actividad) => (
                <TarjetaActividad
                  key={actividad.id}
                  actividad={actividad}
                  instituciones={instituciones}
                />
              ))}
            </div>
          ) : (
            <EstadoVacio
              titulo="No se encontraron actividades"
              mensaje="Probá quitar algún filtro o buscar con otras palabras."
              icono={<CalendarDays size={34} />}
            >
              <Boton variante="secundario" tamano="chico" onClick={limpiar}>
                Limpiar filtros
              </Boton>
            </EstadoVacio>
          )}
        </div>

      </section>
    </>
  );
}
