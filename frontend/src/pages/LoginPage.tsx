import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Login, { type LoginCredentials } from '../components/Login'
import { ApiError } from '../lib/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string>()

  const handleLogin = async (credentials: LoginCredentials) => {
    setError(undefined)
    try {
      await login(credentials)
      navigate('/dashboard')
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 401
          ? '잘못된 이메일 또는 비밀번호 입니다.'
          : '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
      )
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-16">
      <Login onLogin={handleLogin} error={error} />
      <p className="text-center text-sm text-gray-600">
        계정이 없으신가요?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  )
}
