import { Link } from 'react-router-dom';
import { Marca } from '../dominio/Logo';
import { CICLO } from '../../data/demo';

const COLUMNAS = [
  {
    titulo: 'Secciones',
    enlaces: [
      { ruta: '/', texto: 'Inicio' },
      { ruta: '/actividades', texto: 'Actividades' },
      { ruta: '/galeria', texto: 'Galería actual' },
      { ruta: '/anuario', texto: 'Anuario 2026' },
    ],
  },
  {
    titulo: 'Estudiantina',
    enlaces: [
      { ruta: '/estudiantina/puntuaciones', texto: 'Puntuaciones' },
      { ruta: '/estudiantina/reconocimientos', texto: 'Reconocimientos' },
    ],
  },
  {
    titulo: 'Acceso',
    enlaces: [{ ruta: '/login', texto: 'Iniciar sesión' }],
  },
];

export function SitioFooter() {
  return (
    <footer className="bg-negro text-blanco">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div>
          <Marca />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-blanco/75">
            Plataforma para gestionar, difundir y facilitar la participación en las actividades de
            las promociones estudiantiles de San Pedro de Jujuy.
          </p>
        </div>

        {COLUMNAS.map((columna) => (
          <nav key={columna.titulo} aria-label={columna.titulo}>
            <h3 className="text-xs font-black uppercase tracking-wider text-amarillo">
              {columna.titulo}
            </h3>
            <ul className="mt-3 space-y-2">
              {columna.enlaces.map((enlace) => (
                <li key={enlace.ruta}>
                  <Link
                    to={enlace.ruta}
                    className="text-sm text-blanco/80 transition hover:text-amarillo"
                  >
                    {enlace.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-verde/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-center text-xs text-blanco/60 sm:flex-row sm:items-center sm:justify-center sm:px-6 lg:px-8">
          <p>© {CICLO} PromoNexo · San Pedro de Jujuy</p>
        </div>
      </div>
    </footer>
  );
}
