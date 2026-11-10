import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cx } from '../../utils';
import { Logo } from '../dominio/Logo';
import { BotonEnlace } from '../ui/Boton';

interface ItemMenu {
  ruta: string;
  texto: string;
}

interface SeccionMenu {
  texto: string;
  ruta?: string;
  hijos?: ItemMenu[];
}

const SECCIONES: SeccionMenu[] = [
  { ruta: '/actividades', texto: 'Actividades' },
  {
    texto: 'Estudiantina',
    hijos: [
      { ruta: '/estudiantina/puntuaciones', texto: 'Puntuaciones' },
      { ruta: '/estudiantina/reconocimientos', texto: 'Reconocimientos' },
    ],
  },
  {
    texto: 'Galería',
    hijos: [
      { ruta: '/galeria', texto: 'Galería actual' },
      { ruta: '/anuario', texto: 'Anuario 2026' },
    ],
  },
];

const claseLink = ({ isActive }: { isActive: boolean }) =>
  cx(
    'rounded-lg px-3 py-2 text-md font-bold transition',
    isActive ? 'text-amarillo' : 'text-blanco/85 hover:text-blanco'
  );

export function SitioHeader() {
  const { sesion, cerrarSesion } = useApp();
  const navegar = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [movilAbierto, setMovilAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

  /* Cerrar el menú desplegable al hacer clic fuera o con Escape */
  useEffect(() => {
    if (!menuAbierto) return;
    const alClickear = (evento: MouseEvent) => {
      if (contenedor.current && !contenedor.current.contains(evento.target as Node)) {
        setMenuAbierto(null);
      }
    };
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setMenuAbierto(null);
    };
    document.addEventListener('mousedown', alClickear);
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('mousedown', alClickear);
      document.removeEventListener('keydown', alTeclear);
    };
  }, [menuAbierto]);

  const destinoPanel = sesion?.rol === 'delegado' ? '/panel/delegado' : '/panel/municipal';

  const cerrarTodo = () => {
    setMenuAbierto(null);
    setMovilAbierto(false);
  };

  return (
    <header className="sticky top-0 z-40 shadow-lg">

      <div className="bg-negro text-blanco">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />

          {/* Navegación de escritorio */}
          <nav ref={contenedor} className="hidden items-center gap-1 lg:flex" aria-label="Principal">
            <NavLink to="/" end className={claseLink}>
              Inicio
            </NavLink>
            {SECCIONES.map((seccion) =>
              seccion.hijos ? (
                <div key={seccion.texto} className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuAbierto(menuAbierto === seccion.texto ? null : seccion.texto)}
                    aria-expanded={menuAbierto === seccion.texto}
                    className={cx(
                      'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold transition',
                      menuAbierto === seccion.texto
                        ? 'bg-violeta-oscuro text-amarillo'
                        : 'text-blanco/85 hover:text-blanco'
                    )}
                  >
                    {seccion.texto}
                    <ChevronDown
                      size={15}
                      className={cx('transition-transform', menuAbierto === seccion.texto && 'rotate-180')}
                    />
                  </button>

                  {menuAbierto === seccion.texto && (
                    <div className="animar-entrada absolute left-0 top-full mt-2 w-60 rounded-2xl bg-blanco p-2 shadow-2xl ring-1 ring-violeta/15">
                      {seccion.hijos.map((hijo) => (
                        <NavLink
                          key={hijo.ruta}
                          to={hijo.ruta}
                          onClick={cerrarTodo}
                          className={({ isActive }) =>
                            cx(
                              'block rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                              isActive
                                ? 'bg-violeta/10 text-violeta'
                                : 'text-violeta-oscuro hover:bg-violeta/10'
                            )
                          }
                        >
                          {hijo.texto}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink key={seccion.ruta} to={seccion.ruta!} className={claseLink}>
                  {seccion.texto}
                </NavLink>
              )
            )}
          </nav>

          {/* Acceso a sesión (escritorio) */}
          <div className="hidden items-center gap-2 lg:flex">
            {sesion ? (
              <>
                <BotonEnlace
                  to={destinoPanel}
                  variante="amarillo"
                  tamano="chico"
                  icono={<LayoutDashboard size={15} />}
                >
                  Mi panel
                </BotonEnlace>
                <button
                  type="button"
                  onClick={() => {
                    cerrarSesion();
                    navegar('/');
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold text-blanco/80 transition hover:bg-violeta-oscuro hover:text-blanco"
                >
                  <LogOut size={15} /> Salir
                </button>
              </>
            ) : (
              <BotonEnlace to="/login" variante="amarillo" tamano="chico">
                Iniciar sesión
              </BotonEnlace>
            )}
          </div>

          {/* Menú móvil */}
          <button
            type="button"
            onClick={() => setMovilAbierto((v) => !v)}
            aria-label={movilAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={movilAbierto}
            className="rounded-xl p-2 text-blanco transition hover:bg-violeta-oscuro lg:hidden"
          >
            {movilAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {movilAbierto && (
          <nav
            aria-label="Principal móvil"
            className="animar-entrada border-t border-violeta-oscuro bg-violeta px-4 pb-5 pt-3 lg:hidden"
          >
            <ul className="space-y-1">
              <li>
                <NavLink to="/" end onClick={cerrarTodo} className={claseLink}>
                  Inicio
                </NavLink>
              </li>
              {SECCIONES.map((seccion) => (
                <li key={seccion.texto} className="pt-1">
                  {seccion.hijos ? (
                    <>
                      <span className="block px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amarillo">
                        {seccion.texto}
                      </span>
                      <ul className="ml-2 space-y-1 border-l-2 border-violeta-oscuro pl-3">
                        {seccion.hijos.map((hijo) => (
                          <li key={hijo.ruta}>
                            <NavLink to={hijo.ruta} onClick={cerrarTodo} className={claseLink}>
                              {hijo.texto}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <NavLink to={seccion.ruta!} onClick={cerrarTodo} className={claseLink}>
                      {seccion.texto}
                    </NavLink>
                  )}
                </li>
              ))}
              <li className="pt-3">
                {sesion ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      to={destinoPanel}
                      onClick={cerrarTodo}
                      className="rounded-xl bg-amarillo px-4 py-2.5 text-center text-sm font-bold text-negro"
                    >
                      Ir a mi panel
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        cerrarSesion();
                        cerrarTodo();
                        navegar('/');
                      }}
                      className="rounded-xl bg-violeta-oscuro px-4 py-2.5 text-sm font-bold text-blanco"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={cerrarTodo}
                    className="block rounded-xl bg-amarillo px-4 py-2.5 text-center text-sm font-bold text-negro"
                  >
                    Iniciar sesión
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
