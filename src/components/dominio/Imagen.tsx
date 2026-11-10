import { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { cx, rutaImagen } from '../../utils';

interface Props {
  src?: string;
  alt: string;
  className?: string;
  /** Texto del marcador cuando la imagen todavía no existe */
  etiqueta?: string;
  /** Para fondos decorativos: muestra el relleno sin texto ni ícono */
  decorativo?: boolean;
}

/**
 * Imagen con respaldo visual.
 * Si el archivo no existe se muestra un marcador de "imagen pendiente":
 * basta con colocar la fotografía real en la misma ruta del JSON para reemplazarlo.
 */
export function Imagen({ src, alt, className, etiqueta, decorativo = false }: Props) {
  const ruta = rutaImagen(src);
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    setFallo(false);
  }, [ruta]);

  if (!ruta || fallo) {
    if (decorativo) {
      return (
        <div
          aria-hidden
          className={cx(
            'bg-gradient-to-br from-violeta via-violeta-oscuro to-violeta rejilla-textura',
            className
          )}
        />
      );
    }
    return (
      <div
        className={cx(
          'flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-violeta via-violeta-oscuro to-violeta text-center rejilla-textura',
          className
        )}
      >
        <Camera size={26} className="text-amarillo" aria-hidden />
        <span className="px-4 text-[11px] font-semibold uppercase tracking-wide text-blanco/85">
          {etiqueta ?? 'Imagen pendiente'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={ruta}
      alt={alt}
      loading="lazy"
      onError={() => setFallo(true)}
      className={className}
    />
  );
}
