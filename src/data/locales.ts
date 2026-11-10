import type { Evidencia, Propuesta, Publicacion } from '../types';

/**
 * Datos locales de demostración para las funcionalidades de gestión
 * que no están contempladas en datos-demo-promonexo.json
 * (propuestas del delegado, evidencias y publicaciones municipales).
 * Todos son ficticios y forman parte de la demostración del prototipo.
 */

export const propuestasIniciales: Propuesta[] = [
  {
    id: 'propuesta-01',
    titulo: 'Feria de emprendimientos estudiantiles',
    descripcion:
      'Exposición de proyectos sustentables de los cursos, con stands por promoción y venta benéfica.',
    institucionId: 'escuela-comercio',
    fecha: '2026-07-10',
    estado: 'aprobada',
    dato: 'ficticio',
  },
  {
    id: 'propuesta-02',
    titulo: 'Torneo deportivo interpromociones',
    descripcion:
      'Jornada deportiva entre las promociones de la institución, con inscripción gratuita para el alumnado.',
    institucionId: 'escuela-comercio',
    fecha: '2026-09-01',
    estado: 'enviada',
    dato: 'ficticio',
  },
  {
    id: 'propuesta-03',
    titulo: 'Taller de comunicación y redes',
    descripcion:
      'Capacitación para que los delegados aprendan a difundir actividades y propuestas de la institución.',
    institucionId: 'escuela-comercio',
    fecha: '2026-10-20',
    estado: 'borrador',
    dato: 'ficticio',
  },
];

export const evidenciasIniciales: Evidencia[] = [
  {
    id: 'evidencia-01',
    accionId: 'accion-01',
    institucionId: 'tecnica-1',
    categoria: 'colaboracion',
    titulo: 'Colaboración con materiales para la carroza',
    respuesta:
      'Nuestra promoción colaboró con materiales para la construcción de la carroza. Reunimos cartones, pinturas y elementos de decoración entre los estudiantes.',
    archivos: [
      {
        id: 'archivo-01',
        nombre: 'materiales-reunidos.jpg',
        tipo: 'imagen',
        url: '/images/evidencias/materiales-reunidos.jpg',
      },
      {
        id: 'archivo-02',
        nombre: 'entrega-materiales.jpg',
        tipo: 'imagen',
        url: '/images/evidencias/entrega-materiales.jpg',
      },
    ],
    fecha: '2026-11-05',
    estado: 'pendiente',
    dato: 'ficticio',
  },
  {
    id: 'evidencia-02',
    accionId: 'accion-02',
    institucionId: 'escuela-normal',
    categoria: 'solidaridad',
    titulo: 'Campaña solidaria de recolección',
    respuesta:
      'Realizamos una campaña de recolección de alimentos entre los cursos de nuestra institución. Luego organizamos las donaciones para su entrega.',
    archivos: [
      {
        id: 'archivo-03',
        nombre: 'entrega-donaciones.mp4',
        tipo: 'video',
        url: '/images/evidencias/entrega-donaciones.mp4',
      },
    ],
    fecha: '2026-11-06',
    estado: 'pendiente',
    dato: 'ficticio',
  },
  {
    id: 'evidencia-03',
    actividadId: 'actividad-09',
    institucionId: 'escuela-comercio',
    categoria: 'colaboracion',
    titulo: 'Participación en jornada municipal',
    respuesta:
      'Participamos en la jornada de limpieza organizada por la Municipalidad. Colaboramos con la limpieza del espacio y la recolección de residuos.',
    archivos: [
      {
        id: 'archivo-05',
        nombre: 'jornada-limpieza-01.jpg',
        tipo: 'imagen',
        url: '/images/evidencias/jornada-limpieza-01.jpg',
      },
    ],
    fecha: '2026-11-07',
    estado: 'aprobada',
    dato: 'ficticio',
  },
  {
    id: 'evidencia-04',
    accionId: 'accion-03',
    institucionId: 'san-agustin',
    categoria: 'comunicacion',
    titulo: 'Difusión de la Estudiantina',
    respuesta:
      'Compartimos las publicaciones oficiales de la Estudiantina en nuestras redes sociales para promover la participación de la comunidad.',
    archivos: [
      {
        id: 'archivo-07',
        nombre: 'publicacion-redes.jpg',
        tipo: 'imagen',
        url: '/images/evidencias/publicacion-redes.jpg',
      },
    ],
    fecha: '2026-11-08',
    estado: 'rechazada',
    motivoRechazo: 'La captura enviada no permite identificar la publicación ni su fecha.',
    dato: 'ficticio',
  },
];

export const publicacionesIniciales: Publicacion[] = [
  {
    id: 'publicacion-01',
    titulo: 'Arranca el ciclo 2026 de promociones estudiantiles',
    resumen: 'Las instituciones de San Pedro de Jujuy presentan sus actividades para el nuevo ciclo.',
    contenido:
      'Con el inicio del ciclo lectivo, las promociones estudiantiles preparan actividades culturales, solidarias y deportivas. La Municipalidad acompaña con el seguimiento y la validación de cada propuesta a través de PromoNexo.',
    fecha: '2026-03-02',
    autor: 'Municipalidad de San Pedro de Jujuy',
    estado: 'publicada',
    dato: 'ficticio',
  },
  {
    id: 'publicacion-02',
    titulo: 'Calendario de la Estudiantina 2026',
    resumen: 'Fechas, sedes y puntajes del ciclo competitivo de la Estudiantina.',
    contenido:
      'La Estudiantina 2026 reúne a las promociones en distintas instancias. Los puntajes parciales y el reconocimiento a la Mejor Hinchada se publican en la sección Estudiantina de PromoNexo.',
    fecha: '2026-05-08',
    autor: 'Comisión de Promociones',
    estado: 'publicada',
    dato: 'ficticio',
  },
  {
    id: 'publicacion-03',
    titulo: 'Convocatoria a delegados: carga de evidencias',
    resumen: 'Recordatorio para que los delegados suban documentos e informes de sus actividades.',
    contenido:
      'Cada delegación debe registrar la evidencia de las actividades finalizadas para su validación municipal dentro de los diez días hábiles posteriores.',
    fecha: '2026-10-05',
    autor: 'Municipalidad de San Pedro de Jujuy',
    estado: 'borrador',
    dato: 'ficticio',
  },
];

export const comunicadosIniciales = [];