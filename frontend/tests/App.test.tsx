import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect } from 'vitest'
import App from '../src/App'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

describe('App routing', () => {
  test('홈 페이지에 회원가입/로그인 링크가 있다', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: 'TaskFlow' })).toBeInTheDocument()
    const signup = screen.getAllByRole('link', { name: '회원가입' })
    const login = screen.getAllByRole('link', { name: '로그인' })
    expect(signup.every((a) => a.getAttribute('href') === '/signup')).toBe(true)
    expect(login.every((a) => a.getAttribute('href') === '/login')).toBe(true)
  })

  test('/login 에서 로그인 폼을 보여준다', () => {
    renderAt('/login')
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  test('/signup 에서 회원가입 폼을 보여준다', () => {
    renderAt('/signup')
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument()
  })
})
