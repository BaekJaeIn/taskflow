import { Link } from 'react-router-dom'
import Login from '../components/Login'

export default function LoginPage() {
  // TODO: 백엔드 API 연동 전까지는 검증된 입력만 전달받습니다.
  return (
    <div className="flex flex-col gap-4 px-4 py-16">
      <Login onLogin={() => {}} />
      <p className="text-center text-sm text-gray-600">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="font-medium text-indigo-600 hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  )
}
