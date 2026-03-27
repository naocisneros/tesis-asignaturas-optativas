// components/auth-provider.tsx
"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { authService } from "@/lib/auth-service"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Rutas que NO deben mostrar el sidebar (páginas de auth)
  const authRoutes = ["/login", "/register", "/forgot-password"]
  const isAuthRoute = authRoutes.includes(pathname)

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated())
      setIsLoading(false)
    }

    checkAuth()

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [pathname])

  // Si está cargando, mostrar loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  // Si es una ruta de autenticación, mostrar solo el children
  if (isAuthRoute) {
    return <>{children}</>
  }

  // Si no está autenticado y no es una ruta de auth, redirigir a login
  if (!isAuthenticated) {
    // Redirección en el cliente
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return null
  }

  // Si está autenticado, mostrar sidebar + contenido
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}