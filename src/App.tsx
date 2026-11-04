import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthProvider'
import { GuestRoute } from './components/auth/GuestRoute'
import { HomeRedirect } from './components/auth/HomeRedirect'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { VacantesPage } from './pages/VacantesPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
          </Route>

          {/* Inicio: redirige según el rol */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomeRedirect />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
