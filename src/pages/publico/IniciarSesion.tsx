import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, KeyRound, LogIn, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CICLO, usuariosDemo } from '../../data/demo';
import { Boton } from '../../components/ui/Boton';
import { Campo, Entrada } from '../../components/ui/Campos';
import { Marca } from '../../components/dominio/Logo';

export function IniciarSesion() {
  const { sesion, iniciarSesion } = useApp();
  const navegar = useNavigate();
  const ubicacion = useLocation();

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);

  const destinoGuardado = (ubicacion.state as { desde?: string } | null)?.desde;

  if (sesion) {
    return (
      <Navigate
        to={sesion.rol === 'delegado' ? '/panel/delegado' : '/panel/municipal'}
        replace
      />
    );
  }

  const enviar = (evento: FormEvent) => {
    evento.preventDefault();
    const resultado = iniciarSesion(usuario, contrasena);
    if (!resultado.ok) {
      setError(resultado.mensaje ?? 'No se pudo iniciar sesión.');
      return;
    }
    const encontrado = usuariosDemo.find((u) => u.usuario === usuario.trim().toLowerCase());
    const destino =
      destinoGuardado ??
      (encontrado?.rol === 'delegado' ? '/panel/delegado' : '/panel/municipal');
    navegar(destino, { replace: true });
  };

  const usoRapido = (u: string, c: string) => {
    setUsuario(u);
    setContrasena(c);
    setError(null);
  };

  return (
    <section className="grid min-h-[calc(100vh-104px)] lg:grid-cols-2">
      {/* Panel informativo */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violeta via-violeta-oscuro to-violeta px-6 py-12 text-blanco rejilla-textura sm:px-10 lg:py-16">
        <div
          aria-hidden
          className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amarillo/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-md">
          <Marca />
          <h1 className="mt-8 text-3xl font-black leading-tight">
            Iniciá sesión para gestionar tu panel
          </h1>
          
          <div className="mt-6  pt-6">
  <p className="text-sm font-bold text-amarillo">
    Todo lo que sucede en el ciclo estudiantil, en un solo lugar.
  </p>

  <p className="mt-2 text-sm leading-relaxed text-blanco/75">
    Consultá actividades, acompañá la participación de las promociones
    y conocé los momentos más destacados de la Estudiantina de
    San Pedro de Jujuy.
  </p>
</div>

          <p className="mt-6 text-xs text-blanco/60">
  Plataforma de gestión y participación estudiantil · Ciclo {CICLO}
</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <form
          onSubmit={enviar}
          noValidate
          className="w-full max-w-md rounded-3xl bg-blanco p-6 shadow-xl ring-1 ring-violeta/10 sm:p-8"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violeta/10 text-violeta">
            <KeyRound size={24} />
          </span>
          <h2 className="mt-5 text-2xl font-extrabold text-violeta-oscuro">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-negro/60">
            Ingresá tus credenciales para acceder a los paneles.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-4 flex items-center gap-2 rounded-xl bg-amarillo/25 px-3.5 py-2.5 text-sm font-bold text-violeta-oscuro ring-1 ring-amarillo-anaranjado/60"
            >
              <AlertTriangle size={16} className="shrink-0" />
              {error}
            </p>
          )}

          <div className="mt-6 space-y-4">
            <Campo etiqueta="Usuario">
              <Entrada
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ej.: delegado"
                autoComplete="username"
                required
              />
            </Campo>
            <Campo etiqueta="Contraseña">
              <Entrada
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </Campo>
          </div>

          <Boton type="submit" variante="primario" tamano="grande" className="mt-6 w-full" icono={<LogIn size={18} />}>
            Ingresar al panel
          </Boton>

          <p className="mt-5 text-center text-xs text-negro/55">
            ¿Todavía no tenés cuenta? Consultá a la comisión de promociones de tu institución.
          </p>
        </form>
      </div>
    </section>
  );
}
