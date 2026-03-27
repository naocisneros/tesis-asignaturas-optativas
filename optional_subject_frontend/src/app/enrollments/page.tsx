"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Users, BookOpen, Clock, GraduationCap, Loader2, User, Calendar, Building, AlertCircle, FileText, Check, FileSpreadsheet, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { useSubjects } from "@/hooks/use-fetch-subjects"
import { useEnrollments } from "@/hooks/use-fetch-enrollments"
import { Subject } from "@/mapped_types/subject.type"
import { SubjectRequestsPanel } from "@/components/subject-request-pannel"
import { SubjectSearchCarousel } from "@/components/search-subject-panel"
import { EnrollmentCompletionChart } from "@/components/chart-enrollment-completion"

interface SubjectCard {
  subject: Subject
  requestCount: number
  isSelected?: boolean
  selectionOrder?: number
}

export default function EnrollmentDashboard() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [subjectCards, setSubjectCards] = useState<SubjectCard[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [showRequestsPanel, setShowRequestsPanel] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { user, isAuthenticated } = useAuth()
  
  const { subjects, loading: subjectsLoading, error: subjectsError } = useSubjects()
  const { 
    enrollments, 
    loading: enrollmentsLoading, 
    error: enrollmentsError,
    enrollmentStats,
    refresh: refreshEnrollments 
  } = useEnrollments(selectedSubject?.id)

  const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || 
             localStorage.getItem('auth_token') || 
             sessionStorage.getItem('token') ||
             null;
    }
    return null;
  }

  // Transformar subjects reales a SubjectCard
  useEffect(() => {
    if (subjects && subjects.length > 0) {
      const initialCards = subjects.map(subject => ({
        subject,
        requestCount: 0,
        isSelected: false,
        selectionOrder: undefined
      }))
      setSubjectCards(initialCards)
      
      fetchRequestCounts(subjects)
    }
  }, [subjects])

  const fetchRequestCounts = async (subjectsList: Subject[]) => {
    try {
      const authToken = getAuthToken();

      const promises = subjectsList.map(async (subject) => {
        try {
          const response = await fetch(`http://localhost:8000/api/requests/subject/${subject.id}`, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            return { subjectId: subject.id, count: Array.isArray(data) ? data.length : 0 }
          }
          return { subjectId: subject.id, count: 0 }
        } catch {
          return { subjectId: subject.id, count: 0 }
        }
      })
      
      const results = await Promise.all(promises)
      
      setSubjectCards(prev => prev.map(card => {
        const result = results.find(r => r.subjectId === card.subject.id)
        return result ? { ...card, requestCount: result.count } : card
      }))
    } catch (error) {
      console.error("Error fetching request counts:", error)
    }
  }

  const handleSubjectClick = (subject: Subject) => {
    if (!isAuthenticated || !user) {
      toast.error("Acceso restringido", {
        description: "Debes iniciar sesión para ver las solicitudes."
      })
      return
    }

    setSelectedSubject(subject)
    setShowRequestsPanel(true)
  }

  const handleImportFile = () => {
    // Crear input de archivo dinámicamente
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Aquí puedes manejar la importación del archivo
        toast.info("Procesando archivo...", {
          description: `Archivo seleccionado: ${file.name}`
        });
        
        // Simular procesamiento
        setTimeout(() => {
          toast.success("Archivo procesado exitosamente", {
            description: `Se han importado datos de ${file.name}`
          });
        }, 1500);
      }
    };
    
    input.click();
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'No disponible'
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return 'Fecha inválida'
      return dateObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      MATEMATICA: "bg-blue-100 text-blue-800 border-blue-200",
      INFORMATICA: "bg-purple-100 text-purple-800 border-purple-200",
      FISICA: "bg-red-100 text-red-800 border-red-200",
      QUIMICA: "bg-green-100 text-green-800 border-green-200",
      BIOLOGIA: "bg-emerald-100 text-emerald-800 border-emerald-200",
      LENGUAJE: "bg-amber-100 text-amber-800 border-amber-200",
      HISTORIA: "bg-indigo-100 text-indigo-800 border-indigo-200"
    }
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getSectionColor = (section: string) => {
    const colors: Record<string, string> = {
      MATUTINA: "bg-yellow-100 text-yellow-800 border-yellow-200",
      VESPERTINA: "bg-indigo-100 text-indigo-800 border-indigo-200",
      NOCTURNA: "bg-violet-100 text-violet-800 border-violet-200",
      SABATINA: "bg-pink-100 text-pink-800 border-pink-200"
    }
    return colors[section] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStateColor = (estado: string) => {
    const colors: Record<string, string> = {
      disponible: "bg-green-100 text-green-800 border-green-200",
      cerrada: "bg-red-100 text-red-800 border-red-200",
      en_proceso: "bg-yellow-100 text-yellow-800 border-yellow-200",
      completa: "bg-blue-100 text-blue-800 border-blue-200"
    }
    return colors[estado] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  // Estados de carga combinados
  const isLoading = subjectsLoading
  const hasError = subjectsError

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 className="h-12 w-12 text-primary" />
        </motion.div>
        <p className="text-lg font-medium text-foreground">Cargando asignaturas...</p>
        <p className="text-sm text-muted-foreground mt-2">Por favor, espera un momento</p>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-bold text-destructive mb-2">Error al cargar asignaturas</h3>
          <p className="text-destructive/80 mb-4">{subjectsError}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-destructive hover:bg-destructive/90"
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="text-center max-w-md">
          <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No hay asignaturas disponibles</h3>
          <p className="text-muted-foreground">
            No se encontraron asignaturas para mostrar. Intenta nuevamente más tarde.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Encabezado con estadísticas y búsqueda */}
      <div className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground hover:text-green-500 transi">Gestión de Inscripciones</h1>
            <p className="text-muted-foreground mt-1">
              {subjects.length} asignaturas • {subjectCards.reduce((acc, card) => acc + card.requestCount, 0)} solicitudes
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-lg">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{user.name || user.email}</span>
              <Badge variant="outline" className="text-xs">
                {user.role || 'Administrador'}
              </Badge>
            </div>
          )}
        </motion.div>

        {/* Tabs para vista general vs detalles */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Vista General
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Detalles por Asignatura
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Botones de acciones (Importar archivo y Búsqueda) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Botón Importar Archivo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleImportFile}
              className="relative overflow-hidden group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Efecto de brillo */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              {/* Contenido del botón */}
              <div className="relative flex items-center gap-2">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 2 
                  }}
                >
                  <FileSpreadsheet className="h-5 w-5" />
                </motion.div>
                <span className="font-semibold">Importar archivo</span>
                <Upload className="h-4 w-4 ml-1" />
              </div>
              
              {/* Tooltip emergente */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap pointer-events-none"
              >
                <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                Importar Excel/CSV con datos
              </motion.div>
            </Button>
          </motion.div>

          {/* Componente de búsqueda */}
          <div className="w-full sm:w-auto">
            <SubjectSearchCarousel
              subjects={subjects}
              currentIndex={currentIndex}
              onIndexChange={setCurrentIndex}
              onSubjectClick={handleSubjectClick}
              placeholder="Buscar asignatura por nombre, descripción, categoría o profesor..."
            />
          </div>
        </div>
      </div>

      {/* Split Layout Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sección izquierda - Carrusel de asignaturas (2/3 del ancho) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl border shadow-sm p-4">
            <h2 className="text-xl font-bold mb-4">Asignaturas Disponibles</h2>
            
            {/* Carrusel */}
            <div className="relative">
              {subjectCards.length > 0 ? (
                <>
                  <div className="overflow-hidden rounded-xl">
                    <motion.div
                      className="flex"
                      animate={{ x: `-${currentIndex * 100}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {subjectCards.map((card, index) => (
                        <div key={card.subject.id} className="w-full flex-shrink-0 px-2">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="cursor-pointer relative"
                            onClick={() => handleSubjectClick(card.subject)}
                          >
                            <Card className="overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                              <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row items-start gap-6">
                                  <div className="flex-1 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                      <h3 className="text-xl font-bold text-foreground">
                                        {card.subject.nombre}
                                      </h3>
                                      <div className="flex flex-wrap gap-2">
                                        <Badge className={getCategoryColor(card.subject.categoría)}>
                                          {card.subject.categoría.toLowerCase()}
                                        </Badge>
                                        <Badge className={getSectionColor(card.subject.sección || 'matutino')}>
                                          {card.subject.sección}
                                        </Badge>
                                        <Badge className={getStateColor(card.subject.estado)}>
                                          {card.subject.estado}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    <p className="text-muted-foreground line-clamp-2">
                                      {card.subject.descripción || "Sin descripción disponible"}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4 text-primary" />
                                        <span className="font-medium">Solicitudes:</span>
                                        <span>{card.requestCount}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <GraduationCap className="h-4 w-4 text-green-500" />
                                        <span className="font-medium">Matrícula:</span>
                                        <span>{card.subject.matrícula}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex lg:flex-col items-center justify-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                    <div className="text-center">
                                      <p className="font-semibold text-primary">Ver detalles</p>
                                      <p className="text-xs text-muted-foreground mt-1">Haz clic</p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Controles del carrusel */}
                  {subjectCards.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background"
                        onClick={() => setCurrentIndex(prev => prev === 0 ? subjectCards.length - 1 : prev - 1)}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm shadow-lg hover:bg-background"
                        onClick={() => setCurrentIndex(prev => prev === subjectCards.length - 1 ? 0 : prev + 1)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay asignaturas para mostrar</p>
                </div>
              )}
            </div>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-4">
              {subjectCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-primary w-3 h-3" 
                      : "bg-muted w-2 h-2 hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Scrollable section for requests panel */}
          <div className="max-h-[600px] overflow-y-auto pr-2">
            <AnimatePresence>
              <SubjectRequestsPanel
                subject={selectedSubject}
                isOpen={showRequestsPanel}
                onClose={() => {
                  setShowRequestsPanel(false)
                  setSelectedSubject(null)
                }}
                getAuthToken={getAuthToken}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Sección derecha - Gráfico de completitud (1/3 del ancho) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Gráfico de completitud de matrícula */}
            <EnrollmentCompletionChart
              subject={selectedSubject}
              enrollmentCount={enrollmentStats.total}
              capacity={50} // Aquí puedes usar la capacidad real de la asignatura
              subjectCost={selectedSubject?.matrícula || 0}
              loading={enrollmentsLoading}
              onRefresh={refreshEnrollments}
            />

            {/* Panel de estadísticas */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Estadísticas Rápidas</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Asignaturas</span>
                    <span className="font-bold">{subjects.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Solicitudes Totales</span>
                    <span className="font-bold">{subjectCards.reduce((acc, card) => acc + card.requestCount, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Inscripciones Activas</span>
                    <span className="font-bold text-green-600">{enrollmentStats.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estudiantes Únicos</span>
                    <span className="font-bold">{enrollmentStats.uniqueStudents}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información adicional */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">📋 Información</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <p className="text-blue-800">
                      Haz clic en cualquier asignatura para ver solicitudes y estadísticas
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                    <p className="text-green-800">
                      El gráfico muestra el progreso de matrícula en tiempo real
                    </p>
                  </div>
                  {user && (
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
                      <p className="text-purple-800">
                        <strong>Usuario:</strong> {user.email}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer informativo */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-8 border-t"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm text-muted-foreground">
            👆 Navega entre asignaturas y monitorea el progreso de matrícula en tiempo real
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Dashboard actualizado automáticamente • {subjectCards.length} asignaturas disponibles
        </p>
      </motion.div>
    </div>
  )
}