import { render, screen } from '@testing-library/react'

test('jsdom + testing-library 설정 확인', () => {
  render(<h1>TaskFlow</h1>)
  expect(screen.getByRole('heading', { name: 'TaskFlow' })).toBeInTheDocument()
})
