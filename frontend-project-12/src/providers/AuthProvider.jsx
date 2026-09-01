import { useCallback, useMemo, useState } from 'react'
import AuthContext from '../contexts/AuthContext.js'

const TOKEN_KEY = 'token'

const getStoredToken = () => localStorage.getItem(TOKEN_KEY)

function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)

  const logIn = useCallback((newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
  }, [])

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      logIn,
    }),
    [token, logIn],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export default AuthProvider
