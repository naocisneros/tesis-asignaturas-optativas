"use client"

import { ChartPieSubject } from "@/components/chart-request"
import { SubjectFormCard } from "@/components/subject-card"
import { DistributionModal } from "@/components/distribution-subject-modal"
import { motion } from "framer-motion"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, Filter, Clock, BookOpen, Eye, RefreshCw, Loader2, User } from "lucide-react"
import { useSubjects } from "@/hooks/use-fetch-subjects"
import { Subject } from "@/mapped_types/subject.type"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth" // Tu hook de autenticación

export default function Request() {
  const [selectedCount, setSelectedCount] = useState(0)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectionOrder, setSelectionOrder] = useState<{ id: string; timestamp: number }[]>([])
  const [showDistributionModal, setShowDistributionModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { subjects, loading: subjectsLoading, error: subjectsError } = useSubjects()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth() // Usar tu hook

  // Mapear estado real a tags para las cards
  const mapSubjectToTags = (subject: Subject) => {
    const tags = [subject.categoría]
    
    if (subject.sección?.toLowerCase().includes('matutina')) {
      tags.push('Matutina')
    } else if (subject.sección?.toLowerCase().includes('vespertina')) {
      tags.push('Vespertina')
    }
    
    if (subject.estado === 'disponible') {
      tags.push('Disponible')
    } else if (subject.estado === 'cerrada') {
      tags.push('Cerrada')
    }
    
    return tags
  }
  
  // Formatear fecha para mostrar
  const formatDate = (date: Date | string) => {
    if (!date) return 'No definida'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
  
  // Formatear horario basado en sección
  const getScheduleFromSection = (section?: string) => {
    if (!section) return 'Horario por definir'
    
    const lowerSection = section.toLowerCase()
    
    if (lowerSection.includes('matutino')) {
      return '08:00 - 12:00'
    } else if (lowerSection.includes('vespertino')) {
      return '14:00 - 18:00'
    } else if (lowerSection.includes('nocturno')) {
      return '19:00 - 22:00'
    } else if (lowerSection.includes('sabatino')) {
      return '08:00 - 16:00 (Sábados)'
    }
    
    return 'Horario variable'
  }
  
  // Manejar selección de asignaturas
  const handleSelectChange = (subjectId: string, selected: boolean) => {
    setSelectedSubjects(prev => {
      if (selected) {
        // Verificar límite máximo
        if (prev.length >= 14) {
          showMaxSubjectsToast();
          return prev;
        }
        
        // Verificar si ya está seleccionada
        if (prev.includes(subjectId)) {
          return prev; // Ya está seleccionada, no hacer nada
        }
        
        // Agregar al orden de selección SOLO si no existe ya
        setSelectionOrder(prevOrder => {
          // Verificar si ya existe en el orden
          const alreadyExists = prevOrder.some(item => item.id === subjectId);
          if (alreadyExists) {
            return prevOrder;
          }
          return [...prevOrder, { id: subjectId, timestamp: Date.now() }];
        });
        return [...prev, subjectId];
      } else {
        // Remover del orden de selección
        setSelectionOrder(prevOrder => prevOrder.filter(item => item.id !== subjectId));
        return prev.filter(id => id !== subjectId);
      }
    });
  };

  // Actualizar contador cuando cambian las selecciones
  useEffect(() => {
    setSelectedCount(selectedSubjects.length)
  }, [selectedSubjects])
  
  // Filtrar solo asignaturas disponibles
  const availableSubjects = subjects.filter(subject => 
    subject.estado === 'disponible'
  )

  // Funciones para determinar horario
  const isMorningSubject = (subject: Subject) => {
    const section = subject.sección?.toLowerCase() || ''
    return section.includes('matutina') || section.includes('mañana') || 
          section.includes('am') || section.includes('morning') ||
          section.includes('matutino')
  }

  const isEveningSubject = (subject: Subject) => {
    const section = subject.sección?.toLowerCase() || ''
    return section.includes('vespertina') || section.includes('tarde') || 
          section.includes('pm') || section.includes('evening') || 
          section.includes('nocturno') || section.includes('night') ||
          section.includes('vespertino')
  }

  // Contar asignaturas por tipo
  const morningCount = React.useMemo(() => {
    return subjects
      .filter(subject => 
        selectedSubjects.includes(subject.id) && 
        isMorningSubject(subject)
      ).length
  }, [selectedSubjects, subjects])

  const eveningCount = React.useMemo(() => {
    return subjects
      .filter(subject => 
        selectedSubjects.includes(subject.id) && 
        isEveningSubject(subject)
      ).length
  }, [selectedSubjects, subjects])

  // Verificar si cumple el requisito de 7+7 = 14
  const hasFullSchedule = React.useMemo(() => {
    return morningCount === 7 && eveningCount === 7 && selectedSubjects.length === 14
  }, [morningCount, eveningCount, selectedSubjects.length])

  // Función para mostrar toast de límite máximo
  const showMaxSubjectsToast = () => {
    toast.error("Límite alcanzado", {
      description: "Has seleccionado el máximo de 14 asignaturas permitidas (7 matutinas + 7 vespertinas).",
      duration: 5000,
      action: {
        label: "Ver selección",
        onClick: () => setShowDistributionModal(true)
      }
    })
  }

  // Función para obtener el token JWT (asumiendo que tu authService lo guarda)
  const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || 
             localStorage.getItem('auth_token') || 
             sessionStorage.getItem('token') ||
             null;
    }
    return null;
  }

  // Función para enviar solicitudes al backend
  const sendBulkRequests = async () => {
    if (!user || !user.id) {
      toast.error("Usuario no disponible", {
        description: "No se pudo obtener la información del usuario.",
        duration: 5000
      })
      return false;
    }

    // Crear el array de requests según el formato requerido
    const requests = selectionOrder.map((item, index) => {
      // option es el orden de selección + 1 (empezando desde 1)
      const option = index + 1;
      
      return {
        subjectId: item.id,
        option: option,
        userId: user.id
      };
    });
    console.log(requests)
    const payload = { requests };
    const authToken = getAuthToken();

    try {
      const response = await fetch('http://localhost:8000/api/requests/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending bulk requests:', error);
      throw error;
    }
  };

  // Función para manejar el envío de solicitud
  const handleSubmitRequest = async () => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated || !user) {
      toast.error("No autenticado", {
        description: "Debes iniciar sesión para enviar solicitudes. Redirigiendo al login...",
        duration: 5000,
        action: {
          label: "Iniciar sesión",
          onClick: () => window.location.href = '/login'
        }
      });
      return;
    }

    // Verificar límite máximo (más de 14)
    if (selectedSubjects.length > 14) {
      toast.error("Demasiadas asignaturas", {
        description: `Has seleccionado ${selectedSubjects.length} asignaturas. El máximo permitido es 14 (7 matutinas + 7 vespertinas).`,
        duration: 6000,
        action: {
          label: "Ajustar selección",
          onClick: () => setShowDistributionModal(true)
        }
      });
      return;
    }

    // Verificar si está completo (exactamente 7+7=14)
    if (hasFullSchedule) {
      // Enviar al backend
      setIsSubmitting(true);
      
      try {
        const toastId = toast.loading("Enviando solicitud...");
        
        const result = await sendBulkRequests();
        
        toast.success("¡Solicitud enviada correctamente!", {
          id: toastId,
          description: "Tu solicitud de matrícula ha sido procesada exitosamente. Recibirás confirmación por correo.",
          duration: 8000,
          action: {
            label: "Ver detalles",
            onClick: () => setShowDistributionModal(true)
          }
        });
        
        // Limpiar selecciones después de éxito
        setSelectedSubjects([]);
        setSelectionOrder([]);
        
      } catch (error) {
        toast.error("Error al enviar solicitud", {
          description: error instanceof Error ? error.message : "Ha ocurrido un error. Inténtalo nuevamente.",
          duration: 7000
        });
      } finally {
        setIsSubmitting(false);
      }
      
    } else {
      // Análisis detallado de lo que falta
      const totalMissing = 14 - selectedSubjects.length;
      const morningMissing = 7 - morningCount;
      const eveningMissing = 7 - eveningCount;
      
      let errorTitle = "Solicitud incompleta";
      let errorDescription = "";
      let showDetails = true;
      
      if (selectedSubjects.length === 0) {
        errorTitle = "Sin asignaturas seleccionadas";
        errorDescription = "Debes seleccionar 7 asignaturas matutinas y 7 vespertinas para enviar tu solicitud.";
      } else if (selectedSubjects.length < 14) {
        errorDescription = `Faltan ${totalMissing} asignaturas por seleccionar.`;
        
        if (morningMissing > 0) {
          errorDescription += ` Necesitas ${morningMissing} matutina${morningMissing > 1 ? 's' : ''} más.`;
        }
        if (eveningMissing > 0) {
          errorDescription += ` Necesitas ${eveningMissing} vespertina${eveningMissing > 1 ? 's' : ''} más.`;
        }
      } else if (selectedSubjects.length === 14 && (morningCount !== 7 || eveningCount !== 7)) {
        errorTitle = "Distribución incorrecta";
        errorDescription = `Tienes ${morningCount} matutinas y ${eveningCount} vespertinas. Debes tener exactamente 7 de cada tipo.`;
      } else if ((morningCount > 7 && eveningCount < 7) || (eveningCount > 7 && morningCount < 7)) {
        errorTitle = "Desequilibrio en horarios";
        errorDescription = `Tienes ${morningCount} matutinas (máximo 7) y ${eveningCount} vespertinas (máximo 7). Ajusta la distribución.`;
      }

      toast.error(errorTitle, {
        description: errorDescription,
        duration: 7000,
        action: showDetails ? {
          label: "Ver detalles",
          onClick: () => setShowDistributionModal(true)
        } : undefined
      });
    }
  };

  // Estados de carga combinados
  const isLoading = subjectsLoading || authLoading;
  const hasError = subjectsError;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600 mb-4"></div>
        <p className="text-lg text-cyan-800">Cargando...</p>
        <p className="text-sm text-muted-foreground mt-2">Por favor, espera un momento</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Error al cargar asignaturas</h2>
          <p className="text-red-600 mb-4">{subjectsError}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 max-w-md text-center">
          <div className="text-amber-600 text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-amber-800 mb-3">Acceso restringido</h2>
          <p className="text-amber-700 mb-6">
            Debes iniciar sesión para acceder a la solicitud de matrícula.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => window.location.href = '/login'}
              className="bg-amber-600 hover:bg-amber-700 w-full"
            >
              <User className="h-4 w-4 mr-2" />
              Iniciar sesión
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/register'}
              className="w-full"
            >
              Crear cuenta
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-2rem)]">
        {/* Columna izquierda - Cards con scroll */}
        <div className="lg:w-2/3">
          {/* Encabezado con controles */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-cyan-900 hover:text-green-400 transition-colors duration-200"
              >
                Solicitud de matrícula
              </motion.h1>
              {user && (
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">Usuario:</span> {user.name || user.email}
                  {user.id && <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">ID: {user.id.substring(0, 8)}...</span>}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar ({availableSubjects.length})
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDistributionModal(true)}
                className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                Visualizar solicitud
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 transition-all duration-300"
                onClick={handleSubmitRequest}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Enviar solicitud ({selectedCount})
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total asignaturas</p>
                  <p className="text-2xl font-bold">{subjects.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Disponibles</p>
                  <p className="text-2xl font-bold text-green-600">{availableSubjects.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha límite</p>
                  <p className="text-lg font-bold">
                    {availableSubjects.length > 0 
                      ? formatDate(new Date())
                      : 'No definida'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cards en grid con scroll */}
          <div className="overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 350px)' }}>
            {availableSubjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay asignaturas disponibles</h3>
                <p className="text-muted-foreground">
                  Todas las asignaturas están cerradas o no hay oferta para este período.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 pb-6">
                {availableSubjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="h-full"
                  >
                    <SubjectFormCard 
                      nombre={subject.nombre}
                      descripción={subject.descripción || `Asignatura de ${subject.categoría}`}
                      matrícula={subject.matrícula}
                      profesor={subject.profesor || 'Por asignar'}
                      inicio_de_matrícula={subject.sección || getScheduleFromSection(subject.sección)}
                      sede={subject.sede || 'Sede Central'}
                      seats=""
                      tags={mapSubjectToTags(subject)}
                      onSelectChange={(selected) => {
                        handleSelectChange(subject.id, selected)
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha - Gráfico fijo */}
        <div className="lg:w-1/3">
          <div className="sticky top-6 space-y-6">
            {/* Gráfico con datos reales */}
            <ChartPieSubject selectedSubjects={selectedSubjects} allSubjects={subjects}/>
            
            {/* Panel de selección actual */}
            <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-cyan-50 text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-lg font-semibold leading-none tracking-tight">
                  Tu selección actual por horario
                </h3>
              </div>
              <div className="p-6 pt-0 space-y-4">
                {/* Asignaturas matutinas */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm text-muted-foreground">Asignaturas matutinas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${morningCount >= 7 ? 'text-green-600' : 'text-cyan-700'}`}>
                      {morningCount}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 7 requeridas</span>
                  </div>
                </div>
                
                {/* Asignaturas vespertinas */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-sm text-muted-foreground">Asignaturas vespertinas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${eveningCount >= 7 ? 'text-green-600' : 'text-cyan-700'}`}>
                      {eveningCount}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 7 requeridas</span>
                  </div>
                </div>
                
                {/* Barra de progreso total */}
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Progreso total</span>
                    <span className="text-sm font-bold">
                      {selectedCount}/14 asignaturas
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(selectedCount / 14) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{selectedCount} seleccionadas</span>
                    <span>{14 - selectedCount} restantes</span>
                  </div>
                </div>
                
                {selectedCount > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Requisitos cumplidos:</p>
                    <div className="space-y-2">
                      {/* Requisito 1: Mínimo 7 asignaturas matutinas */}
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${morningCount >= 7 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <span className="text-sm">7 asignaturas matutinas</span>
                        </div>
                        {morningCount >= 7 ? (
                          <Check className="h-4 w-4 text-green-500 ml-auto" />
                        ) : (
                          <span className="text-xs text-muted-foreground ml-auto">{7 - morningCount} faltan</span>
                        )}
                      </div>
                      
                      {/* Requisito 2: Mínimo 7 asignaturas vespertinas */}
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${eveningCount >= 7 ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          <span className="text-sm">7 asignaturas vespertinas</span>
                        </div>
                        {eveningCount >= 7 ? (
                          <Check className="h-4 w-4 text-green-500 ml-auto" />
                        ) : (
                          <span className="text-xs text-muted-foreground ml-auto">{7 - eveningCount} faltan</span>
                        )}
                      </div>
                      
                      {/* Requisito 3: Completar horario completo (14 asignaturas) */}
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${hasFullSchedule ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm">Completar horario completo (14 asignaturas)</span>
                        {hasFullSchedule ? (
                          <Check className="h-4 w-4 text-green-500 ml-auto" />
                        ) : (
                          <span className="text-xs text-muted-foreground ml-auto">
                            {14 - selectedCount} asignaturas totales faltan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                    disabled={!hasFullSchedule}
                    onClick={handleSubmitRequest}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {hasFullSchedule ? '¡Horario completo! Enviar solicitud' : 'Visualizar solicitud'}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    {hasFullSchedule 
                      ? '✅ ¡Has completado todos los requisitos de horario!'
                      : `Necesitas ${7 - morningCount} matutinas y ${7 - eveningCount} vespertinas más`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-lg font-semibold leading-none tracking-tight">
                  📋 Información importante
                </h3>
              </div>
              <div className="p-6 pt-0 space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                  <p className="text-green-800">Selecciona <strong>exactamente 7 asignaturas matutinas y 7 vespertinas</strong></p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <p className="text-blue-800">Total requerido: <strong>14 asignaturas</strong> (7+7)</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                  <p className="text-amber-800">El orden de selección determina la <strong>prioridad (option)</strong> en la solicitud</p>
                </div>
                {user && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <p className="text-blue-800">
                      <strong>Usuario autenticado:</strong> {user.email}
                    </p>
                  </div>
                )}
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                     onClick={() => setShowDistributionModal(true)}>
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
                  <p className="text-purple-800">
                    <strong>Haz clic aquí</strong> para ver la distribución completa de tu solicitud
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de distribución */}
      <DistributionModal
        isOpen={showDistributionModal}
        onClose={() => setShowDistributionModal(false)}
        selectedSubjects={selectedSubjects}
        allSubjects={subjects}
        selectionOrder={selectionOrder}
      />
    </>
  )
}