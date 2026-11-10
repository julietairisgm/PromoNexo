import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { TriangleAlert } from 'lucide-react';
import { cx } from '../../utils';

export const claseEntrada =
  'w-full rounded-xl border border-humo bg-blanco px-3.5 py-2.5 text-sm text-negro placeholder:text-negro/40 transition focus:border-violeta focus:outline-none focus:ring-4 focus:ring-violeta/15';

interface PropsCampo {
  etiqueta: string;
  children: ReactNode;
  ayuda?: string;
  error?: string;
}

export function Campo({ etiqueta, children, ayuda, error }: PropsCampo) {
  return (
    <div className="block">
      <span className="mb-1.5 block text-sm font-semibold text-violeta-oscuro">{etiqueta}</span>
      {children}
      {error ? (
        <span className="mt-1.5 flex items-center gap-1 text-xs font-bold text-violeta-oscuro">
          <TriangleAlert size={13} className="text-amarillo-anaranjado" />
          {error}
        </span>
      ) : (
        ayuda && <span className="mt-1.5 block text-xs text-negro/60">{ayuda}</span>
      )}
    </div>
  );
}

export function Entrada({ className, ...resto }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(claseEntrada, className)} {...resto} />;
}

export function Seleccion({ className, ...resto }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cx(claseEntrada, 'appearance-none pr-8', className)} {...resto} />;
}

export function AreaTexto({ className, ...resto }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(claseEntrada, 'min-h-28 resize-y', className)} {...resto} />;
}
