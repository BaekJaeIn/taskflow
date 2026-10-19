import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

export default function App() {
  return (
    <div className="min-h-svh">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-indigo-600">
            TaskFlow
          </Link>
          <div className="flex gap-4 text-sm">
            <Link to="/login" className="text-gray-700 hover:text-indigo-600">
              로그인
            </Link>
            <Link to="/signup" className="text-gray-700 hover:text-indigo-600">
              회원가입
            </Link>
          </div>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </main>
    </div>
  )
}
