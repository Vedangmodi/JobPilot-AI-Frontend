import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/useAuth'
import AIHistoryPage from './pages/AIHistoryPage'
import AIToolsPage from './pages/AIToolsPage'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import ApplicationsPage from './pages/ApplicationsPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import NewApplicationPage from './pages/NewApplicationPage'
import NotFoundPage from './pages/NotFoundPage'
import SignupPage from './pages/SignupPage'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />}
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/applications/new" element={<NewApplicationPage />} />
        <Route path="/applications/:id" element={<ApplicationDetailPage />} />
        <Route path="/ai-tools" element={<AIToolsPage />} />
        <Route path="/ai-history" element={<AIHistoryPage />} />
      </Route>

      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
