import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Signup, { type SignupCredentials } from '../components/Signup'
import { ApiError } from '../lib/api'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string>()

  const handleSignup = async (credentials: SignupCredentials) => {
    setError(undefined)
    try {
      await register(credentials)
      navigate('/dashboard')
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 409
          ? '이미 가입된 이메일입니다.'
          : '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.',
      )
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-16">
      <Signup onSignup={handleSignup} error={error} />
      <p className="text-center text-sm text-gray-600">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  )
}
