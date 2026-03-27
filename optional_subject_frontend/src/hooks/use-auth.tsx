import { useState, useEffect } from "react"
import { authService, type User } from "@/lib/auth-service"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = () => {
      const storedUser = authService.getUser()
      setUser(storedUser)
      setIsLoading(false)
    }

    loadUser()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_data') {
        loadUser()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await authService.login({ email, password })
      if (result) {
        setUser(result.user)
      }
      return result
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      // Forzar recarga para que AuthProvider redirija
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }
}