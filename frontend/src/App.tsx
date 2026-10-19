import { Link, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const navLink = 'text-gray-700 hover:text-indigo-600'

export default function App() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="min-h-svh">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-indigo-600">
            TaskFlow
          </Link>
          <div className="flex gap-4 text-sm">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={navLink}>
                  대시보드
                </Link>
                <button type="button" onClick={logout} className={navLink}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navLink}>
                  로그인
                </Link>
                <Link to="/register" className={navLink}>
                  회원가입
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}
