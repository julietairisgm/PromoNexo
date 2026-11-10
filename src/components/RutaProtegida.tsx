import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Rol } from '../types';
import { BotonEnlace } from './ui/Boton';
import { CICLO } from '../data/demo';

/**
 * Protege los paneles privados:
 * - sin sesión → redirige al inicio de sesión;
 * - con un rol distinto al permitido → muestra el aviso de acceso no autorizado.
 */
export function RutaProtegida({ rol, children }: { rol: Rol; children: ReactNode }) {
  const { sesion } = useApp();
  const ubicacion = useLocation();

  if (!sesion) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }

  if (sesion.rol !== rol) {
    return <NoAutorizado />;
  }

  return <>{children}</>;
}

export function NoAutorizado() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-fondo px-4 py-10 text-center">
      <div className="w-full max-w-md rounded-3xl bg-blanco p-8 shadow-xl ring-1 ring-violeta/10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amarillo/30 text-violeta-oscuro ring-1 ring-amarillo-anaranjado/60">
          <ShieldAlert size={30} />
        </span>
        <h1 className="mt-5 text-xl font-extrabold text-violeta-oscuro">Acceso no autorizado</h1>
        <p className="mt-2 text-sm leading-relaxed text-negro/70">
          Tu rol no tiene permiso para ingresar en esta sección. Iniciá sesión con una cuenta
          habilitada para continuar.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <BotonEnlace to="/login" variante="primario">
            Ir a iniciar sesión
          </BotonEnlace>
          <BotonEnlace to="/" variante="secundario">
            Volver al inicio
          </BotonEnlace>
        </div>
        <p className="mt-6 text-xs text-negro/50">PromoNexo · Ciclo {CICLO}</p>
      </div>
    </div>
  );
}
