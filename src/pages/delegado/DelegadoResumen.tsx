import { ArrowRight, CalendarDays, Clock, FileText, MapPin, Megaphone, School, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatearFecha } from '../../utils';
import { BotonEnlace } from '../../components/ui/Boton';
import { Tarjeta, TarjetaDato } from '../../components/ui/Tarjeta';
import { EtiquetaEstadoActividad } from '../../components/ui/Etiquetas';
import { Escudo } from '../../components/dominio/Escudo';

export function DelegadoResumen() {
  const { sesion, instituciones, actividades, comunicados, reconocimientos } = useApp();

  const institucion = instituciones.find((i) => i.id === sesion?.institucionId);
  const misActividades = actividades.filter((a) => a.institucionId === sesion?.institucionId);
  const proximas = misActividades.filter((a) => a.estado === 'proxima').sort((a, b) => a.fecha.localeCompare(b.fecha));
  // Fecha actual en formato YYYY-MM-DD (hora local)
  const hoy = new Date();
  const fechaHoy = [hoy.getFullYear(), String(hoy.getMonth() + 1).padStart(2, '0'), String(hoy.getDate()).padStart(2, '0'),].join('-');
  const comunicadosPublicados = comunicados.filter((c) => c.estado === 'publicado').sort((a, b) => b.fechaPublicacion.localeCompare(a.fechaPublicacion));
  const reunionesProximas = comunicadosPublicados.filter((c) => c.tipo === 'reunion' && c.fechaReunion && c.fechaReunion >= fechaHoy).sort((a, b) => a.fechaReunion!.localeCompare(b.fechaReunion!));
  
  // Comunicados publicados que todavía no vencieron
  const comunicadosVigentes = comunicados.filter((comunicado) =>
      comunicado.estado === 'publicado' && Boolean(comunicado.fechaReunion) && comunicado.fechaReunion! >= fechaHoy)
      .sort((a, b) => a.fechaReunion!.localeCompare(b.fechaReunion!));

  const comunicadoDestacado = comunicadosVigentes[0] ?? null;
  const misReconocimientos = reconocimientos.filter((r) => r.institucionId === sesion?.institucionId);

  return (
    
    <div className="animar-entrada space-y-6">
      {/* Bienvenida */}
      {/* Comunicado destacado */}
{comunicadoDestacado && (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violeta to-verde px-5 py-4 text-white shadow-md">

    {/* Decoración de fondo */}
    <div className="pointer-events-none absolute -right-8 -top-16 size-48 rounded-full border-[20px] border-white/5" />
    <div className="pointer-events-none absolute -right-2 -top-12 size-36 rounded-full border border-amarillo/20" />

    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      {/* Información */}
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl text-blanco">
          {comunicadoDestacado.tipo === 'reunion' ? (
            <CalendarDays size={21} />
          ) : (
            <Megaphone size={21} />
          )}
        </div>

        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-extrabold">
              {comunicadoDestacado.tipo === 'reunion'
                ? 'Próxima reunión'
                : 'Actualización municipal'}
            </span>

            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white/90">
              Dirección de Juventud
            </span>
          </div>

          <h2 className="truncate text-base font-bold">
            {comunicadoDestacado.titulo}
          </h2>

          <p className="mt-0.5 line-clamp-1 text-sm text-white/80">
            {comunicadoDestacado.descripcion}
          </p>
        </div>
      </div>

      {/* Acceso al comunicado */}
      <Link
        to="/panel/delegado/comunicados"
        className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/70 px-4 py-2 text-xs font-bold text-white transition hover:bg-white hover:text-violeta-oscuro sm:self-center"
      >
        Ver comunicado
        <ArrowRight size={15} />
      </Link>

    </div>
  </div>
)}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violeta to-violeta-oscuro p-6 text-blanco rejilla-textura sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amarillo">
              Panel del delegado
            </span>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
              Hola, {institucion?.nombre ?? 'delegación'}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-blanco/85">
              Desde acá gestionás las actividades de tu institución y consultás los comunicados de la Municipalidad.
            </p>
          </div>
          <Escudo
            nombre={institucion?.nombre ?? 'Institución'}
            escudo={institucion?.escudo}
            className="h-20 w-20 shrink-0 rounded-2xl bg-blanco/95 p-2"
          />
        </div>
      </section>

      {/* Estadísticas */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TarjetaDato
          valor={misActividades.length}
          texto="Actividades de mi institución"
          icono={<CalendarDays size={18} />}
        />
        <TarjetaDato
          valor={proximas.length}
          texto="Actividades próximas"
          icono={<ArrowRight size={18} />}
        />
        <TarjetaDato
          valor={comunicadosPublicados.length}
          texto="Comunicados disponibles"
          icono={<FileText size={18} />}
        />
        <TarjetaDato
          valor={misReconocimientos.length}
          texto="Reconocimientos recibidos"
          icono={<Trophy size={18} />}
        />
      </section>
      
{/* Accesos rápidos */}
<section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

  {/* Gestión */}
  <Tarjeta className="flex flex-col gap-5 p-6">
    <div>
      <span className="text-xs font-black uppercase tracking-widest text-violeta">
        Gestión
      </span>
      <h2 className="mt-1 text-lg font-extrabold text-violeta-oscuro">
        Mi institución
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-negro/60">
        Administrá las actividades y consultá la información de tu promoción.
      </p>
    </div>

    <div className="mt-auto flex flex-col gap-3">
      <BotonEnlace
        to="/panel/delegado/actividades"
        variante="primario"
        tamano="chico"
      >
        Crear o editar actividades
      </BotonEnlace>

      <BotonEnlace
        to="/panel/delegado/publicadas"
        variante="secundario"
        tamano="chico"
      >
        Ver mis actividades
      </BotonEnlace>
    </div>
  </Tarjeta>

  {/* Consulta */}
  <Tarjeta className="flex flex-col gap-5 p-6">
    <div>
      <span className="text-xs font-black uppercase tracking-widest text-violeta">
        Consulta
      </span>
      <h2 className="mt-1 text-lg font-extrabold text-violeta-oscuro">
        Información del ciclo
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-negro/60">
        Mantenete al tanto de las novedades y consultá los resultados de la Estudiantina.
      </p>
    </div>

    <div className="mt-auto flex flex-col gap-3">
      <BotonEnlace
        to="/panel/delegado/comunicados"
        variante="primario"
        tamano="chico"
      >
        Ver comunicados
      </BotonEnlace>

      <BotonEnlace
        to="/panel/delegado/resultados"
        variante="secundario"
        tamano="chico"
      >
        Resultados y reconocimientos
      </BotonEnlace>
    </div>
  </Tarjeta>

  {/* Próxima actividad */}
  <Tarjeta className="flex flex-col gap-5 p-6">
    <div>
      <span className="text-xs font-black uppercase tracking-widest text-amarillo-anaranjado">
        Agenda
      </span>
      <h2 className="mt-1 text-lg font-extrabold text-violeta-oscuro">
        Próxima actividad
      </h2>
    </div>

    {proximas[0] ? (
      <div className="flex flex-1 flex-col rounded-2xl p-4">
        <EtiquetaEstadoActividad estado={proximas[0].estado} />

        <h3 className="mt-3 text-base font-extrabold leading-snug text-violeta-oscuro">
          {proximas[0].nombre}
        </h3>

        <div className="mt-3 space-y-2 text-sm text-negro/65">
          <p className="flex items-center gap-2">
            <CalendarDays size={16} className="shrink-0 text-violeta" />
            {formatearFecha(proximas[0].fecha)}
          </p>

          <p className="flex items-center gap-2">
            <Clock size={16} className="shrink-0 text-violeta" />
            {proximas[0].hora} h
          </p>

          <p className="flex items-center gap-2">
            <MapPin size={16} className="shrink-0 text-violeta" />
            {proximas[0].lugar}
          </p>
        </div>

        <Link
          to={`/actividades/${proximas[0].id}`}
          className="mt-auto pt-5 inline-flex items-center gap-2 text-sm font-bold text-violeta hover:text-violeta-oscuro"
        >
          Ver actividad
          <ArrowRight size={16} />
        </Link>
      </div>
    ) : (
      <div className="flex flex-1 flex-col justify-center rounded-2xl px-5">
        <CalendarDays size={28} className="text-violeta/60" />

        <p className="mt-3 text-sm leading-relaxed text-negro/60">
          No hay actividades próximas cargadas para tu institución.
        </p>

        <Link
          to="/panel/delegado/actividades"
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-violeta"
        >
          Ir a Mis actividades
          <ArrowRight size={16} />
        </Link>
      </div>
    )}
  </Tarjeta>

</section>


      {/* Institución */}
      <Tarjeta className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center">
        <School size={22} className="shrink-0 text-violeta" />
        <div className="flex-1">
          <h2 className="text-sm font-bold text-violeta-oscuro">{institucion?.nombre}</h2>
          <p className="text-xs text-negro/60">{institucion?.localidad}</p>
        </div>
        <BotonEnlace to="/panel/delegado/institucion" variante="fantasma" tamano="chico" icono={<ArrowRight size={14} />}>
          Ver ficha completa
        </BotonEnlace>
      </Tarjeta>
    </div>
  );
}
