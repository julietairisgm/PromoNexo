import { useEffect, useState } from 'react';
import { cx, iniciales, rutaImagen } from '../../utils';

interface PropsEscudo {
  nombre: string;
  escudo?: string;
  /** Clases de tamaño, por ejemplo "h-14 w-14" */
  className?: string;
  /** Muestra debajo la leyenda "escudo genérico" cuando no hay archivo oficial */
  mostrarLeyenda?: boolean;
}

/**
 * Escudo institucional.
 * Si la institución no tiene archivo de escudo (o el archivo no existe),
 * se muestra un escudo genérico claramente diferenciado que incluye su nombre.
 * Para reemplazarlo por el escudo oficial: colocar la imagen en la ruta del JSON.
 */
export function Escudo({ nombre, escudo, className = 'h-14 w-14', mostrarLeyenda = false }: PropsEscudo) {
  const ruta = rutaImagen(escudo);
  const [fallo, setFallo] = useState(!ruta);

  useEffect(() => {
    setFallo(!ruta);
  }, [ruta]);

  const generico = (
    <span className="inline-flex flex-col items-center gap-1">
      <EscudoGenerico nombre={nombre} className={className} />
      {mostrarLeyenda && (
        <span className="text-[10px] font-semibold uppercase tracking-wide text-violeta-oscuro/60">
        </span>
      )}
    </span>
  );

  if (!ruta || fallo) return generico;

  return (
    <img
      src={ruta}
      alt={`Escudo de ${nombre}`}
      onError={() => setFallo(true)}
      className={cx('object-contain', className)}
    />
  );
}

/** Escudo genérico con el nombre de la institución (no imita ningún escudo oficial). */
function EscudoGenerico({ nombre, className }: { nombre: string; className: string }) {
  return (
    <svg
      viewBox="0 0 100 120"
      className={className}
      role="img"
      aria-label={`Escudo genérico de ${nombre}`}
    >
      <title>{`Escudo genérico — ${nombre}`}</title>
      <path
        d="M50 3 L94 18 V60 C94 90 75 110 50 117 C25 110 6 90 6 60 V18 Z"
        fill="#401C7C"
        stroke="#5321BF"
        strokeWidth="3"
      />
      <path
        d="M50 9 L88 22 V60 C88 86 72 103 50 110 C28 103 12 86 12 60 V22 Z"
        fill="#5321BF"
      />
      <foreignObject x="15" y="24" width="70" height="74">
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            textAlign: 'center',
            overflow: 'hidden',
            fontFamily: 'inherit',
          }}
        >
          <span
            style={{
              fontSize: '20px',
              fontWeight: 800,
              lineHeight: 1,
              color: '#FFC93C',
            }}
          >
            {iniciales(nombre)}
          </span>
          <span
            style={{
              marginTop: '5px',
              fontSize: '9px',
              fontWeight: 600,
              lineHeight: 1.15,
              color: '#FFFFFF',
              overflow: 'hidden',
              wordBreak: 'break-word',
            }}
          >
            {nombre}
          </span>
        </div>
      </foreignObject>
    </svg>
  );
}
