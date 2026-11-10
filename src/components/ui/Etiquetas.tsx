import type { ReactNode } from 'react';
import { cx } from '../../utils';
import type { EstadoActividad, EstadoEvidencia, EstadoPropuesta } from '../../types';

type Tono = 'violeta' | 'verde' | 'amarillo' | 'negro' | 'suave';

const TONOS: Record<Tono, string> = {
  violeta: 'bg-violeta text-blanco',
  verde: 'bg-verde text-blanco',
  amarillo: 'bg-amarillo text-negro',
  negro: 'bg-negro text-blanco',
  suave: 'bg-violeta/10 text-violeta-oscuro ring-1 ring-violeta/15',
};

interface PropsEtiqueta {
  tono?: Tono;
  children: ReactNode;
  icono?: ReactNode;
  className?: string;
}

export function Etiqueta({ tono = 'suave', children, icono, className }: PropsEtiqueta) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide',
        TONOS[tono],
        className
      )}
    >
      {icono}
      {children}
    </span>
  );
}

export function EtiquetaEstadoActividad({ estado }: { estado: EstadoActividad }) {
  const tono: Tono =
    estado === 'proxima' ? 'verde' : estado === 'finalizada' ? 'suave' : 'negro';
  const texto =
    estado === 'proxima' ? 'Próxima' : estado === 'finalizada' ? 'Finalizada' : 'Cancelada';
  return <Etiqueta tono={tono}>{texto}</Etiqueta>;
}

export function EtiquetaEstadoEvidencia({ estado }: { estado: EstadoEvidencia }) {
  const tono: Tono =
    estado === 'aprobada' ? 'verde' : estado === 'pendiente' ? 'amarillo' : 'negro';
  return <Etiqueta tono={tono}>{estado}</Etiqueta>;
}

export function EtiquetaEstadoPropuesta({ estado }: { estado: EstadoPropuesta }) {
  const tono: Tono = estado === 'aprobada' ? 'verde' : estado === 'enviada' ? 'violeta' : 'amarillo';
  return <Etiqueta tono={tono}>{estado}</Etiqueta>;
}
