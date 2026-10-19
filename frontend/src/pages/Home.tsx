import { Link } from 'react-router-dom'

const FEATURES = [
  { title: '간단한 할 일 관리', body: '태스크를 만들고, 완료 처리하고, 삭제하세요.' },
  { title: '나만의 공간', body: '로그인한 사용자 본인의 태스크만 볼 수 있습니다.' },
  { title: '테스트로 검증', body: 'TDD로 개발되어 변경에도 안정적으로 동작합니다.' },
]

export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 px-4 py-20 text-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">TaskFlow</h1>
        <p className="max-w-md text-lg text-gray-600">해야 할 일을 한곳에서 간단하게 관리하는 할 일 관리 앱</p>
      </div>

      <div className="flex gap-3">
        <Link
          to="/signup"
          className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
        >
          회원가입
        </Link>
        <Link
          to="/login"
          className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
        >
          로그인
        </Link>
      </div>

      <ul className="grid w-full gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <li key={f.title} className="rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">{f.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{f.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
