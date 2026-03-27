// lib/auth-service.ts
import { toast } from "sonner"

export interface User {
  id: string
  email: string
  username: string
  name: string
  role?: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  name: string
  password: string
  country?: string
  role?: string
}

class AuthService {
  private baseURL = 'http://localhost:8000/api'
  
  // Verificar si estamos en el cliente (navegador)
  private isClient(): boolean {
    return typeof window !== 'undefined'
  }
  
  // Guardar token en localStorage (solo en cliente)
  private saveToken(token: string, tokenType: 'access' | 'refresh') {
    if (!this.isClient()) return
    
    const key = tokenType === 'access' ? 'access_token' : 'refresh_token'
    localStorage.setItem(key, token)
  }

  // Obtener token del localStorage (solo en cliente)
  private getToken(tokenType: 'access' | 'refresh'): string | null {
    if (!this.isClient()) return null
    
    const key = tokenType === 'access' ? 'access_token' : 'refresh_token'
    return localStorage.getItem(key)
  }

  // Eliminar tokens (solo en cliente)
  private clearTokens() {
    if (!this.isClient()) return
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
  }

  // Guardar usuario en localStorage (solo en cliente)
  private saveUser(user: User) {
    if (!this.isClient()) return
    
    localStorage.setItem('user_data', JSON.stringify(user))
  }

  // Obtener usuario del localStorage (solo en cliente)
  getUser(): User | null {
    if (!this.isClient()) return null
    
    const userStr = localStorage.getItem('user_data')
    return userStr ? JSON.parse(userStr) : null
  }

  // Verificar si está autenticado (solo en cliente)
  isAuthenticated(): boolean {
    if (!this.isClient()) return false
    
    return !!this.getToken('access')
  }

  // Obtener headers con token para las peticiones
  getAuthHeaders(): HeadersInit {
    const token = this.getToken('access')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse | null> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error en la autenticación')
      }

      const data: LoginResponse = await response.json()
      
      // Guardar tokens y usuario
      this.saveToken(data.access_token, 'access')
      this.saveToken(data.refresh_token, 'refresh')
      this.saveUser(data.user)

      toast.success('¡Inicio de sesión exitoso!')
      return data
    } catch (error: any) {
      toast.error('Error al iniciar sesión', {
        description: error.message || 'Credenciales incorrectas'
      })
      return null
    }
  }

  // Registro
  async register(userData: RegisterData): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error en el registro')
      }

      const data = await response.json()
      toast.success('¡Registro exitoso!', {
        description: data.message || 'Usuario creado correctamente'
      })
      return data
    } catch (error: any) {
      toast.error('Error en el registro', {
        description: error.message || 'No se pudo completar el registro'
      })
      return null
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message || 'Sesión cerrada correctamente')
      }
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      // Siempre limpiar localStorage
      this.clearTokens()
      if (this.isClient()) {
        window.location.href = '/login'
      }
    }
  }

  // Refresh token
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getToken('refresh')
      if (!refreshToken) {
        throw new Error('No hay refresh token disponible')
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Refresh token inválido')
      }

      const data = await response.json()
      this.saveToken(data.access_token, 'access')
      return data.access_token
    } catch (error) {
      console.error('Error al refrescar token:', error)
      this.clearTokens()
      if (this.isClient()) {
        window.location.href = '/login'
      }
      return null
    }
  }

  // Interceptor para fetch con auto-refresh
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    let response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    })

    // Si el token expiró, intentar refrescar
    if (response.status === 401) {
      const newToken = await this.refreshToken()
      if (newToken) {
        // Reintentar la petición con el nuevo token
        response = await fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json',
            ...options.headers,
          },
        })
      }
    }

    return response
  }
}

export const authService = new AuthService()