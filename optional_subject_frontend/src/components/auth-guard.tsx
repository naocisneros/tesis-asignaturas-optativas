"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth-service"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true,
  redirectTo = "/login"
}: AuthGuardProps) {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated()

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo)
    } else if (!requireAuth && isAuthenticated) {
      router.push("/") // Redirigir si ya está autenticado
    }
  }, [requireAuth, redirectTo, router])

  // Si está cargando, mostrar spinner o null
  const isAuthenticated = authService.isAuthenticated()
  
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  if (!requireAuth && isAuthenticated) {
    return null // Será redirigido por el useEffect
  }

  return <>{children}</>
}