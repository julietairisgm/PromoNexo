import { ArrowRight, Award, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mejorHinchada, rankingEstudiantina } from '../../data/demo';
import { BotonEnlace } from '../../components/ui/Boton';
import { EncabezadoSeccion, EstadoVacio } from '../../components/ui/Tarjeta';
import { Etiqueta } from '../../components/ui/Etiquetas';
import { Podio, TablaPuntuaciones } from '../../components/dominio/Ranking';
import {
  TarjetaMejorHinchada,
  TarjetaReconocimiento,
} from '../../components/dominio/TarjetaReconocimiento';

/** Resultados y reconocimientos públicos en consulta (solo lectura). */
export function DelegadoResultados() {
  const { sesion, instituciones, reconocimientos } = useApp();
  const { resultados, ciclo } = rankingEstudiantina;
  const reconocimientosInstitucion = reconocimientos.filter((reconocimiento) => reconocimiento.institucionId === sesion?.institucionId);
  const mostrarMejorHinchada = mejorHinchada.institucionId === sesion?.institucionId;

  return (
    <div className="animar-entrada space-y-8">
      <header>
        <span className="text-xs font-black uppercase tracking-widest text-violeta">
          Consulta pública
        </span>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-violeta-oscuro">
          Resultados y reconocimientos
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-negro/70">
          Los resultados de la Estudiantina y los reconocimientos son de acceso público y no pueden
          editarse desde el panel del delegado.
        </p>
      </header>

      {/* Puntuaciones */}
      <section className="rounded-3xl bg-blanco p-6 shadow-sm ring-1 ring-violeta/10">
        <EncabezadoSeccion
          titulo={`Estudiantina ${ciclo}`}
          descripcion="Podio y tabla de los cinco primeros puestos."
          accion={
            <Link
              to="/estudiantina/puntuaciones"
              className="inline-flex items-center gap-1 text-xs font-bold text-violeta hover:text-violeta-oscuro"
            >
              Ver página completa <ArrowRight size={14} />
            </Link>
          }
        />
        <div className="rounded-2xl px-2 py-6 sm:px-6">
          <Podio resultados={resultados} instituciones={instituciones} />
        </div>
        <div className="mt-6">
          <TablaPuntuaciones resultados={resultados} instituciones={instituciones} />
        </div>
      </section>

      {/* Reconocimientos generales */}
      <section>
        <EncabezadoSeccion
          titulo="Reconocimientos generales"
          descripcion="Categorías de las promociones del ciclo."
          accion={
            <span className="inline-flex items-center gap-1.5 rounded-full bg-negro/15 px-3 py-1 text-xs font-bold text-negro ring-1 ring-verde/40">
              <Award size={14} /> Generales
            </span>
          }
        />
        {reconocimientosInstitucion.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reconocimientosInstitucion.map((reconocimiento) => (
              <TarjetaReconocimiento
                key={reconocimiento.id}
                reconocimiento={reconocimiento}
                instituciones={instituciones}
              />
            ))}
          </div>
        ) : (
          <EstadoVacio
            titulo="Sin reconocimientos cargados"
            mensaje="Los reconocimientos generales aparecerán acá cuando se publiquen."
            icono={<Trophy size={34} />}
          />
        )}
      </section>

      {/* Mejor Hinchada */}
      {mostrarMejorHinchada && (
      <section className="space-y-4">
        <EncabezadoSeccion
          titulo="Reconocimiento exclusivo de la Estudiantina"
          accion={<Etiqueta tono="amarillo">Mejor Hinchada</Etiqueta>}
        />
        <TarjetaMejorHinchada reconocimiento={mejorHinchada} instituciones={instituciones} />
        <div className="flex flex-wrap gap-3">
          <BotonEnlace to="/estudiantina/reconocimientos" variante="secundario" tamano="chico">
            Ver todos los reconocimientos
          </BotonEnlace>
          <BotonEnlace to="/actividades" variante="fantasma" tamano="chico">
            Volver a actividades
          </BotonEnlace>
        </div>
      </section>
      )}
    </div>
  );
}
