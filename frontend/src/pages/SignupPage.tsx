import { Link } from 'react-router-dom'
import Signup from '../components/Signup'

export default function SignupPage() {
  // TODO: 백엔드 API 연동 전까지는 검증된 입력만 전달받습니다.
  return (
    <div className="flex flex-col gap-4 px-4 py-16">
      <Signup onSignup={() => {}} />
      <p className="text-center text-sm text-gray-600">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  )
}
