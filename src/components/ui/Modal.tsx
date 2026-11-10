import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cx } from '../../utils';

interface Props {
  abierto: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
  pie?: ReactNode;
  ancho?: string;
}

export function Modal({ abierto, titulo, onCerrar, children, pie, ancho = 'max-w-2xl' }: Props) {
  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onCerrar();
    };
    document.addEventListener('keydown', alTeclear);
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = anterior;
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  /* Portal a document.body: evita que animaciones o transformaciones de los
     ancestros contenengan al overlay y lo recorten (bug de posicionamiento). */
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-negro/60 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={cx(
          'animar-modal w-full rounded-t-3xl bg-blanco shadow-2xl sm:rounded-3xl',
          ancho
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-humo px-5 py-4 sm:px-6">
          <h2 className="text-lg font-bold text-violeta-oscuro">{titulo}</h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-full p-2 text-negro/60 transition hover:bg-violeta/10 hover:text-violeta-oscuro"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {pie && <div className="border-t border-humo px-5 py-4 sm:px-6">{pie}</div>}
      </div>
    </div>,
    document.body
  );
}
