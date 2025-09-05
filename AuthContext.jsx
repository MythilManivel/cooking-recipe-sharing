import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe().finally(() => setLoading(false))
  }, [])

  const login = async (email, password, isAdmin = false) => {
    const endpoint = isAdmin ? '/auth/admin/login' : '/auth/login'
    const response = await api.post(endpoint, { email, password })
    
    // If login response contains user data, use it directly
    if (response.data.user) {
      setUser(response.data.user)
    } else {
      // Otherwise fetch user data
      await getMe()
    }
  }

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password })
    
    // If register response contains user data, use it directly
    if (response.data.user) {
      setUser(response.data.user)
    } else {
      // Otherwise fetch user data
      await getMe()
    }
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  const getMe = async () => {
    try {
      const res = await api.get('/auth/me')
      setUser(res.data.user)
    } catch {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
