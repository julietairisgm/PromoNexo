/** Une clases condicionales ignorando vacíos. */
export function cx(...partes: Array<string | false | null | undefined>): string {
  return partes.filter(Boolean).join(' ');
}

/**
 * Normaliza las rutas de imagen del JSON ("/images/...") para que funcionen
 * también al abrir el build desde el disco (base './' + HashRouter).
 */
export function rutaImagen(ruta?: string): string {
  if (!ruta) return '';
  return ruta.startsWith('/') ? ruta.slice(1) : ruta;
}

export function formatearFecha(fecha?: string): string {
  if (!fecha) return '—';
  const partes = fecha.split('-');
  if (partes.length !== 3) return fecha;
  const fechaObj = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
  return fechaObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatearFechaCorta(fecha?: string): string {
  if (!fecha) return '—';
  const partes = fecha.split('-');
  if (partes.length !== 3) return fecha;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export function formatearPuntaje(puntaje: number): string {
  return puntaje.toLocaleString('es-AR');
}

/** Iniciales para escudos genéricos (no reemplaza al nombre completo). */
export function iniciales(nombre: string): string {
  const palabras = nombre
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((p) => p.length > 2);
  const elegidas = palabras.slice(0, 2);
  if (elegidas.length === 0) return nombre.slice(0, 2).toUpperCase();
  return elegidas.map((p) => p[0]).join('').toUpperCase();
}

export function generarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export function generarId(prefijo: string): string {
  return `${prefijo}-${Date.now().toString(36)}${Math.floor(Math.random() * 900 + 100)}`;
}

/** ¿El dato marcado por el JSON es ficticio / de demostración? */
export function esDatoDemo(dato?: string): boolean {
  if (!dato) return false;
  const d = dato.toLowerCase();
  return d.includes('ficticio') || d.includes('demostr') || d.includes('pendiente') || d.includes('contenido de demo');
}
