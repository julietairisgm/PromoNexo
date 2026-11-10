import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { cx } from '../../utils';

export const claseTarjeta = 'rounded-2xl bg-blanco shadow-sm ring-1 ring-violeta/10';

export function Tarjeta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx(claseTarjeta, className)}>{children}</div>;
}

interface PropsBuscador {
  valor: string;
  onCambio: (valor: string) => void;
  placeholder?: string;
  className?: string;
  etiqueta?: string;
}

export function Buscador({ valor, onCambio, placeholder = 'Buscar…', className, etiqueta }: PropsBuscador) {
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      {etiqueta && (
        <label className="text-sm font-semibold text-negro">
          {etiqueta}
        </label>
      )}

      <div className="relative">
        <Search
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-violeta/70"
        />

        <input
          type="search"
          value={valor}
          onChange={(evento) => onCambio(evento.target.value)}
          placeholder={placeholder}
          className={cx(
            'w-full rounded-xl border border-humo bg-blanco py-2.5 pl-10 pr-3.5 text-sm text-negro placeholder:text-negro/40 transition focus:border-violeta focus:outline-none focus:ring-4 focus:ring-violeta/15'
          )}
        />
      </div>
    </div>
  );
}

interface PropsVacio {
  titulo: string;
  mensaje: string;
  icono?: ReactNode;
  children?: ReactNode;
}

export function EstadoVacio({ titulo, mensaje, icono, children }: PropsVacio) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violeta/25 bg-blanco/60 px-6 py-12 text-center">
      {icono && <div className="mb-3 text-violeta/60">{icono}</div>}
      <h3 className="text-base font-bold text-violeta-oscuro">{titulo}</h3>
      <p className="mt-1 max-w-md text-sm text-negro/65">{mensaje}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

interface PropsEncabezado {
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
}

/** Encabezado de sección del sitio público. */
export function EncabezadoSeccion({ titulo, descripcion, accion }: PropsEncabezado) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-violeta-oscuro sm:text-2xl">
          {titulo}
        </h2>
        {descripcion && <p className="mt-1 text-sm text-negro/65">{descripcion}</p>}
      </div>
      {accion}
    </div>
  );
}

interface PropsDato {
  valor: string | number;
  texto: string;
  icono?: ReactNode;
  className?: string;
}

/** Tarjeta de estadística para los paneles. */
export function TarjetaDato({ valor, texto, icono, className }: PropsDato) {
  return (
    <div className={cx('rounded-2xl bg-blanco p-4 shadow-sm ring-1 ring-violeta/10', className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-2xl font-black text-violeta-oscuro">{valor}</p>
        {icono && <span className="rounded-xl bg-violeta/10 p-2 text-violeta">{icono}</span>}
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-negro/55">{texto}</p>
    </div>
  );
}

interface PropsPaginaPanel {
  titulo: string;
  descripcion?: string;
  acciones?: ReactNode;
  children: ReactNode;
}

export function PaginaPanel({ titulo, descripcion, acciones, children }: PropsPaginaPanel) {
  return (
    <div className="animar-entrada space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-violeta-oscuro">{titulo}</h1>
          {descripcion && <p className="mt-1 max-w-3xl text-sm leading-relaxed text-negro/70">{descripcion}</p>}
        </div>
        {acciones && <div className="flex flex-wrap gap-2">{acciones}</div>}
      </header>
      {children}
    </div>
  );
}
