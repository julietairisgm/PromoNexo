import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Award,
  CalendarDays,
  ClipboardCheck,
  ExternalLink,
  FileText,
  Globe,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  School,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cx } from '../../utils';
import { Marca } from '../dominio/Logo';
import { Etiqueta } from '../ui/Etiquetas';
import { Boton } from '../ui/Boton';
import type { Rol } from '../../types';

interface ItemNav {
  ruta: string;
  texto: string;
  icono: LucideIcon;
  inicio?: boolean;
}

const NAV_DELEGADO: ItemNav[] = [
  { ruta: '/panel/delegado', texto: 'Resumen', icono: LayoutDashboard, inicio: true },
  { ruta: '/panel/delegado/institucion', texto: 'Mi institución', icono: School },
  { ruta: '/panel/delegado/actividades', texto: 'Mis actividades', icono: CalendarDays },
  { ruta: '/panel/delegado/comunicados', texto: 'Comunicados', icono: FileText },
  { ruta: '/panel/delegado/resultados', texto: 'Resultados y reconocimientos', icono: Trophy },
];

const NAV_MUNICIPAL: ItemNav[] = [
  { ruta: '/panel/municipal', texto: 'Información del ciclo', icono: Info, inicio: true },
  { ruta: '/panel/municipal/instituciones', texto: 'Instituciones', icono: School },
  { ruta: '/panel/municipal/comunicados', texto: 'Comunicados', icono: FileText },
  { ruta: '/panel/municipal/actividades', texto: 'Actividades', icono: CalendarDays },
  { ruta: '/panel/municipal/evidencias', texto: 'Evidencias', icono: ClipboardCheck },
  { ruta: '/panel/municipal/publicaciones', texto: 'Publicaciones', icono: Newspaper },
  { ruta: '/panel/municipal/reconocimientos', texto: 'Reconocimientos', icono: Award },
];

/** Estructura de los paneles privados (delegado y administrador municipal). */
export function PanelLayout({ rol }: { rol: Rol }) {
  const { sesion, cerrarSesion } = useApp();
  const ubicacion = useLocation();
  const [abierto, setAbierto] = useState(false);

  const items = rol === 'delegado' ? NAV_DELEGADO : NAV_MUNICIPAL;
  const etiquetaRol = rol === 'delegado' ? 'Delegado' : 'Admin. municipal';
  const colorRol = rol === 'delegado' ? 'bg-verde text-blanco' : 'bg-amarillo text-negro';

  useEffect(() => {
    setAbierto(false);
  }, [ubicacion.pathname]);

  return (
    <div className="min-h-screen bg-fondo lg:flex">
      {/* Barra lateral */}
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-violeta-oscuro text-blanco transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:translate-x-0',
          abierto ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between gap-3 border-b border-violeta/50 px-5">
          <NavLink to="/" aria-label="Ir al sitio público">
            <Marca />
          </NavLink>
          <button
            type="button"
            onClick={() => setAbierto(false)}
            aria-label="Cerrar menú"
            className="rounded-lg p-1.5 hover:bg-violeta lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-4">
          <span
            className={cx(
              'inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider',
              colorRol
            )}
          >
            {etiquetaRol}
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label="Panel">
          {items.map((item) => (
            <NavLink
              key={item.ruta}
              to={item.ruta}
              end={item.inicio}
              className={({ isActive }) =>
                cx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                  isActive
                    ? 'bg-violeta text-blanco shadow'
                    : 'text-blanco/75 hover:bg-violeta/50 hover:text-blanco'
                )
              }
            >
              <item.icono size={18} className="shrink-0" />
              <span>{item.texto}</span>
            </NavLink>
          ))}
        </nav>

        <div className="space-y-2 border-t border-violeta/50 px-3 py-4">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-blanco/75 transition hover:bg-violeta/50 hover:text-blanco"
          >
            <ExternalLink size={18} />
            Volver al sitio público
          </NavLink>
          <div className="flex items-center justify-between gap-2 rounded-xl bg-violeta/40 px-3 py-2.5">
            <span className="min-w-0 truncate text-sm font-bold">{sesion?.usuario}</span>
            <button
              type="button"
              onClick={cerrarSesion}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-blanco/80 transition hover:bg-amarillo hover:text-negro"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </aside>

      {abierto && (
        <div
          className="fixed inset-0 z-30 bg-negro/50 lg:hidden"
          onClick={() => setAbierto(false)}
          aria-hidden
        />
      )}

      {/* Contenido */}
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-humo bg-blanco/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setAbierto(true)}
            aria-label="Abrir menú"
            className="rounded-xl p-2 text-violeta-oscuro transition hover:bg-violeta/10 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <p className="hidden text-sm font-semibold text-violeta-oscuro sm:block">
            Panel {rol === 'delegado' ? 'del delegado' : 'municipal'} · PromoNexo
          </p>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 md:flex">
              <Users size={15} className="text-violeta" />
              <span className="text-sm font-semibold text-negro/70">{sesion?.usuario}</span>
            </span>
            <Etiqueta tono={rol === 'delegado' ? 'verde' : 'amarillo'}>{etiquetaRol}</Etiqueta>
            <Boton variante="secundario" tamano="chico" onClick={cerrarSesion} icono={<LogOut size={14} />}>
              Salir
            </Boton>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-7 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
