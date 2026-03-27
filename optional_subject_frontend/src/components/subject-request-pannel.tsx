"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, User, Calendar, Building, AlertCircle, CheckCircle, XCircle, Loader2, CheckSquare, Square, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Subject } from "@/mapped_types/subject.type"

interface Student {
  id: string
  email: string
  name: string
  username: string
  faculty: string
  country?: string
  createdAt?: string
}

interface Request {
  id: string
  option: number
  description?: string
  createdAt?: string
  user: Student
  subject: {
    id: string
    nombre: string
  }
}

interface SubjectRequestsPanelProps {
  subject: Subject | null
  isOpen: boolean
  onClose: () => void
  getAuthToken?: () => string | null
}

export function SubjectRequestsPanel({
  subject,
  isOpen,
  onClose,
  getAuthToken
}: SubjectRequestsPanelProps) {
  const [requests, setRequests] = useState<Request[]>([])
  const [selectedRequests, setSelectedRequests] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const fetchRequests = async () => {
    if (!subject || !subject.id) {
      setRequests([])
      setSelectedRequests([])
      return
    }

    setIsLoading(true)
    
    try {
      const authToken = getAuthToken ? getAuthToken() : null

      const response = await fetch(`http://localhost:8000/api/requests/subject/${subject.id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      
      const formattedRequests = Array.isArray(data) ? data.map((request: any) => ({
        id: request.id,
        option: request.option,
        description: request.description,
        createdAt: request.createdAt,
        user: request.user || {
          id: request.user?.id,
          name: request.user?.name,
          email: request.user?.email,
          username: request.user?.username,
          faculty: request.user?.faculty,
          country: request.user?.country
        },
        subject: request.subject
      })) : []
      
      setRequests(formattedRequests)
      setSelectedRequests([]) // Resetear selecciones al cargar nuevas solicitudes
      
      if (isInitialLoad && formattedRequests.length > 0) {
        toast.success("Solicitudes cargadas", {
          description: `Se encontraron ${formattedRequests.length} solicitudes para ${subject.nombre}`
        })
        setIsInitialLoad(false)
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
      toast.error("Error al cargar solicitudes", {
        description: error instanceof Error ? error.message : "Intenta nuevamente más tarde"
      })
      setRequests([])
      setSelectedRequests([])
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar solicitudes cuando se abra el panel o cambie el subject
  useEffect(() => {
    if (isOpen && subject) {
      fetchRequests()
    }
  }, [subject, isOpen])

  // Función para recargar solicitudes manualmente
  const handleRefresh = () => {
    fetchRequests()
    toast.info("Actualizando solicitudes...")
  }

  // Manejar selección de checkboxes
  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    )
  }

  // Seleccionar/deseleccionar todos
  const handleSelectAll = () => {
    if (selectedRequests.length === requests.length) {
      // Si todos están seleccionados, deseleccionar todos
      setSelectedRequests([])
      toast.info("Todas las solicitudes deseleccionadas")
    } else {
      // Seleccionar todas las solicitudes
      const allRequestIds = requests.map(request => request.id)
      setSelectedRequests(allRequestIds)
      toast.success(`${allRequestIds.length} solicitudes seleccionadas`)
    }
  }

  // Enviar asignaciones masivas
  const handleCompleteAssignments = async () => {
    if (!subject || selectedRequests.length === 0) {
      toast.error("No hay solicitudes seleccionadas", {
        description: "Selecciona al menos una solicitud para asignar"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const authToken = getAuthToken ? getAuthToken() : null

      // Preparar el array de enrollments
      const enrollments = selectedRequests.map(requestId => {
        const request = requests.find(r => r.id === requestId)
        if (!request) throw new Error(`Solicitud ${requestId} no encontrada`)
        
        return {
          userId: request.user.id,
          subjectId: subject.id
        }
      })

      const payload = { enrollments }

      const response = await fetch('http://localhost:8000/api/enrollments/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      toast.success("¡Asignaciones completadas exitosamente!", {
        description: `${selectedRequests.length} estudiantes asignados a ${subject.nombre}`,
        duration: 5000,
        action: {
          label: "Ver detalles",
          onClick: () => console.log("Mostrar detalles de asignaciones")
        }
      })

      // Actualizar las solicitudes (remover las asignadas)
      const remainingRequests = requests.filter(request => !selectedRequests.includes(request.id))
      setRequests(remainingRequests)
      setSelectedRequests([])

      // Si no quedan solicitudes, recargar para ver si hay nuevas
      if (remainingRequests.length === 0) {
        setTimeout(() => fetchRequests(), 1000)
      }

    } catch (error) {
      console.error("Error al completar asignaciones:", error)
      toast.error("Error al asignar estudiantes", {
        description: error instanceof Error ? error.message : "Ha ocurrido un error. Inténtalo nuevamente.",
        duration: 7000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateTime = (date: Date | string | undefined) => {
    if (!date) return 'No disponible'
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return 'Fecha inválida'
      return dateObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  const getOptionColor = (option: number) => {
    if (option <= 5) return "bg-green-100 text-green-800 border-green-200"
    if (option <= 10) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getOptionText = (option: number) => {
    if (option === 1) return "1ra opción"
    if (option === 2) return "2da opción"
    if (option === 3) return "3ra opción"
    return `${option}ta opción`
  }

  const getPriorityStats = () => {
    const highPriority = requests.filter(r => r.option <= 5).length
    const mediumPriority = requests.filter(r => r.option > 5 && r.option <= 10).length
    const lowPriority = requests.filter(r => r.option > 10).length
    
    return { highPriority, mediumPriority, lowPriority, total: requests.length }
  }

  if (!isOpen || !subject) {
    return null
  }

  const stats = getPriorityStats()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mt-8"
    >
      <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          {/* Header del panel */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    Solicitudes para <span className="text-primary">{subject.nombre}</span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <p className="text-muted-foreground">
                      Total: {stats.total} solicitudes
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {subject.estado}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {subject.categoría}
                      </Badge>
                    </div>
                    {selectedRequests.length > 0 && (
                      <Badge className="bg-green-500 text-white">
                        {selectedRequests.length} seleccionadas
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Actualizar"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Cerrar
                </Button>
              </div>
            </div>
          </div>

          {/* Barra de acciones */}
          {requests.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-green-200"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedRequests.length === requests.length && requests.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="h-5 w-5 border-green-500 data-[state=checked]:bg-green-500"
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm font-medium text-green-800 cursor-pointer"
                    >
                      {selectedRequests.length === requests.length && requests.length > 0
                        ? "Deseleccionar todos"
                        : "Seleccionar todos"
                      }
                    </label>
                  </div>
                  
                  {selectedRequests.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        <CheckSquare className="h-3 w-3 mr-1" />
                        {selectedRequests.length} seleccionadas
                      </Badge>
                      <span className="text-sm text-green-700">
                        {Math.round((selectedRequests.length / requests.length) * 100)}% del total
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleCompleteAssignments}
                  disabled={selectedRequests.length === 0 || isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Completar asignaciones ({selectedRequests.length})
                    </>
                  )}
                </Button>
              </div>
              
              {/* Nota informativa */}
              {selectedRequests.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-green-700 mt-2 text-center sm:text-left"
                >
                  Al hacer clic en "Completar asignaciones", se crearán {selectedRequests.length} inscripciones en el sistema
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Contenido del panel */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-12 w-12 text-primary" />
                </motion.div>
                <p className="mt-4 text-lg font-medium">Cargando solicitudes...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Buscando información de solicitudes para {subject.nombre}
                </p>
              </div>
            ) : requests.length > 0 ? (
              <>
                {/* Resumen de opciones */}
                <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          1-5
                        </Badge>
                        <span className="text-sm">Prioridad alta</span>
                        <span className="font-bold text-green-700 ml-1">
                          {stats.highPriority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          6-10
                        </Badge>
                        <span className="text-sm">Prioridad media</span>
                        <span className="font-bold text-yellow-700 ml-1">
                          {stats.mediumPriority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-800">
                          11-14
                        </Badge>
                        <span className="text-sm">Prioridad baja</span>
                        <span className="font-bold text-red-700 ml-1">
                          {stats.lowPriority}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const sorted = [...requests].sort((a, b) => a.option - b.option)
                          setRequests(sorted)
                          toast.success("Solicitudes ordenadas por prioridad")
                        }}
                      >
                        Ordenar por prioridad
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Seleccionar solo prioridad alta
                          const highPriorityIds = requests
                            .filter(r => r.option <= 5)
                            .map(r => r.id)
                          setSelectedRequests(highPriorityIds)
                          toast.success(`${highPriorityIds.length} solicitudes de alta prioridad seleccionadas`)
                        }}
                      >
                        Seleccionar alta prioridad
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lista de solicitudes */}
                <div className="space-y-4">
                  {requests
                    .sort((a, b) => a.option - b.option)
                    .map((request, index) => {
                      const isSelected = selectedRequests.includes(request.id)
                      
                      return (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ 
                            x: 5,
                            backgroundColor: isSelected 
                              ? "rgba(34, 197, 94, 0.05)" 
                              : "rgba(59, 130, 246, 0.03)"
                          }}
                        >
                          <Card className={`overflow-hidden border transition-all duration-300 ${
                            isSelected 
                              ? 'border-green-500 ring-2 ring-green-500/30' 
                              : 'hover:border-primary/30'
                          }`}>
                            <CardContent className="p-5">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Checkbox y información del estudiante */}
                                <div className="flex items-start gap-4">
                                  <div className="flex items-start pt-1">
                                    <Checkbox
                                      id={`request-${request.id}`}
                                      checked={isSelected}
                                      onCheckedChange={() => handleSelectRequest(request.id)}
                                      className="h-5 w-5 border-primary data-[state=checked]:bg-green-500"
                                    />
                                  </div>
                                  
                                  <div className="flex items-center gap-4">
                                    <div className="relative">
                                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        isSelected 
                                          ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/30' 
                                          : 'bg-gradient-to-br from-primary/20 to-primary/30'
                                      }`}>
                                        <User className={`h-6 w-6 ${isSelected ? 'text-green-500' : 'text-primary'}`} />
                                      </div>
                                      <Badge 
                                        className={`absolute -top-2 -right-2 ${getOptionColor(request.option)} ${
                                          isSelected ? 'ring-2 ring-green-500' : ''
                                        }`}
                                      >
                                        {getOptionText(request.option)}
                                      </Badge>
                                    </div>
                                    
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-lg">
                                          {request.user.name}
                                          {isSelected && (
                                            <Badge className="ml-2 bg-green-100 text-green-800 border-green-300">
                                              <CheckSquare className="h-3 w-3 mr-1" />
                                              Seleccionado
                                            </Badge>
                                          )}
                                        </h4>
                                        <Badge variant="outline" className="text-xs">
                                          {request.user.faculty}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {request.user.email}
                                      </p>
                                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>@{request.user.username}</span>
                                        {request.user.country && (
                                          <span className="flex items-center gap-1">
                                            <Building className="h-3 w-3" />
                                            {request.user.country}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Información de la solicitud */}
                                <div className="flex flex-col items-end gap-2">
                                  {request.description && (
                                    <p className="text-sm text-muted-foreground text-right max-w-xs">
                                      "{request.description}"
                                    </p>
                                  )}
                                  {request.createdAt && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      <span>Solicitado: {formatDateTime(request.createdAt)}</span>
                                    </div>
                                  )}
                                  <div className="text-xs text-muted-foreground">
                                    ID: {request.id.substring(0, 8)}...
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                </div>
                
                {/* Estadísticas finales */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-primary/5 rounded-lg"
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {stats.highPriority}
                      </p>
                      <p className="text-sm text-muted-foreground">Prioridad alta</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-500">
                        {stats.mediumPriority}
                      </p>
                      <p className="text-sm text-muted-foreground">Prioridad media</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-500">
                        {stats.lowPriority}
                      </p>
                      <p className="text-sm text-muted-foreground">Prioridad baja</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {stats.total}
                      </p>
                      <p className="text-sm text-muted-foreground">Total solicitudes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {subject.matrícula}
                      </p>
                      <p className="text-sm text-muted-foreground">Matrícula actual</p>
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                </motion.div>
                <h4 className="text-xl font-semibold text-muted-foreground mb-2">
                  No hay solicitudes para esta asignatura
                </h4>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Esta asignatura aún no tiene solicitudes registradas. 
                  Las solicitudes aparecerán aquí una vez que los estudiantes las envíen.
                </p>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Verificar nuevamente"
                  )}
                </Button>
              </div>
            )}

            {/* Información adicional de la asignatura */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-lg font-semibold mb-4">Información de la asignatura</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Sección</p>
                  <p className="font-medium">{subject.sección || 'No definida'}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Categoría</p>
                  <p className="font-medium">{subject.categoría}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p className="font-medium capitalize">{subject.estado}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Profesor</p>
                  <p className="font-medium">{subject.profesor || 'Por asignar'}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}