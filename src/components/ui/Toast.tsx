import { CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cx } from '../../utils';

/** Mensajes flotantes de confirmación de acciones. */
export function ToastHost() {
  const { mensaje } = useApp();

  if (!mensaje) return null;

  const estilo =
    mensaje.tipo === 'exito'
      ? 'bg-verde'
      : mensaje.tipo === 'error'
        ? 'bg-violeta-oscuro'
        : 'bg-negro';

  const icono =
    mensaje.tipo === 'exito' ? (
      <CheckCircle2 size={18} />
    ) : mensaje.tipo === 'error' ? (
      <TriangleAlert size={18} />
    ) : (
      <Info size={18} />
    );

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end">
      <div
        role="status"
        className={cx(
          'animar-entrada pointer-events-auto flex max-w-md items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-blanco shadow-2xl',
          estilo
        )}
      >
        {icono}
        <span>{mensaje.texto}</span>
      </div>
    </div>
  );
}
