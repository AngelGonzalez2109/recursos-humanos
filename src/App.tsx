import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthProvider'
import { GuestRoute } from './components/auth/GuestRoute'
import { HomeRedirect } from './components/auth/HomeRedirect'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { FullPageLoader } from './components/ui/FullPageLoader'

// Cada página se descarga solo cuando se visita
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const VacantesPage = lazy(() => import('./pages/VacantesPage').then((m) => ({ default: m.VacantesPage })))
const MisPostulacionesPage = lazy(() =>
  import('./pages/MisPostulacionesPage').then((m) => ({ default: m.MisPostulacionesPage })),
)
const VacanteDetailPage = lazy(() =>
  import('./pages/VacanteDetailPage').then((m) => ({ default: m.VacanteDetailPage })),
)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<FullPageLoader />}>
          <Routes>
            {/* Solo visitantes sin sesión */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
            </Route>

            {/* Publicador (reclutador) */}
            <Route element={<ProtectedRoute allowedRole="publicador" />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* Postulante (candidato) */}
            <Route element={<ProtectedRoute allowedRole="postulante" />}>
              <Route path="/vacantes" element={<VacantesPage />} />
              <Route path="/mis-postulaciones" element={<MisPostulacionesPage />} />
            </Route>

            {/* Cualquier usuario autenticado */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/vacantes/:id" element={<VacanteDetailPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
