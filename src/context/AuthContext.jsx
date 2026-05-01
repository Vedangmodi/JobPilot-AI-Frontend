import { useMemo, useState } from 'react'
import { storage } from '../api/client'
import { AuthContext } from './AuthContextValue'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storage.getUser())
  const [token, setTokenState] = useState(storage.getToken())

  const setAuth = ({ token: authToken, name, email }) => {
    storage.setToken(authToken)
    storage.setUser({ name, email })
    setTokenState(authToken)
    setUser({ name, email })
  }

  const logout = () => {
    storage.clearAuth()
    setTokenState(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      setAuth,
      logout,
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
