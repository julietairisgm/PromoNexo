import { ArrowRight, Info, Trophy, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { rankingEstudiantina } from '../../data/demo';
import { CICLO, mejorHinchada } from '../../data/demo';
import { BotonEnlace } from '../../components/ui/Boton';
import { EncabezadoSeccion, EstadoVacio } from '../../components/ui/Tarjeta';
import { TarjetaMejorHinchada, TarjetaReconocimiento } from '../../components/dominio/TarjetaReconocimiento';
import { Etiqueta } from '../../components/ui/Etiquetas';
import { Podio, TablaPuntuaciones } from '../../components/dominio/Ranking';

export function Puntuaciones() {
  const { instituciones } = useApp();
  const { resultados, nota, ciclo } = rankingEstudiantina;

  return (
    <>
      {/* Encabezado */}
      <section className="bg-gradient-to-br from-violeta via-violeta-oscuro to-violeta text-blanco rejilla-textura">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="text-xs font-black uppercase tracking-widest text-amarillo">
            Estudiantina · Ciclo {ciclo}
          </span>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Puntuaciones</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blanco/85 sm:text-base">
            Resultados finales de la Estudiantina {ciclo}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {resultados.length === 0 ? (
          <EstadoVacio
            titulo="Sin resultados cargados"
            mensaje="Todavía no hay puntajes publicados para la Estudiantina."
            icono={<Trophy size={34} />}
          />
        ) : (
          <>
            {/* Podio */}
            <div className="rounded-3xl bg-blanco p-6 shadow-sm ring-1 ring-violeta/10 sm:p-8">
              <EncabezadoSeccion
                titulo="Podio"
                descripcion="Primeras tres posiciones de la Estudiantina."
                accion={<Etiqueta tono="amarillo">Top 3</Etiqueta>}
              />
              <div className="rounded-2xl b px-2 py-6 sm:px-6">
                <Podio resultados={resultados} instituciones={instituciones} />
              </div>
            </div>

            {/* 2) Reconocimiento exclusivo de la Estudiantina */}
        <section>
          <TarjetaMejorHinchada reconocimiento={mejorHinchada} instituciones={instituciones} />
        </section>

            {/* Tabla de los cinco primeros */}
            <div className="rounded-3xl p-6 sm:p-8">
              <EncabezadoSeccion
                titulo="Tabla de los cinco primeros puestos"
                descripcion={`Resultados oficiales publicados para el ciclo ${ciclo}.`}
                accion={<Etiqueta tono="suave">Top 5</Etiqueta>}
              />
              <TablaPuntuaciones resultados={resultados} instituciones={instituciones} />
            </div>

            <div className="flex flex-wrap gap-3">
              <BotonEnlace
                to="/estudiantina/reconocimientos"
                variante="primario"
                icono={<ArrowRight size={16} />}
              >
                Ver reconocimientos
              </BotonEnlace>
              <BotonEnlace to="/actividades" variante="secundario">
                Ver actividades
              </BotonEnlace>
            </div>
          </>
        )}
      </section>
    </>
  );
}
