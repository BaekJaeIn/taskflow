import { useState, type FormEvent } from 'react'
import FormField from './FormField'

export type SignupCredentials = { email: string; password: string }

type SignupProps = {
  onSignup: (credentials: SignupCredentials) => void
  /** 서버 등 외부에서 내려온 에러 메시지 */
  error?: string
}

type FieldErrors = Partial<Record<'email' | 'password' | 'passwordConfirm', string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

function validate(email: string, password: string, passwordConfirm: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!email) errors.email = '이메일을 입력해주세요.'
  else if (!EMAIL_PATTERN.test(email)) errors.email = '올바른 이메일 형식이 아닙니다.'

  if (!password) errors.password = '비밀번호를 입력해주세요.'
  else if (password.length < MIN_PASSWORD_LENGTH)
    errors.password = `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`

  if (!passwordConfirm) errors.passwordConfirm = '비밀번호 확인을 입력해주세요.'
  else if (password !== passwordConfirm) errors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
  return errors
}

export default function Signup({ onSignup, error }: SignupProps) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = String(data.get('email') ?? '').trim()
    const password = String(data.get('password') ?? '')
    const passwordConfirm = String(data.get('passwordConfirm') ?? '')

    const errors = validate(email, password, passwordConfirm)
    setFieldErrors(errors)
    if (Object.keys(errors).length === 0) onSignup({ email, password })
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-semibold text-gray-900">회원가입</h1>

      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <FormField label="이메일" name="email" type="email" autoComplete="email" error={fieldErrors.email} />
      <FormField
        label="비밀번호"
        name="password"
        type="password"
        autoComplete="new-password"
        error={fieldErrors.password}
      />
      <FormField
        label="비밀번호 확인"
        name="passwordConfirm"
        type="password"
        autoComplete="new-password"
        error={fieldErrors.passwordConfirm}
      />

      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
      >
        회원가입
      </button>
    </form>
  )
}
