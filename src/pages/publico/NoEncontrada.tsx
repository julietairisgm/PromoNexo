import { Compass } from 'lucide-react';
import { BotonEnlace } from '../../components/ui/Boton';

export function NoEncontrada() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violeta/10 text-violeta">
        <Compass size={30} />
      </span>
      <h1 className="mt-6 text-4xl font-black text-violeta-oscuro">Página no encontrada</h1>
      <p className="mt-3 text-sm leading-relaxed text-negro/65">
        La ruta que intentás visitar no existe dentro del prototipo PromoNexo.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <BotonEnlace to="/" variante="primario">
          Ir al inicio
        </BotonEnlace>
        <BotonEnlace to="/actividades" variante="secundario">
          Ver actividades
        </BotonEnlace>
      </div>
    </section>
  );
}
