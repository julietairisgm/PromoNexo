import { Outlet } from 'react-router-dom';
import { SitioHeader } from './SitioHeader';
import { SitioFooter } from './SitioFooter';

/** Estructura del sitio público (accesible sin iniciar sesión). */
export function SitioLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SitioHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SitioFooter />
    </div>
  );
}
