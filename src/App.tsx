import { Route, Routes } from 'react-router-dom';

import { AppProvider } from './context/AppContext';
import { ToastHost } from './components/ui/Toast';
import { SitioLayout } from './components/layout/SitioLayout';
import { PanelLayout } from './components/layout/PanelLayout';
import { RutaProtegida } from './components/RutaProtegida';

/* Sitio público */
import { Inicio } from './pages/publico/Inicio';
import { Actividades } from './pages/publico/Actividades';
import { ActividadDetalle } from './pages/publico/ActividadDetalle';
import { Puntuaciones } from './pages/publico/Puntuaciones';
import { Reconocimientos } from './pages/publico/Reconocimientos';
import { Galeria } from './pages/publico/Galeria';
import { Anuario } from './pages/publico/Anuario';
import { IniciarSesion } from './pages/publico/IniciarSesion';
import { NoEncontrada } from './pages/publico/NoEncontrada';

/* Panel del delegado */
import { DelegadoResumen } from './pages/delegado/DelegadoResumen';
import { DelegadoInstitucion } from './pages/delegado/DelegadoInstitucion';
import { DelegadoMisActividades } from './pages/delegado/DelegadoMisActividades';
import { DelegadoComunicados } from './pages/delegado/DelegadoComunicados';
import { DelegadoResultados } from './pages/delegado/DelegadoResultados';

/* Panel municipal */
import { MunicipalCiclo } from './pages/municipal/MunicipalCiclo';
import { MunicipalInstituciones } from './pages/municipal/MunicipalInstituciones';
import { MunicipalComunicados } from './pages/municipal/MunicipalComunicados';
import { MunicipalActividades } from './pages/municipal/MunicipalActividades';
import { MunicipalEvidencias } from './pages/municipal/MunicipalEvidencias';
import { MunicipalPublicaciones } from './pages/municipal/MunicipalPublicaciones';
import { MunicipalReconocimientos } from './pages/municipal/MunicipalReconocimientos';

export default function App() {
  return (
    <AppProvider>
      <ToastHost />

      <Routes>
        {/* ---------- Sitio público ---------- */}
        <Route element={<SitioLayout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/actividades" element={<Actividades />} />
          <Route path="/actividades/:id" element={<ActividadDetalle />} />
          <Route path="/estudiantina/puntuaciones" element={<Puntuaciones />} />
          <Route path="/estudiantina/reconocimientos" element={<Reconocimientos />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/anuario" element={<Anuario />} />
          <Route path="/login" element={<IniciarSesion />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>

        {/* ---------- Panel del delegado ---------- */}
        <Route
          path="/panel/delegado"
          element={
            <RutaProtegida rol="delegado">
              <PanelLayout rol="delegado" />
            </RutaProtegida>
          }
        >
          <Route index element={<DelegadoResumen />} />
          <Route path="institucion" element={<DelegadoInstitucion />} />
          <Route path="actividades" element={<DelegadoMisActividades />} />
          <Route path="comunicados" element={<DelegadoComunicados />} />
          <Route path="resultados" element={<DelegadoResultados />} />
        </Route>

        {/* ---------- Panel municipal ---------- */}
        <Route
          path="/panel/municipal"
          element={
            <RutaProtegida rol="administrador">
              <PanelLayout rol="administrador" />
            </RutaProtegida>
          }
        >
          <Route index element={<MunicipalCiclo />} />
          <Route path="instituciones" element={<MunicipalInstituciones />} />
          <Route path="comunicados" element={<MunicipalComunicados />} />
          <Route path="actividades" element={<MunicipalActividades />} />
          <Route path="evidencias" element={<MunicipalEvidencias />} />
          <Route path="publicaciones" element={<MunicipalPublicaciones />} />
          <Route path="reconocimientos" element={<MunicipalReconocimientos />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
