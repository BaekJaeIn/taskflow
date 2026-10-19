import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect } from 'vitest'
import App from '../src/App'
import AuthProvider from '../src/auth/AuthProvider'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  )

describe('App routing', () => {
  test('홈 페이지에 회원가입/로그인 링크가 있다', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: 'TaskFlow' })).toBeInTheDocument()
    const register = screen.getAllByRole('link', { name: '회원가입' })
    const login = screen.getAllByRole('link', { name: '로그인' })
    expect(register.every((a) => a.getAttribute('href') === '/register')).toBe(true)
    expect(login.every((a) => a.getAttribute('href') === '/login')).toBe(true)
  })

  test('/login 에서 로그인 폼을 보여준다', () => {
    renderAt('/login')
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  test('/register 에서 회원가입 폼을 보여준다', () => {
    renderAt('/register')
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument()
  })

  test('로그인하지 않고 /dashboard 에 접근하면 로그인 페이지로 이동한다', () => {
    renderAt('/dashboard')
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '대시보드' })).not.toBeInTheDocument()
  })
})
