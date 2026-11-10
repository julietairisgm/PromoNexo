import { Link } from 'react-router-dom';
import { cx } from '../../utils';

/** Marca PromoNexo: dos eslabones entrelazados (nexo entre promociones). */
export function Marca({ className, compacta = false }: { className?: string; compacta?: boolean }) {
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      
<svg
  viewBox="0 0 100 100"
  className="h-9 w-9 shrink-0"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  {/* Cinta amarilla */}
  <path
    d="M18 15 Q14 12 11 18 L9 24 Q7 28 12 32 L39 52 L22 72 Q18 77 23 82 L28 86 Q32 90 36 85 L54 62 Q58 57 53 53 L18 26 Z"
    fill="#FFC93C"
    stroke="#ffeab6"
  />

  {/* Cinta verde */}
  <path
    d="M82 15 Q86 12 89 18 L91 24 Q93 28 88 32 L61 52 L78 72 Q82 77 77 82 L72 86 Q68 90 64 85 L46 62 Q42 57 47 53 L82 26 Z"
    fill="#7DB921"
    stroke="#ffeab6"
  />

  
  {/* Unión central */}
<path
  d="M37 54 L50 64 L63 54 L57 47 L50 52 L43 47 Z"
  fill="#401C7C"
  stroke="#ffeab6"
  strokeWidth="1.5"
  strokeLinejoin="round"
/>
  
</svg>

      
      {!compacta && (
        <span className="text-xl font-extrabold tracking-tight">
          <span className="text-blanco">Promo</span>
          <span className="text-amarillo">Nexo</span>
        </span>
      )}
    </span>
  );
}

interface PropsLogo {
  className?: string;
  /** Ruta de destino al hacer clic (por defecto, inicio) */
  a?: string;
}

export function Logo({ className, a = '/' }: PropsLogo) {
  return (
    <Link
      to={a}
      aria-label="PromoNexo — ir al inicio"
      className={cx(
        'rounded-xl transition hover:opacity-90',
        className
      )}
    >
      <Marca />
    </Link>
  );
}
