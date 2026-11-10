import { BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { anuariosDemo, mejorHinchada, rankingEstudiantina } from '../../data/demo';
import { cx } from '../../utils';
import { EstadoVacio } from '../../components/ui/Tarjeta';
import { Imagen } from '../../components/dominio/Imagen';
import { ArrowUpRight, ArrowDown, Sparkles } from 'lucide-react';
import { TarjetaGanadoraEstudiantina, TarjetaMejorHinchada, TarjetaReconocimiento } from '../../components/dominio/TarjetaReconocimiento';


export function Anuario() {
  const { instituciones, reconocimientos } = useApp();
  const anuario = anuariosDemo[0];
  const ganadora = rankingEstudiantina.resultados.find((r) => r.posicion === 1);

  if (!anuario) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <EstadoVacio
          titulo="Sin anuarios"
          mensaje="Todavía no se publicó el anuario del ciclo."
          icono={<BookOpen size={34} />}
        />
      </section>
    );
  }

  const fotosPortada = anuario.imagenes.slice(0, 4);

  const secciones = [
    { id: 'estudiantina', numero: '01', nombre: 'Estudiantina' },
    { id: 'reconocimientos', numero: '02', nombre: 'Reconocimientos' },
    { id: 'actividades', numero: '03', nombre: 'Actividades' },
    { id: 'momentos', numero: '04', nombre: 'Grandes momentos' },
  ];

  return (
    <main className="bg-[#F8FAFC] text-negro">

      {/* PORTADA */}
      <section className="overflow-hidden bg-[#EDE9FE]">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-verde px-4 py-1.5 text-xs font-black uppercase tracking-widest text-blanco">
              PromoNexo · {anuario.ciclo}
            </span>

            <span className="text-xs font-semibold uppercase tracking-widest text-violeta-oscuro/60">
              Edición 2026
            </span>
          </div>

{/* Título de portada */}
          <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center gap-10 lg:mt-16 lg:flex-row lg:gap-12">
            <div className="w-full text-center lg:w-[42%] lg:text-left">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-violeta">
              Un recorrido por nuestro ciclo
            </p>
            

            <h1 className="mt-3 text-4xl font-black leading-[1.05] tracking-tight text-violeta-oscuro sm:text-6xl lg:text-7xl">
              UN AÑO,
              <br />
              <span className="text-violeta">MIL HISTORIAS.</span>
            </h1>

            <p className="mx-auto mt-5 mb-8 max-w-2xl text-sm leading-relaxed text-violeta-oscuro/75 sm:text-base">
              {anuario.descripcion}
            </p>
            <a
              href="#indice"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-violeta px-6 py-3 text-sm font-bold text-blanco transition hover:bg-violeta-oscuro"
            >
              Recorrer el anuario
              <ArrowDown size={16} />
            </a>
            </div>

          {/* Collage colectivo de portada */}
<div className="grid grid-cols-2 gap-3 rounded-2xl bg-[#DDD6FE] p-3 sm:gap-4 sm:p-5">
  {/* Foto principal */}
  <div className="row-span-2 overflow-hidden rounded-xl">
    <Imagen
      src="/images/anuario/foto-1.jpg"
      alt={`Momento destacado del ciclo ${anuario.ciclo}`}
      className="h-full min-h-[280px] w-full object-cover transition duration-500 hover:scale-105 sm:min-h-[380px]"
    />
  </div>

  {/* Fotos secundarias */}
  {['foto-2.jpg', 'foto-3.jpg'].map((foto) => (
    <div key={foto} className="overflow-hidden rounded-xl">
      <Imagen
        src={`/images/anuario/${foto}`}
        alt={`Momento destacado del ciclo ${anuario.ciclo}`}
        className="h-full min-h-[135px] w-full object-cover transition duration-500 hover:scale-105 sm:min-h-[182px]"
      />
    </div>
  ))}
</div>

          </div>
        </div>
      </section>

      {/* ÍNDICE */}
      <section
        id="indice"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violeta">
            Contenido
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-violeta-oscuro sm:text-4xl">
            Un recorrido por el año
          </h2>
          <p className="mt-2 text-sm text-negro/60">
            Cada momento forma parte de nuestra historia.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {secciones.map((seccion) => (
            <a
              key={seccion.id}
              href={`#${seccion.id}`}
              className="group flex items-center justify-between border-b border-violeta/15 py-5 transition hover:border-violeta"
            >
              <span className="flex items-center gap-5">
                <span className="text-sm font-black text-violeta/40">
                  {seccion.numero}
                </span>
                <span className="text-lg font-bold text-violeta-oscuro transition group-hover:text-violeta">
                  {seccion.nombre}
                </span>
              </span>
              <ArrowUpRight
                size={19}
                className="text-violeta/50 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violeta"
              />
            </a>
          ))}
        </div>
      </section>

      {/* ESTUDIANTINA */}
      <section
        id="estudiantina"
        className="scroll-mt-24 bg-negro py-16 text-blanco sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amarillo">
              Nuestra celebración
            </p>
            <h2 className="mt-2 text-3xl font-black sm:text-5xl">
              Estudiantina {anuario.ciclo}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blanco/70">
              El esfuerzo, la creatividad y el trabajo en equipo de las
              instituciones que dieron vida a una nueva edición de la
              Estudiantina.
            </p>
          </div>

          {/* TARJETAS GANDORAS */}
          <div className="flex flex-col gap-6">
      {ganadora && (
        <TarjetaGanadoraEstudiantina
          reconocimiento={{
            id: 'ganadora-estudiantina-2026',
            institucionId: ganadora.institucionId,
            ciclo: 2026,
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
      </section>

      {/* RECONOCIMIENTOS */}
<section
  id="reconocimientos"
  className="scroll-mt-24 overflow-hidden py-16 sm:py-20"
>
  <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

    <div className="mb-10 flex flex-col items-center gap-8 sm:flex-row sm:justify-between">

      <div className="max-w-xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-verde">
          Más que resultados
        </p>

        <h2 className="mt-2 text-3xl font-black text-violeta-oscuro sm:text-5xl">
          Reconocimientos
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-negro/60">
          Celebramos el compromiso, las iniciativas y los valores
          que hacen crecer a nuestra comunidad estudiantil.
        </p>
      </div>
    </div>

    {/* Tarjetas de reconocimientos */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {reconocimientos.map((reconocimiento) => (
        <TarjetaReconocimiento
          key={reconocimiento.id}
          reconocimiento={reconocimiento}
          instituciones={instituciones}
        />
      ))}
    </div>

  </div>
</section>
      

      
{/* MOMENTOS DEL CICLO */}
<section
  id="actividades"
  className="scroll-mt-24 bg-[#EDE9FE]/60 py-16 sm:py-20"
>
  <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

    <div className="mb-10 max-w-2xl">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-violeta">
        Recuerdos que nos unen
      </p>

      <h2 className="mt-2 text-3xl font-black text-violeta-oscuro sm:text-5xl">
        Momentos del ciclo
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-negro/60">
        Un año lleno de encuentros, experiencias y momentos
        compartidos que siempre merecen ser recordados.
      </p>
    </div>

    {/* GALERÍA: COMPOSICIÓN EDITORIAL DE 12 FOTOS */}
    <div
      className="
        grid grid-cols-2 gap-3
        sm:gap-4
        lg:grid-cols-6
        lg:grid-rows-[150px_150px_150px_150px_150px_150px]
      "
    >
      {[
        { numero: '1', area: 'lg:col-start-1 lg:col-span-4 lg:row-start-1 lg:row-span-2' },
        { numero: '2', area: 'lg:col-start-5 lg:col-span-2 lg:row-start-1' },
        { numero: '3', area: 'lg:col-start-5 lg:col-span-2 lg:row-start-2' },
        { numero: '4', area: 'lg:col-start-1 lg:col-span-2 lg:row-start-3' },
        { numero: '5', area: 'lg:col-start-3 lg:col-span-4 lg:row-start-3' },
        { numero: '6', area: 'lg:col-start-1 lg:col-span-2 lg:row-start-4' },
        { numero: '7', area: 'lg:col-start-3 lg:col-span-2 lg:row-start-4' },
        { numero: '8', area: 'lg:col-start-5 lg:col-span-2 lg:row-start-4' },
        { numero: '9', area: 'lg:col-start-1 lg:col-span-6 lg:row-start-5 lg:row-span-2' },
        { numero: '10', area: 'lg:col-start-1 lg:col-span-2 lg:row-start-7' },
        { numero: '11', area: 'lg:col-start-3 lg:col-span-2 lg:row-start-7' },
        { numero: '12', area: 'lg:col-start-5 lg:col-span-2 lg:row-start-7' },
      ].map(({ numero, area }) => (
        <figure
          key={numero}
          className={`group relative min-h-[130px] overflow-hidden rounded-2xl bg-violeta/10 ${area}`}
        >
          <Imagen
            src={`/images/anuario/foto-${numero}.jpg`}
            alt={`Recuerdo ${numero} del ciclo ${anuario.ciclo}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </figure>
      ))}
    </div>

  </div>
</section>


      {/* CIERRE */}
      <section className="overflow-hidden bg-gradient-to-r from-violeta-oscuro to-violeta py-20 text-center text-blanco sm:py-28">

        <div className="mx-auto max-w-3xl px-2">
          <Sparkles
            size={32}
            className="mx-auto text-amarillo"
          />

          <p className="mt-4 text-xs font-black uppercase tracking-[0.25em] text-amarillo">
            Hasta el próximo ciclo
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
            Las historias terminan.
            <span className="block text-amarillo">
              Los recuerdos quedan.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-blanco/70 sm:text-base">
            Gracias a cada estudiante, institución y persona que fue parte
            de este año. Cada momento construyó una historia compartida.
          </p>

        </div>

      </section>
    </main>
  );
}
