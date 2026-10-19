import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { request, tokenStorage } from '../lib/api'
import { AuthContext, type Credentials } from './AuthContext'

type AuthResponse = { token: string }

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStorage.get())

  const authenticate = useCallback(async (path: string, credentials: Credentials) => {
    const { token } = await request<AuthResponse>(path, { method: 'POST', json: credentials })
    tokenStorage.set(token)
    setToken(token)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: token !== null,
      login: (c: Credentials) => authenticate('/auth/login', c),
      register: (c: Credentials) => authenticate('/auth/register', c),
      logout: () => {
        tokenStorage.clear()
        setToken(null)
      },
    }),
    [token, authenticate],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
