import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cx } from '../../utils';

export type VarianteBoton = 'primario' | 'secundario' | 'amarillo' | 'verde' | 'peligro' | 'fantasma';
export type TamanoBoton = 'chico' | 'normal' | 'grande';

const VARIANTES: Record<VarianteBoton, string> = {
  primario: 'bg-violeta text-blanco hover:bg-violeta-oscuro shadow-sm',
  secundario: 'bg-blanco text-violeta-oscuro ring-1 ring-violeta/25 hover:bg-verde hover:text-blanco',
  amarillo: 'bg-amarillo text-negro hover:bg-amarillo-anaranjado shadow-sm',
  verde: 'bg-verde text-blanco hover:brightness-95 shadow-sm',
  peligro: 'bg-negro text-blanco hover:bg-violeta-oscuro',
  fantasma: 'text-violeta-oscuro hover:bg-violeta/10',
};

const TAMANOS: Record<TamanoBoton, string> = {
  chico: 'px-3 py-1.5 text-sm gap-1.5 rounded-lg',
  normal: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
  grande: 'px-6 py-3 text-base gap-2 rounded-xl',
};

const BASE =
  'inline-flex items-center justify-center font-semibold transition duration-150 disabled:cursor-not-allowed disabled:opacity-50';

interface PropsBoton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
  icono?: ReactNode;
}

export function Boton({
  variante = 'primario',
  tamano = 'normal',
  icono,
  className,
  children,
  ...resto
}: PropsBoton) {
  return (
    <button className={cx(BASE, VARIANTES[variante], TAMANOS[tamano], className)} {...resto}>
      {icono}
      {children}
    </button>
  );
}

interface PropsEnlace extends LinkProps {
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
  icono?: ReactNode;
}

export function BotonEnlace({
  variante = 'primario',
  tamano = 'normal',
  icono,
  className,
  children,
  ...resto
}: PropsEnlace) {
  return (
    <Link className={cx(BASE, VARIANTES[variante], TAMANOS[tamano], className)} {...resto}>
      {icono}
      {children}
    </Link>
  );
}
