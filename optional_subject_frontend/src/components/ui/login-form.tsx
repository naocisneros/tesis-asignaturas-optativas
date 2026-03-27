"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authService } from "@/lib/auth-service"
import { toast } from "sonner"

interface LoginFormProps extends React.ComponentProps<"div"> {
  onSuccess?: () => void
}

export function LoginForm({
  className,
  onSuccess,
  ...props
}: LoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await authService.login({
        email: formData.email,
        password: formData.password
      })

      if (result) {
        toast.success("¡Inicio de sesión exitoso!")
        
        // Redirigir o llamar callback
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/dashboard") // O tu página principal
        }
      }
    } catch (error) {
      console.error("Error en login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    toast.info("Google login no implementado aún")
    // Implementar OAuth con Google aquí
  }

  const handleForgotPassword = () => {
    toast.info("Funcionalidad de recuperación de contraseña no implementada")
    // Implementar recuperación de contraseña aquí
  }

  const handleRegisterRequest = () => {
    router.push("/register") // Crear página de registro
  }

  return (
    <div className={cn("flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-900 to-blue-900", className)} {...props}>
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex justify-center text-white text-2xl">
            Autenticarse con su cuenta personal
          </CardTitle>
          <CardDescription className="text-white/80 text-center">
            Ingrese sus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="email" className="text-white">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white/90 border-white/30 focus:border-white focus:ring-white"
                  disabled={isLoading}
                />
              </Field>
              
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-white">
                    Contraseña
                  </FieldLabel>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="ml-auto text-sm text-white/80 hover:text-white underline-offset-2 hover:underline"
                    disabled={isLoading}
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white/90 border-white/30 focus:border-white focus:ring-white"
                  disabled={isLoading}
                />
              </Field>
              
              <Field className="space-y-3 pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-white text-cyan-900 hover:bg-white/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Autenticando..." : "Autenticarse"}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/30"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-transparent text-white/70">
                      O continuar con
                    </span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent border-white/30 text-white hover:bg-white/10"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continuar con Google
                </Button>
                
                <FieldDescription className="text-center text-white/80 pt-2">
                  ¿No tiene una cuenta?{" "}
                  <button
                    type="button"
                    onClick={handleRegisterRequest}
                    className="text-white hover:text-white/90 underline underline-offset-2"
                    disabled={isLoading}
                  >
                    Solicitar registro
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}