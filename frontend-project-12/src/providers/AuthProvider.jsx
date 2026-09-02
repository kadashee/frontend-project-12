import { useCallback, useMemo, useState } from 'react'
import AuthContext from '../contexts/AuthContext.js'

const TOKEN_KEY = 'token'
const USERNAME_KEY = 'username'

const getStoredAuth = () => ({
  token: localStorage.getItem(TOKEN_KEY),
  username: localStorage.getItem(USERNAME_KEY),
})

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth)

  const logIn = useCallback(({ token, username }) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USERNAME_KEY, username)
    setAuth({ token, username })
  }, [])

  const logOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USERNAME_KEY)
    setAuth({ token: null, username: null })
  }, [])

  const value = useMemo(
    () => ({
      token: auth.token,
      username: auth.username,
      isAuthenticated: Boolean(auth.token && auth.username),
      logIn,
      logOut,
    }),
    [auth, logIn, logOut],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export default AuthProvider
