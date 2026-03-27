"use client"

import { useState, useEffect, useRef } from "react"
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
import { motion, AnimatePresence, useAnimation, Transition } from "framer-motion"
import { Lock, Mail, Eye, EyeOff, LogIn, Shield, Key, UserPlus, HelpCircle, Sparkles, UserCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isHovering, setIsHovering] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])
  const [inputFocus, setInputFocus] = useState<'email' | 'password' | null>(null)
  
  const controls = useAnimation()
  const cardRef = useRef<HTMLDivElement>(null)

  // Generar partículas animadas
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 2
    }))
    setParticles(newParticles)
    
    // Animación de entrada
    controls.start({
      scale: [0.8, 1.05, 1],
      opacity: [0, 1],
      rotate: [0, 0],
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        damping: 25
      } as Transition
    })
  }, [controls])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    
    // Efecto de pulso al escribir
    if (cardRef.current) {
      cardRef.current.style.transform = "scale(1.01)"
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.transform = "scale(1)"
        }
      }, 100)
    }
    
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Animación de carga con paradas
    await controls.start({
      scale: [1, 0.99, 1],
      transition: {
        duration: 0.8,
        times: [0, 0.5, 1],
        ease: "easeInOut"
      } as Transition
    })
    
    try {
      const result = await authService.login({
        email: formData.email,
        password: formData.password
      })

      if (result) {
        // Animación de éxito con stop motion
        await controls.start({
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
          transition: {
            duration: 0.5,
            times: [0, 0.25, 0.75, 1],
            ease: "easeInOut"
          } as Transition
        })
        
        toast.success("¡Inicio de sesión exitoso!", {
          icon: "🎉",
          duration: 2000,
          action: {
            label: "Continuar",
            onClick: () => {}
          }
        })
        
        // Redirigir con animación de desvanecimiento
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 800)
      }
    } catch (error) {
      console.error("Error en login:", error)
      
      // Animación de error con stop motion
      await controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: {
          duration: 0.6,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          ease: "easeInOut"
        } as Transition
      })
      
      toast.error("Credenciales incorrectas", {
        description: "Verifique su email y contraseña",
        duration: 3000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      } as Transition
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      } as Transition
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.8,
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 overflow-hidden relative"
    >
      {/* Partículas de fondo animadas */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, index) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-400/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              delay: index * 0.1
            } as Transition}
          />
        ))}
      </div>

      <motion.div
        ref={cardRef}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        whileHover={{ 
          scale: 1.02,
          transition: { 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            duration: 0.3 
          } as Transition
        }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        className="relative"
      >
        {/* Efecto de brillo en hover */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-1000"
          animate={isHovering ? {
            opacity: [0, 0.3, 0],
            scale: [1, 1.05, 1]
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          } as Transition}
        />
        
        <Card className="w-full max-w-md mx-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/30 shadow-2xl relative overflow-hidden">
          {/* Efecto de borde animado */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-indigo-500/20"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            } as Transition}
          />
          
          <CardHeader className="space-y-1 relative z-10">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="inline-block self-center mb-2"
            >
              <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold text-center text-white">
                <UserCircle className="h-5 w-8 inline"/> Sistema de Gestión
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity } as Transition}
                  className="ml-2"
                >
                  <Sparkles className="h-5 w-5 inline" />
                </motion.span>
              </CardTitle>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CardDescription className="text-center text-white/80">
                Ingrese sus credenciales para acceder
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit}>
              <FieldGroup className="space-y-4">
                {/* Email Field */}
                <motion.div
                  variants={itemVariants}
                  whileFocus={{ scale: 1.02 }}
                >
                  <Field>
                    <FieldLabel htmlFor="email" className="text-white flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Correo Electrónico
                    </FieldLabel>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      onFocus={() => setInputFocus('email')}
                      onBlur={() => setInputFocus(null)}
                    >
                      <Input
                        id="email"
                        type="email"
                        placeholder="usuario@ejemplo.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={cn(
                          "bg-white/15 border-white/30 focus:border-cyan-400 focus:ring-cyan-400/50 text-white placeholder:text-white/50 transition-all duration-300",
                          inputFocus === 'email' && "border-cyan-400 shadow-lg shadow-cyan-400/20"
                        )}
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </motion.div>
                  </Field>
                </motion.div>
                
                {/* Password Field */}
                <motion.div
                  variants={itemVariants}
                  whileFocus={{ scale: 1.02 }}
                >
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password" className="text-white flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Contraseña
                      </FieldLabel>
                      <motion.button
                        type="button"
                        onClick={() => toast.info("Funcionalidad en desarrollo")}
                        className="ml-auto text-sm text-white/80 hover:text-white flex items-center gap-1 underline-offset-2 hover:underline"
                        disabled={isLoading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <HelpCircle className="h-3 w-3" />
                        ¿Olvidó su contraseña?
                      </motion.button>
                    </div>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      onFocus={() => setInputFocus('password')}
                      onBlur={() => setInputFocus(null)}
                      className="relative"
                    >
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={cn(
                          "bg-white/15 border-white/30 focus:border-cyan-400 focus:ring-cyan-400/50 text-white placeholder:text-white/50 transition-all duration-300 pr-10",
                          inputFocus === 'password' && "border-cyan-400 shadow-lg shadow-cyan-400/20"
                        )}
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </motion.button>
                    </motion.div>
                  </Field>
                </motion.div>
                
                {/* Submit Button */}
                <motion.div
                  variants={itemVariants}
                  className="space-y-4 pt-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      type="submit" 
                      className={cn(
                        "w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 relative overflow-hidden group",
                        isLoading && "opacity-90"
                      )}
                      disabled={isLoading}
                    >
                      {/* Efecto de brillo en hover */}
                      <motion.div
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                      
                      {/* Contenido del botón */}
                      <span className="flex items-center justify-center relative z-10">
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" } as Transition}
                              className="rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"
                            />
                            Autenticando...
                          </>
                        ) : (
                          <>
                            <LogIn className="h-5 w-5 mr-2" />
                            Iniciar Sesión
                          </>
                        )}
                      </span>
                      
                      {/* Partículas de efecto en hover */}
                      <AnimatePresence>
                        {isHovering && !isLoading && (
                          <>
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                  opacity: [0, 1, 0],
                                  scale: [0, 1, 0],
                                  x: [0, Math.random() * 100 - 50],
                                  y: [0, Math.random() * 50 - 25]
                                }}
                                transition={{
                                  duration: 0.6,
                                  delay: i * 0.1,
                                  times: [0, 0.5, 1]
                                } as Transition}
                              />
                            ))}
                          </>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                  
                  {/* Separador */}
                  <motion.div 
                    className="relative"
                    variants={itemVariants}
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/30"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <motion.span 
                        className="px-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm text-white/70 text-sm py-1 rounded-full border border-white/20"
                        whileHover={{ scale: 1.05 }}
                      >
                        Primer acceso
                      </motion.span>
                    </div>
                  </motion.div>
                  
                  {/* Solicitar acceso */}
                  <motion.div 
                    className="text-center"
                    variants={itemVariants}
                  >
                    <p className="text-sm text-white/80">
                      ¿No tiene una cuenta?{" "}
                      <motion.button
                        type="button"
                        onClick={() => {
                          toast.info("Contacte al administrador del sistema", {
                            icon: "📧",
                            duration: 3000
                          })
                        }}
                        className="text-white hover:text-white/90 font-medium flex items-center gap-1 inline-flex group"
                        disabled={isLoading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span className="underline underline-offset-2">Solicitar acceso</span>
                      </motion.button>
                    </p>
                  </motion.div>
                </motion.div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Animación de teclas cayendo */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/10"
                initial={{ 
                  y: -100,
                  x: Math.random() * window.innerWidth,
                  rotate: 0
                }}
                animate={{ 
                  y: window.innerHeight + 100,
                  rotate: 360,
                  x: Math.random() * window.innerWidth
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "linear"
                } as Transition}
              >
                <Key className="h-8 w-8" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}