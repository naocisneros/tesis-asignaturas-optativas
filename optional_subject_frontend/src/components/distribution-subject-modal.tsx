"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Clock, Calendar, BookOpen, Sun, Moon } from "lucide-react"
import { Subject } from "@/mapped_types/subject.type"

interface DistributionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedSubjects: string[]
  allSubjects: Subject[]
  selectionOrder: { id: string; timestamp: number }[]
}

// Función para determinar horario
const getScheduleType = (subject: Subject) => {
  const section = subject.sección?.toLowerCase() || ''
  if (section.includes('matutino') || section.includes('mañana') || section.includes('am') || section.includes('matutina')) {
    return 'matutino'
  } else if (section.includes('vespertino') || section.includes('tarde') || section.includes('pm') || section.includes('vespertina')) {
    return 'vespertino'
  }
  return 'otro'
}

export function DistributionModal({
  isOpen,
  onClose,
  selectedSubjects,
  allSubjects,
  selectionOrder
}: DistributionModalProps) {
  // Obtener asignaturas seleccionadas con información completa
  const selectedSubjectsData = React.useMemo(() => {
    return allSubjects
      .filter(subject => selectedSubjects.includes(subject.id))
      .map(subject => {
        const order = selectionOrder.find(item => item.id === subject.id)
        return {
          ...subject,
          order: order ? selectionOrder.indexOf(order) + 1 : 0,
          timestamp: order?.timestamp || 0,
          scheduleType: getScheduleType(subject)
        }
      })
      .sort((a, b) => a.order - b.order) // Ordenar por orden de selección
  }, [selectedSubjects, allSubjects, selectionOrder])

  // Separar por horario
  const morningSubjects = selectedSubjectsData.filter(sub => sub.scheduleType === 'matutino')
  const eveningSubjects = selectedSubjectsData.filter(sub => sub.scheduleType === 'vespertino')

  // Formatear hora
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Formatear fecha
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-0 bg-white">
        {/* Encabezado azul oscuro con hover effect */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6"
        >
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  Distribución de Solicitud
                </DialogTitle>
                <DialogDescription className="text-blue-200">
                  Revisa el orden y horario de tus asignaturas seleccionadas
                </DialogDescription>
              </div>
            </div>
            
            {/* Stats rápidos */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">Total seleccionadas</span>
                </div>
                <p className="text-xl font-bold mt-1">{selectedSubjectsData.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <span className="text-sm">Matutinas</span>
                </div>
                <p className="text-xl font-bold mt-1">{morningSubjects.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <span className="text-sm">Vespertinas</span>
                </div>
                <p className="text-xl font-bold mt-1">{eveningSubjects.length}</p>
              </div>
            </div>
          </DialogHeader>
        </motion.div>

        {/* Contenido principal con tabs - SOLUCIÓN SIMPLIFICADA PARA SCROLL */}
        <div className="flex flex-col" style={{ maxHeight: '60vh' }}>
          <Tabs defaultValue="all" className="flex flex-col flex-1">
            <div className="px-6 pt-4">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Todas ({selectedSubjectsData.length})
                </TabsTrigger>
                <TabsTrigger value="morning" className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Matutinas ({morningSubjects.length})
                </TabsTrigger>
                <TabsTrigger value="evening" className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Vespertinas ({eveningSubjects.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ÁREA DE SCROLL SIMPLIFICADA - SOLUCIÓN DEFINITIVA */}
            <div className="flex-1 min-h-0 px-6">
              {/* Tab Todas */}
              <TabsContent 
                value="all" 
                className="mt-4 h-full data-[state=active]:block data-[state=inactive]:hidden"
                style={{ height: 'calc(60vh - 140px)' }}
              >
                <div 
                  className="h-full overflow-y-auto pr-3 space-y-3 pb-4"
                  style={{ 
                    maxHeight: 'calc(60vh - 140px)',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#3b82f6 #f1f5f9'
                  }}
                >
                  {selectedSubjectsData.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No hay asignaturas seleccionadas</p>
                    </div>
                  ) : (
                    selectedSubjectsData.map((subject, index) => (
                      <motion.div
                        key={subject.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-blue-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold flex-shrink-0">
                                {subject.order}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-blue-900 truncate">{subject.nombre}</h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded truncate max-w-[120px]">
                                    {subject.categoría}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded truncate ${
                                    subject.scheduleType === 'matutino' 
                                      ? 'bg-yellow-50 text-yellow-700'
                                      : 'bg-purple-50 text-purple-700'
                                  }`}>
                                    {subject.scheduleType === 'matutino' ? 'Matutino' : 'Vespertino'}
                                  </span>
                                  <span className="text-xs text-gray-500 truncate max-w-[100px]">
                                    {subject.profesor || 'Profesor por asignar'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-600 mt-2 pl-11">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 flex-shrink-0" />
                                <span>Seleccionado a las {formatTime(subject.timestamp)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span>{formatDate(subject.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <div className="text-sm font-medium text-blue-600">
                              Orden #{subject.order}
                            </div>
                            <div className="text-xs text-blue-400 mt-1">
                              {subject.matrícula} créditos
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Tab Matutinas */}
              <TabsContent 
                value="morning" 
                className="mt-4 h-full data-[state=active]:block data-[state=inactive]:hidden"
                style={{ height: 'calc(60vh - 140px)' }}
              >
                <div 
                  className="h-full overflow-y-auto pr-3 space-y-3 pb-4"
                  style={{ 
                    maxHeight: 'calc(60vh - 140px)',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#f59e0b #fef3c7'
                  }}
                >
                  {morningSubjects.length === 0 ? (
                    <div className="text-center py-8">
                      <Sun className="h-12 w-12 text-yellow-300 mx-auto mb-3" />
                      <p className="text-gray-500">No hay asignaturas matutinas seleccionadas</p>
                    </div>
                  ) : (
                    morningSubjects.map((subject, index) => (
                      <motion.div
                        key={subject.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-yellow-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-yellow-50/30 to-amber-50/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold flex-shrink-0">
                                {subject.order}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-amber-900 truncate">{subject.nombre}</h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded truncate max-w-[120px]">
                                    {subject.categoría}
                                  </span>
                                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                    Matutino
                                  </span>
                                  <span className="text-xs text-gray-500 truncate max-w-[100px]">
                                    {subject.profesor || 'Profesor por asignar'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-amber-600 mt-2 pl-11">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 flex-shrink-0" />
                                <span>Seleccionado a las {formatTime(subject.timestamp)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span>{formatDate(subject.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <div className="text-sm font-medium text-amber-600">
                              Matutina #{morningSubjects.findIndex(s => s.id === subject.id) + 1}
                            </div>
                            <div className="text-xs text-amber-500 mt-1">
                              {subject.matrícula} créditos
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Tab Vespertinas */}
              <TabsContent 
                value="evening" 
                className="mt-4 h-full data-[state=active]:block data-[state=inactive]:hidden"
                style={{ height: 'calc(60vh - 140px)' }}
              >
                <div 
                  className="h-full overflow-y-auto pr-3 space-y-3 pb-4"
                  style={{ 
                    maxHeight: 'calc(60vh - 140px)',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#8b5cf6 #f5f3ff'
                  }}
                >
                  {eveningSubjects.length === 0 ? (
                    <div className="text-center py-8">
                      <Moon className="h-12 w-12 text-purple-300 mx-auto mb-3" />
                      <p className="text-gray-500">No hay asignaturas vespertinas seleccionadas</p>
                    </div>
                  ) : (
                    eveningSubjects.map((subject, index) => (
                      <motion.div
                        key={subject.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-purple-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-purple-50/30 to-violet-50/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold flex-shrink-0">
                                {subject.order}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-purple-900 truncate">{subject.nombre}</h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded truncate max-w-[120px]">
                                    {subject.categoría}
                                  </span>
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                    Vespertino
                                  </span>
                                  <span className="text-xs text-gray-500 truncate max-w-[100px]">
                                    {subject.profesor || 'Profesor por asignar'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-purple-600 mt-2 pl-11">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 flex-shrink-0" />
                                <span>Seleccionado a las {formatTime(subject.timestamp)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span>{formatDate(subject.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <div className="text-sm font-medium text-purple-600">
                              Vespertina #{eveningSubjects.findIndex(s => s.id === subject.id) + 1}
                            </div>
                            <div className="text-xs text-purple-500 mt-1">
                              {subject.matrícula} créditos
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </TabsContent>
            </div>

            
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}