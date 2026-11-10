import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Images, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { galeriaActual, institucionDeGaleria } from '../../data/demo';
import { cx } from '../../utils';
import { EstadoVacio } from '../../components/ui/Tarjeta';
import { Modal } from '../../components/ui/Modal';
import { Boton } from '../../components/ui/Boton';
import { Imagen } from '../../components/dominio/Imagen';

interface Tema {
  id: string;
  texto: string;
  test: RegExp;
}

const TEMAS: Tema[] = [
  { id: 'reina', texto: 'Elección de reina', test: /reina/i },
  { id: 'departamental', texto: 'Elección departamental', test: /departamental/i },
  { id: 'estudiantina', texto: 'Estudiantina', test: /estudiantina/i },
];

function coincide(item: { titulo: string; categoria: string }, tema: Tema): boolean {
  return tema.test.test(item.titulo) || tema.test.test(item.categoria);
}

export function Galeria() {
  const { actividades, instituciones } = useApp();
  const [tema, setTema] = useState<string>('todos');
  const [indice, setIndice] = useState<number | null>(null);

  const fotos = useMemo(() => galeriaActual(), []);
  const temasDisponibles = useMemo(
    () => TEMAS.filter((t) => fotos.some((f) => coincide(f, t))),
    [fotos]
  );

  const visibles = useMemo(
    () => (tema === 'todos' ? fotos : fotos.filter((f) => coincide(f, TEMAS.find((t) => t.id === tema)!))),
    [fotos, tema]
  );

  const fotoActual = indice !== null ? visibles[indice] : undefined;
  const institucionActual = fotoActual
    ? instituciones.find((i) => i.id === institucionDeGaleria(fotoActual, actividades))
    : undefined;

  const mover = (paso: number) => {
    if (indice === null || visibles.length === 0) return;
    setIndice((indice + paso + visibles.length) % visibles.length);
  };

  return (
    <>
      {/* Encabezado */}
      <section className="bg-gradient-to-br from-violeta via-violeta-oscuro to-violeta text-blanco rejilla-textura">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="text-xs font-black uppercase tracking-widest text-amarillo">
            Galería actual
          </span>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Fotografías</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blanco/85 sm:text-base">
            Un recorrido por las actividades, celebraciones y momentos destacados que viven las Promos a lo largo del ciclo electivo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filtros por tema */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTema('todos')}
            className={cx(
              'rounded-full px-4 py-2 text-xs font-bold transition',
              tema === 'todos'
                ? 'bg-violeta text-blanco shadow'
                : 'bg-blanco text-violeta-oscuro ring-1 ring-violeta/20 hover:bg-violeta/10'
            )}
          >
            Todas
          </button>
          {temasDisponibles.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTema(t.id)}
              className={cx(
                'rounded-full px-4 py-2 text-xs font-bold transition',
                tema === t.id
                  ? 'bg-violeta text-blanco shadow'
                  : 'bg-blanco text-violeta-oscuro ring-1 ring-violeta/20 hover:bg-violeta/10'
              )}
            >
              {t.texto}
            </button>
          ))}
          <span className="ml-auto text-xs font-semibold text-negro/55">
            {visibles.length} {visibles.length === 1 ? 'fotografía' : 'fotografías'}
          </span>
        </div>

        {/* Rejilla */}
        <div className="mt-6">
          {visibles.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibles.map((foto, i) => {
                const institucion = instituciones.find(
                  (inst) => inst.id === institucionDeGaleria(foto, actividades)
                );
                return (
                  <button
                    key={foto.id}
                    type="button"
                    onClick={() => setIndice(i)}
                    className="group relative block overflow-hidden rounded-2xl bg-violeta text-left shadow-sm ring-1 ring-violeta/15 transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Imagen
                      src={foto.imagen}
                      alt={foto.titulo}
                      etiqueta="Imagen pendiente"
                      className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-blanco/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-violeta-oscuro">
                      {foto.categoria}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-negro/90 to-transparent p-4">
                      <span className="block text-sm font-bold text-blanco">{foto.titulo}</span>
                      {institucion && (
                        <span className="mt-0.5 block text-xs font-semibold text-amarillo">
                          {institucion.nombre}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <EstadoVacio
              titulo="Todavía no hay fotografías en este tema"
              mensaje="Cuando se incorporen fotografías de este tema van a mostrarse en esta galería."
              icono={<Images size={34} />}
            />
          )}
        </div>
      </section>

      {/* Visor ampliado */}
      {fotoActual && (
        <Modal
          abierto
          titulo={fotoActual.titulo}
          onCerrar={() => setIndice(null)}
          ancho="max-w-3xl"
          pie={
            <div className="flex items-center justify-between gap-4">
              <Boton
                variante="secundario"
                tamano="chico"
                onClick={() => mover(-1)}
                icono={<ChevronLeft size={16} />}
              >
                Anterior
              </Boton>
              <span className="text-xs font-bold text-negro/60">
                {(indice ?? 0) + 1} de {visibles.length}
              </span>
              <Boton
                variante="secundario"
                tamano="chico"
                onClick={() => mover(1)}
                icono={<ChevronRight size={16} />}
              >
                Siguiente
              </Boton>
            </div>
          }
        >
          <Imagen
            src={fotoActual.imagen}
            alt={fotoActual.titulo}
            etiqueta="Imagen pendiente"
            className="max-h-[55vh] w-full rounded-2xl bg-violeta object-contain"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-violeta-oscuro">{fotoActual.titulo}</p>
              <p className="text-xs text-negro/60">{fotoActual.categoria}</p>
            </div>
            {institucionActual && (
              <p className="text-xs font-semibold text-violeta">{institucionActual.nombre}</p>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
