'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AuthUser {
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const DUMMY_USERS = [
  { email: 'admin@inovtek.id', password: 'dafaprstya', name: 'Admin', role: 'HR Manager' },
  { email: 'hr@inovtek.id', password: 'dafaprstya', name: 'Tim HR', role: 'Recruiter' },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('auth_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const found = DUMMY_USERS.find(u => u.email === email && u.password === password)
    if (found) {
      const authUser = { email: found.email, name: found.name, role: found.role }
      setUser(authUser)
      localStorage.setItem('auth_user', JSON.stringify(authUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
