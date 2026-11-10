import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode, } from 'react';
import { actividadesDemo, institucionesDemo, reconocimientosDemo, usuariosDemo, mejorHinchada, CICLO } from '../data/demo';
import { evidenciasIniciales, propuestasIniciales, publicacionesIniciales, comunicadosIniciales } from '../data/locales';
import { calcularTablaEstrellas, type FilaEstrellas, } from '../components/dominio/estrellas';
import type { Actividad, Evidencia, Institucion, Mensaje, Propuesta, Publicacion, Comunicado, Reconocimiento, ReconocimientoEstudiantina, Rol, Sesion, } from '../types';

const CLAVE_STORAGE = 'promonexo-estado-v1';

interface EstadoLocal {
  instituciones: Institucion[];
  actividades: Actividad[];
  propuestas: Propuesta[];
  evidencias: Evidencia[];
  publicaciones: Publicacion[];
  comunicados: Comunicado[];
  reconocimientos: Reconocimiento[];
  reconocimientoEstudiantina: ReconocimientoEstudiantina;
  sesion: Sesion | null;
}

function estadoInicial(): EstadoLocal {
  return {
    instituciones: institucionesDemo,
    actividades: actividadesDemo,
    propuestas: propuestasIniciales,
    evidencias: evidenciasIniciales,
    publicaciones: publicacionesIniciales,
    comunicados: comunicadosIniciales,
    reconocimientos: reconocimientosDemo,
    reconocimientoEstudiantina: mejorHinchada,
    sesion: null,
  };
}

function cargarEstado(): EstadoLocal {
  try {
    const crudo = localStorage.getItem(CLAVE_STORAGE);
    if (!crudo) return estadoInicial();
    const guardado = JSON.parse(crudo) as Partial<EstadoLocal>;
    const base = estadoInicial();
    return {
      instituciones: Array.isArray(guardado.instituciones) ? guardado.instituciones : base.instituciones,
      actividades: Array.isArray(guardado.actividades) ? guardado.actividades : base.actividades,
      propuestas: Array.isArray(guardado.propuestas) ? guardado.propuestas : base.propuestas,
      comunicados: Array.isArray(guardado.comunicados) ? guardado.comunicados : base.comunicados,
      evidencias: Array.isArray(guardado.evidencias) && guardado.evidencias.every(
        (e) =>
          typeof e.institucionId === 'string' &&
          typeof e.respuesta === 'string' && 
          typeof e.categoria === 'string' &&
          ['colaboracion', 'solidaridad', 'comunicacion'].includes(e.categoria) &&
          Array.isArray(e.archivos)
      ) ? guardado.evidencias : base.evidencias,
      publicaciones: Array.isArray(guardado.publicaciones) ? guardado.publicaciones : base.publicaciones,
      reconocimientos: Array.isArray(guardado.reconocimientos)
        ? guardado.reconocimientos
        : base.reconocimientos,
      sesion: guardado.sesion ?? null,
      reconocimientoEstudiantina:
  guardado.reconocimientoEstudiantina ?? base.reconocimientoEstudiantina,
    };
  } catch {
    return estadoInicial();
  }
}

type ResultadoLogin = { ok: boolean; mensaje?: string };

interface ContextoApp {
  instituciones: Institucion[];
  actividades: Actividad[];
  propuestas: Propuesta[];
  evidencias: Evidencia[];
  publicaciones: Publicacion[];
  comunicados: Comunicado[];
  reconocimientos: Reconocimiento[];
  reconocimientoEstudiantina: ReconocimientoEstudiantina;
  sesion: Sesion | null;
  mensaje: Mensaje | null;
  tablaEstrellas: FilaEstrellas[];

  avisar: (texto: string, tipo?: Mensaje['tipo']) => void;
  iniciarSesion: (usuario: string, contrasena: string) => ResultadoLogin;
  cerrarSesion: () => void;

  guardarActividad: (actividad: Actividad) => void;
  eliminarActividad: (id: string) => void;
  guardarInstitucion: (institucion: Institucion) => void;
  eliminarInstitucion: (id: string) => { ok: boolean; mensaje?: string };
  guardarPropuesta: (propuesta: Propuesta) => void;
  eliminarPropuesta: (id: string) => void;
  guardarPublicacion: (publicacion: Publicacion) => void;
  eliminarPublicacion: (id: string) => void;
  guardarComunicado: (comunicado: Comunicado) => void;
  eliminarComunicado: (id: string) => void;
  guardarReconocimiento: (reconocimiento: Reconocimiento) => void;
  eliminarReconocimiento: (id: string) => void;
  guardarReconocimientoEstudiantina: (reconocimiento: ReconocimientoEstudiantina) => void;
  validarEvidencia: (id: string, estado: Evidencia['estado'], motivoRechazo?: string) => void;

  restablecerDatos: () => void;
}

const AppContext = createContext<ContextoApp | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoLocal>(cargarEstado);
  const [mensaje, setMensaje] = useState<Mensaje | null>(null);
  const tablaEstrellas = useMemo(() => calcularTablaEstrellas( estado.instituciones, estado.evidencias, CICLO), [estado.instituciones, estado.evidencias]);

  /* Persistencia local del navegador (sin backend) */
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(estado));
    } catch {
      /* almacenamiento no disponible: la demo sigue en memoria */
    }
  }, [estado]);

  useEffect(() => {
    if (!mensaje) return;
    const tiempo = setTimeout(() => setMensaje(null), 3400);
    return () => clearTimeout(tiempo);
  }, [mensaje]);

  const avisar = useCallback((texto: string, tipo: Mensaje['tipo'] = 'exito') => {
    setMensaje({ id: Date.now(), texto, tipo });
  }, []);

  const iniciarSesion = useCallback((usuario: string, contrasena: string): ResultadoLogin => {
    const encontrado = usuariosDemo.find(
      (u) => u.usuario === usuario.trim().toLowerCase() && u.contrasena === contrasena
    );
    if (!encontrado) {
      return { ok: false, mensaje: 'Usuario o contraseña incorrectos.' };
    }
    const sesion: Sesion = {
      id: encontrado.id,
      usuario: encontrado.usuario,
      rol: encontrado.rol as Rol,
      institucionId: encontrado.institucionId,
    };
    setEstado((prev) => ({ ...prev, sesion }));
    return { ok: true };
  }, []);

  const cerrarSesion = useCallback(() => {
    setEstado((prev) => ({ ...prev, sesion: null }));
    setMensaje({ id: Date.now(), texto: 'Sesión cerrada correctamente.', tipo: 'info' });
  }, []);

  /* ---------- Actividades ---------- */

  const guardarActividad = useCallback((actividad: Actividad) => {
    setEstado((prev) => {
      const existe = prev.actividades.some((a) => a.id === actividad.id);
      return {
        ...prev,
        actividades: existe
          ? prev.actividades.map((a) => (a.id === actividad.id ? actividad : a))
          : [...prev.actividades, actividad],
      };
    });
  }, []);

  const eliminarActividad = useCallback((id: string) => {
    setEstado((prev) => ({ ...prev, actividades: prev.actividades.filter((a) => a.id !== id) }));
  }, []);

  /* ---------- Instituciones ---------- */

  const guardarInstitucion = useCallback((institucion: Institucion) => {
    setEstado((prev) => {
      const existe = prev.instituciones.some((i) => i.id === institucion.id);
      return {
        ...prev,
        instituciones: existe
          ? prev.instituciones.map((i) => (i.id === institucion.id ? institucion : i))
          : [...prev.instituciones, institucion],
      };
    });
  }, []);

  const eliminarInstitucion = useCallback(
    (id: string): ResultadoLogin => {
      const referenciada =
        estado.actividades.some((a) => a.institucionId === id) ||
        estado.reconocimientos.some((r) => r.institucionId === id) ||
        estado.propuestas.some((p) => p.institucionId === id) ||
        estado.evidencias.some((e) => {
  if (e.institucionId === id) return true;

  const actividad = estado.actividades.find(
    (a) => a.id === e.actividadId
  );

  return actividad?.institucionId === id;
});

      if (referenciada) {
        return {
          ok: false,
          mensaje:
            'No se puede eliminar: la institución tiene actividades, propuestas o reconocimientos asociados.',
        };
      }

      setEstado((prev) => ({ ...prev, instituciones: prev.instituciones.filter((i) => i.id !== id) }));
      return { ok: true };
    },
    [estado]
  );

  /* ---------- Propuestas ---------- */

  const guardarPropuesta = useCallback((propuesta: Propuesta) => {
    setEstado((prev) => {
      const existe = prev.propuestas.some((p) => p.id === propuesta.id);
      return {
        ...prev,
        propuestas: existe
          ? prev.propuestas.map((p) => (p.id === propuesta.id ? propuesta : p))
          : [...prev.propuestas, propuesta],
      };
    });
  }, []);

  const eliminarPropuesta = useCallback((id: string) => {
    setEstado((prev) => ({ ...prev, propuestas: prev.propuestas.filter((p) => p.id !== id) }));
  }, []);

  /* ---------- Publicaciones ---------- */

  const guardarPublicacion = useCallback((publicacion: Publicacion) => {
    setEstado((prev) => {
      const existe = prev.publicaciones.some((p) => p.id === publicacion.id);
      return {
        ...prev,
        publicaciones: existe
          ? prev.publicaciones.map((p) => (p.id === publicacion.id ? publicacion : p))
          : [...prev.publicaciones, publicacion],
      };
    });
  }, []);

  const eliminarPublicacion = useCallback((id: string) => {
    setEstado((prev) => ({ ...prev, publicaciones: prev.publicaciones.filter((p) => p.id !== id) }));
  }, []);

  /* ---------- Comunicados ---------- */

const guardarComunicado = useCallback((comunicado: Comunicado) => {
  setEstado((prev) => {
    const existe = prev.comunicados.some((c) => c.id === comunicado.id);

    return {
      ...prev,
      comunicados: existe
        ? prev.comunicados.map((c) =>
            c.id === comunicado.id ? comunicado : c
          )
        : [...prev.comunicados, comunicado],
    };
  });
}, []);

const eliminarComunicado = useCallback((id: string) => {
  setEstado((prev) => ({
    ...prev,
    comunicados: prev.comunicados.filter((c) => c.id !== id),
  }));
}, []);

  /* ---------- Reconocimientos ---------- */

  const guardarReconocimiento = useCallback((reconocimiento: Reconocimiento) => {
    setEstado((prev) => {
      const existe = prev.reconocimientos.some((r) => r.id === reconocimiento.id);
      return {
        ...prev,
        reconocimientos: existe
          ? prev.reconocimientos.map((r) => (r.id === reconocimiento.id ? reconocimiento : r))
          : [...prev.reconocimientos, reconocimiento],
      };
    });
  }, []);

  const guardarReconocimientoEstudiantina = useCallback(
  (reconocimiento: ReconocimientoEstudiantina) => {
    setEstado((prev) => ({
      ...prev,
      reconocimientoEstudiantina: reconocimiento,
    }));
  },
  []
);

  const eliminarReconocimiento = useCallback((id: string) => {
    setEstado((prev) => ({
      ...prev,
      reconocimientos: prev.reconocimientos.filter((r) => r.id !== id),
    }));
  }, []);

  /* ---------- Evidencias ---------- */

  const validarEvidencia = useCallback((id: string, nuevoEstado: Evidencia['estado'], motivoRechazo?: string) => {
    setEstado((prev) => ({
      ...prev,
      evidencias: prev.evidencias.map((e) => (e.id === id ? { ...e, estado: nuevoEstado, motivoRechazo:
                nuevoEstado === 'rechazada' ? motivoRechazo : undefined, } : e)),
    }));
  }, []);

  const restablecerDatos = useCallback(() => {
    try {
      localStorage.removeItem(CLAVE_STORAGE);
    } catch {
      /* sin almacenamiento disponible */
    }
    setEstado((prev) => ({ ...estadoInicial(), sesion: prev.sesion }));
    setMensaje({
      id: Date.now(),
      texto: 'Datos de demostración restablecidos.',
      tipo: 'info',
    });
  }, []);

  const valor = useMemo<ContextoApp>(
    () => ({
      instituciones: estado.instituciones,
      actividades: estado.actividades,
      propuestas: estado.propuestas,
      evidencias: estado.evidencias,
      publicaciones: estado.publicaciones,
      comunicados: estado.comunicados,
      reconocimientos: estado.reconocimientos,
      reconocimientoEstudiantina: estado.reconocimientoEstudiantina,
      sesion: estado.sesion,
      mensaje,
      avisar,
      iniciarSesion,
      cerrarSesion,
      guardarActividad,
      eliminarActividad,
      guardarInstitucion,
      eliminarInstitucion,
      guardarPropuesta,
      eliminarPropuesta,
      guardarPublicacion,
      eliminarPublicacion,
      guardarComunicado,
      eliminarComunicado,
      guardarReconocimiento,
      guardarReconocimientoEstudiantina,
      eliminarReconocimiento,
      validarEvidencia,
      restablecerDatos,
      tablaEstrellas,
    }),
    [
      estado,
      mensaje,
      avisar,
      iniciarSesion,
      cerrarSesion,
      guardarActividad,
      eliminarActividad,
      guardarInstitucion,
      eliminarInstitucion,
      guardarPropuesta,
      eliminarPropuesta,
      guardarPublicacion,
      eliminarPublicacion,
      guardarReconocimiento,
      guardarReconocimientoEstudiantina,
      eliminarReconocimiento,
      validarEvidencia,
      restablecerDatos,
    ]
  );

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}

export function useApp(): ContextoApp {
  const contexto = useContext(AppContext);
  if (!contexto) throw new Error('useApp debe usarse dentro de AppProvider');
  return contexto;
}
