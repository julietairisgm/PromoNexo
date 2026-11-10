import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Images,
  Newspaper,
  Trophy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  CICLO,
  rankingEstudiantina,
} from '../../data/demo';
import { formatearFecha, formatearPuntaje, esDatoDemo } from '../../utils';
import { BotonEnlace } from '../../components/ui/Boton';
import { EncabezadoSeccion, EstadoVacio, Tarjeta } from '../../components/ui/Tarjeta';
import { Etiqueta } from '../../components/ui/Etiquetas';
import { TarjetaActividad } from '../../components/dominio/TarjetaActividad';
import { Escudo } from '../../components/dominio/Escudo';
import { institucionPorId } from '../../data/demo';
import {
  TarjetaMejorHinchada,
  TarjetaGanadoraEstudiantina,
} from '../../components/dominio/TarjetaReconocimiento';

const ACCESOS = [
  {
    ruta: '/actividades',
    titulo: 'Actividades',
    descripcion: 'Agenda de las instituciones',
    icono: CalendarDays,
    color: 'bg-violeta text-blanco',
  },
  {
    ruta: '/estudiantina/puntuaciones',
    titulo: 'Puntuaciones',
    descripcion: 'Tabla de la Estudiantina',
    icono: Trophy,
    color: 'bg-amarillo text-negro',
  },
  {
    ruta: '/estudiantina/reconocimientos',
    titulo: 'Reconocimientos',
    descripcion: 'Premios y Mejor Hinchada',
    icono: Award,
    color: 'bg-verde text-blanco',
  },
  {
    ruta: '/galeria',
    titulo: 'Galería',
    descripcion: 'Reinas, departamental y Estudiantina',
    icono: Images,
    color: 'bg-violeta-oscuro text-blanco',
  },
  {
    ruta: '/anuario',
    titulo: 'Anuario',
    descripcion: 'Recuerdos del ciclo 2026',
    icono: BookOpen,
    color: 'bg-amarillo-anaranjado text-negro',
  },
];

export function Inicio() {
  const { instituciones, actividades, publicaciones } = useApp();

  const proximas = actividades
    .filter((a) => a.estado === 'proxima')
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 3);

  const novedades = publicaciones
    .filter((p) => p.estado === 'publicada')
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 3);

  const podio = rankingEstudiantina.resultados.filter((r) => r.posicion <= 3);
  const ganadora = podio.find((r) => r.posicion === 1);

  const mejorHinchada = {
    id: 'mejor-hinchada-2026',
    institucionId: 'polivalente-arte-2',
    ciclo: CICLO,
    nombre: 'Mejor Hinchada',
    dato: 'Centro Polivalente de Arte N.º 2',
    nota: 'Reconocimiento a la mejor hinchada de la Estudiantina.',
  };

  const imagenesGaleria = [
    { src: '/images/galeria/galeria-inicio1.jpeg', alt: 'Galería de PromoNexo 1' },
    { src: '/images/galeria/galeria-inicio2.jpg', alt: 'Galería de PromoNexo 2' },
    { src: '/images/galeria/galeria-inicio3.jpg', alt: 'Galería de PromoNexo 3' },
    { src: '/images/galeria/galeria-inicio4.jpeg', alt: 'Galería de PromoNexo 4' },
    { src: '/images/galeria/galeria-inicio5.jpeg', alt: 'Galería de PromoNexo 5' },
    { src: '/images/galeria/galeria-inicio6.jpg', alt: 'Galería de PromoNexo 6' },
  ];

  return (
    <>
      {/* ---------- Presentación ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violeta via-violeta-oscuro to-violeta text-blanco rejilla-textura">
        <div
          aria-hidden
          className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-amarillo/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-verde/20 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:py-20 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-verde px-3 py-1 text-xs font-black uppercase tracking-wider text-negro">
              PromoNexo · Ciclo {CICLO}
            </span>
            <h1 className="mt-5 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl">
              Las promociones estudiantiles,
              <span className="block text-amarillo">en un solo lugar</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-blanco/85">
              PromoNexo es la plataforma para gestionar, difundir y facilitar la participación en
              las actividades de las promociones estudiantiles de San Pedro de Jujuy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BotonEnlace
                to="/actividades"
                variante="amarillo"
                tamano="grande"
                icono={<CalendarDays size={18} />}
              >
                Ver actividades
              </BotonEnlace>
              <BotonEnlace
                to="/estudiantina/puntuaciones"
                variante="secundario"
                tamano="grande"
                icono={<Trophy size={18} />}
              >
                Ver puntuaciones
              </BotonEnlace>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="col-span-2 overflow-hidden rounded-2xl ring-1 ring-blanco/25">
              <img
                src="images/galeria/Promos.jpg"
                alt="Estudiantina de San Pedro de Jujuy"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Próximas actividades ---------- */}
      <section className="mx-auto max-w-7xl py-12 px-4 pb-12 sm:px-6 lg:px-8">
        <EncabezadoSeccion
          titulo="Próximas actividades"
          descripcion="Lo que se viene en las instituciones de San Pedro."
          accion={
            <BotonEnlace to="/actividades" variante="fantasma" tamano="chico" icono={<ArrowRight size={15} />}>
              Ver todas
            </BotonEnlace>
          }
        />
        {proximas.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {proximas.map((actividad) => (
              <TarjetaActividad key={actividad.id} actividad={actividad} instituciones={instituciones} />
            ))}
          </div>
        ) : (
          <EstadoVacio
            titulo="Sin actividades próximas por el momento"
            mensaje="Cuando las instituciones publiquen nuevas actividades van a aparecer acá."
            icono={<CalendarDays size={34} />}
          >
            <BotonEnlace to="/actividades" variante="secundario" tamano="chico">
              Ver actividades publicadas
            </BotonEnlace>
          </EstadoVacio>
        )}
      </section>

      {/* ---------- Estudiantina ---------- */}
      <section className="bg-blanco/70 py-12 ring-1 ring-violeta/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EncabezadoSeccion
            titulo={`Estudiantina ${CICLO}`}
            descripcion="Resultados oficiales y reconocimiento a la Mejor Hinchada."
            accion={
              <BotonEnlace
                to="/estudiantina/reconocimientos"
                variante="fantasma"
                tamano="chico"
                icono={<ArrowRight size={15} />}
              >
                Ver reconocimientos
              </BotonEnlace>
            }
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Tarjeta className="p-10">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-black uppercase tracking-wide text-violeta">
                  Podio de la Estudiantina
                </h3>
                <Etiqueta tono="suave">Top 3</Etiqueta>
              </div>
              <ol className="mt-5 space-y-3">
                {podio.map((resultado) => {
                  const institucion = institucionPorId(resultado.institucionId, instituciones);
                  return (
                    <li
                      key={resultado.posicion}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 ${
    resultado.posicion === 1
      ? 'hover:bg-amarillo/100'
      : resultado.posicion === 2
        ? 'hover:bg-[#C0C0C0]/75'
        : 'hover:bg-[#CD7F32]/80'
  }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                          resultado.posicion === 1
                            ? 'text-negro group-hover:bg-violeta group-hover:text-white'
        : resultado.posicion === 2
          ? 'text-negro group-hover:bg-violeta group-hover:text-white'
          : 'text-negro group-hover:bg-violeta group-hover:text-white'
                        }`}
                      >
                        {resultado.posicion}
                      </span>
                      <Escudo
                        nombre={institucion?.nombre ?? 'Institución'}
                        escudo={institucion?.escudo}
                        className="h-9 w-9 shrink-0"
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-negro">
                        {institucion?.nombre}
                      </span>
                      <span className="shrink-0 text-sm font-extrabold text-violeta">
                        {formatearPuntaje(resultado.puntaje)}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-5">
                <BotonEnlace to="/estudiantina/puntuaciones" variante="primario" tamano="chico">
                  Ver la tabla completa
                </BotonEnlace>
              </div>
            </Tarjeta>

            <div className="flex flex-col gap-6">

  {ganadora && (
    <TarjetaGanadoraEstudiantina
      reconocimiento={{
  id: 'ganadora-estudiantina-2026',
  institucionId: ganadora.institucionId,
  ciclo: CICLO,
  nombre: 'Ganadora de la Estudiantina',
  dato: 'Primer puesto',
  nota: 'Primer puesto en la clasificación general.',
}}
      instituciones={instituciones}
    />
  )}

  <TarjetaMejorHinchada
    reconocimiento={mejorHinchada}
    instituciones={instituciones}
  />

</div>

          </div>
        </div>
      </section>

     
{/* ---------- Galería ---------- */}
<section className="py-12 ring-1 ring-violeta/10">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <EncabezadoSeccion
      titulo="Galería"
      descripcion="Reviví los momentos y actividades más destacados de nuestra comunidad estudiantil."
      accion={
        <Link
          to="/galeria"
          className="inline-flex items-center gap-2 text-sm font-bold text-violeta transition-colors hover:text-violeta-oscuro"
        >
          Ver galería completa
          <ArrowRight size={18} />
        </Link>
      }
    />

    {imagenesGaleria.length > 0 ? (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
        {imagenesGaleria.map((imagen, index) => (
          <div
            key={imagen.src}
            className={`group aspect-[4/3] overflow-hidden rounded-2xl bg-violeta/10 shadow-sm ring-1 ring-violeta/10`}
          >
            <img
              src={imagen.src}
              alt={imagen.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    ) : (
      <EstadoVacio
        titulo="Todavía no hay fotos"
        mensaje="Las fotos del ciclo van a aparecer en este espacio."
        icono={<Images size={34} />}
      />
    )}
  </div>
</section>

    </>
  );
}
