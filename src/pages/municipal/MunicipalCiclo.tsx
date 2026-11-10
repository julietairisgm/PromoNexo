import { useState } from 'react';
import {
  Award,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Info,
  Newspaper,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CICLO, NOTA_DEMO, mejorHinchada, rankingEstudiantina } from '../../data/demo';
import { formatearFecha } from '../../utils';
import { Boton } from '../../components/ui/Boton';
import { Confirmacion } from '../../components/ui/Confirmacion';
import { PaginaPanel, Tarjeta, TarjetaDato } from '../../components/ui/Tarjeta';
import { Etiqueta, EtiquetaEstadoActividad } from '../../components/ui/Etiquetas';
import { BarrasPuntuaciones } from '../../components/dominio/Ranking';
import { TarjetaMejorHinchada } from '../../components/dominio/TarjetaReconocimiento';

export function MunicipalCiclo() {
  const {
    instituciones,
    actividades,
    reconocimientos,
    publicaciones,
    evidencias,
    restablecerDatos,
  } = useApp();
  const [confirmarReset, setConfirmarReset] = useState(false);

  const proximas = actividades
    .filter((a) => a.estado === 'proxima')
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  const evidenciasPendientes = evidencias.filter((e) => e.estado === 'pendiente');
  const publicacionesPublicadas = publicaciones.filter((p) => p.estado === 'publicada');

  return (
    <PaginaPanel
      titulo="Información general del ciclo"
      descripcion={`Resumen del ciclo ${CICLO} de las promociones estudiantiles de San Pedro de Jujuy.`}
    >
      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TarjetaDato valor={instituciones.length} texto="Instituciones" icono={<Building2 size={18} />} />
        <TarjetaDato valor={actividades.length} texto="Actividades" icono={<CalendarDays size={18} />} />
        <TarjetaDato
          valor={evidenciasPendientes.length}
          texto="Evidencias pendientes"
          icono={<ClipboardCheck size={18} />}
        />
        <TarjetaDato
          valor={publicacionesPublicadas.length}
          texto="Publicaciones activas"
          icono={<Newspaper size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Puntuaciones */}
        <Tarjeta className="p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violeta">
              <Trophy size={16} /> Estudiantina {rankingEstudiantina.ciclo}
            </h2>
            <Etiqueta tono="suave">Top 5</Etiqueta>
          </div>
          <div className="mt-5">
            <BarrasPuntuaciones
              resultados={rankingEstudiantina.resultados}
              instituciones={instituciones}
            />
          </div>
          <Link
            to="/estudiantina/puntuaciones"
            className="mt-5 inline-block text-xs font-bold text-violeta hover:text-violeta-oscuro"
          >
            Ver puntuaciones públicas →
          </Link>
        </Tarjeta>

        {/* Reconocimiento destacado */}
        <div className="space-y-5">
          <TarjetaMejorHinchada
            reconocimiento={mejorHinchada}
            instituciones={instituciones}
          />
          <Tarjeta className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-verde">
              <Award size={16} /> Reconocimientos generales
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {reconocimientos.map((reconocimiento) => (
                <li
                  key={reconocimiento.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-fondo px-3.5 py-2.5 ring-1 ring-violeta/10"
                >
                  <span className="font-semibold text-violeta-oscuro">
                    {reconocimiento.categoria}
                  </span>
                  <span className="truncate text-xs text-negro/60">
                    {instituciones.find((i) => i.id === reconocimiento.institucionId)?.nombre}
                  </span>
                </li>
              ))}
              {reconocimientos.length === 0 && (
                <li className="text-negro/60">Sin reconocimientos cargados.</li>
              )}
            </ul>
          </Tarjeta>
        </div>
      </div>

      {/* Próximas actividades */}
      <Tarjeta className="p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violeta">
            <CalendarDays size={16} /> Actividades próximas
          </h2>
          <Link
            to="/panel/municipal/actividades"
            className="text-xs font-bold text-violeta hover:text-violeta-oscuro"
          >
            Gestionar actividades →
          </Link>
        </div>
        {proximas.length > 0 ? (
          <ul className="mt-4 divide-y divide-humo">
            {proximas.map((actividad) => (
              <li key={actividad.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-bold text-violeta-oscuro">{actividad.nombre}</p>
                  <p className="text-xs text-negro/60">
                    {formatearFecha(actividad.fecha)} · {actividad.hora} h · {actividad.lugar}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-negro/60">
                    {instituciones.find((i) => i.id === actividad.institucionId)?.nombre}
                  </span>
                  <EtiquetaEstadoActividad estado={actividad.estado} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-negro/60">No hay actividades próximas registradas.</p>
        )}
      </Tarjeta>

      <Confirmacion
        abierto={confirmarReset}
        titulo="Restablecer datos de demostración"
        mensaje="Se van a descartar todos los cambios realizados durante la demostración (actividades, instituciones, propuestas, evidencias y publicaciones) y volverán los datos iniciales del JSON. Tu sesión se mantiene activa."
        textoConfirmar="Restablecer"
        onConfirmar={() => {
          restablecerDatos();
          setConfirmarReset(false);
        }}
        onCancelar={() => setConfirmarReset(false)}
      />
    </PaginaPanel>
  );
}
