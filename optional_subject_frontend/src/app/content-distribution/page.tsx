"use client"

import { useState, useEffect } from "react"
import { ContentDistributionTabs } from "@/components/content-distribution-fullscreen"
import { ImportantEventsSidebar } from "@/components/significant-event-content-distribution"
import { useContentDistribution } from "@/hooks/use-fetch-content-distribution"
import { ContentDistribution, ActivityType } from "@/mapped_types/content-distribution.type"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Filter, X, Calendar, BookOpen, Star, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const activityTypeLabels: Record<string, string> = {
  conference: "Conferencias",
  practical_class: "Clases Prácticas",
  laboratory: "Laboratorios",
  workshop: "Talleres",
  seminar: "Seminarios",
  tutorial: "Tutorías",
  field_trip: "Salidas de Campo",
  assessment: "Evaluaciones",
  project: "Proyectos"
}

export default function ContentDistributionPage() {
  const { distributions, loading, error, refresh } = useContentDistribution()
  const [selectedItem, setSelectedItem] = useState<ContentDistribution | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filteredData, setFilteredData] = useState<ContentDistribution[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedWeek, setSelectedWeek] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")

  
  const subjects = Array.from(new Set(distributions.map(item => item.subjectName)))
  const weeks = Array.from(new Set(distributions.map(item => `Semana ${item.weekNumber}`)))
  const activityTypes = Array.from(new Set(distributions.map(item => item.activityType)))

  useEffect(() => {
    let filtered = [...distributions]
    
   
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.topicTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contentDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subjectName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    
    if (selectedSubject) {
      filtered = filtered.filter(item => item.subjectName === selectedSubject)
    }
    
    
    if (selectedWeek) {
      const weekNum = parseInt(selectedWeek.split(" ")[1])
      filtered = filtered.filter(item => item.weekNumber === weekNum)
    }
    
   
    if (selectedType) {
      filtered = filtered.filter(item => item.activityType === selectedType)
    }
    
    setFilteredData(filtered)
  }, [distributions, searchTerm, selectedSubject, selectedWeek, selectedType])

  const handleItemClick = (item: ContentDistribution) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedSubject("")
    setSelectedWeek("")
    setSelectedType("")
  }

  const hasActiveFilters = searchTerm || selectedSubject || selectedWeek || selectedType

  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-cyan-700 font-medium">Cargando distribuciones de contenido...</p>
        </div>
      </div>
    )
  }

  
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar los datos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={refresh}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-900 to-blue-900 bg-clip-text text-transparent flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-cyan-600" />
                Distribución de Contenidos
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Gestión de actividades académicas por asignatura
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-cyan-700 border-cyan-300">
                <Calendar className="h-3 w-3 mr-1" />
                {distributions[0]?.academicPeriod || "Período actual"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={refresh}
                className="text-cyan-600 hover:text-cyan-700"
              >
                <Loader2 className="h-4 w-4 mr-1" />
                Actualizar
              </Button>
            </div>
          </div>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Input
                placeholder="Buscar por tema, descripción o asignatura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-cyan-200 focus:ring-cyan-400 focus:border-cyan-400"
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            {subjects.length > 0 && (
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 border-cyan-200 hover:border-cyan-300 transition-colors"
              >
                <option value="">Todas las asignaturas</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            )}
            
            {weeks.length > 0 && (
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 border-cyan-200 hover:border-cyan-300 transition-colors"
              >
                <option value="">Todas las semanas</option>
                {weeks.map(week => (
                  <option key={week} value={week}>{week}</option>
                ))}
              </select>
            )}
            
            {activityTypes.length > 0 && (
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 border-cyan-200 hover:border-cyan-300 transition-colors"
              >
                <option value="">Todos los tipos</option>
                {activityTypes.map(type => (
                  <option key={type} value={type}>
                    {activityTypeLabels[type] || type}
                  </option>
                ))}
              </select>
            )}
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                size="sm"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar filtros
              </Button>
            )}
            
            <Badge variant="secondary" className="ml-auto bg-cyan-100 text-cyan-800">
              {filteredData.length} actividad{filteredData.length !== 1 ? 'es' : ''}
            </Badge>
          </div>
        </div>
      </div>

      {/* Layout principal con Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Panel izquierdo - Tabla/Kanban */}
          <div className="lg:col-span-8">
            <Card className="shadow-lg border-0 h-full">
              <CardContent className="p-0">
                <ContentDistributionTabs 
                  data={filteredData} 
                  onItemClick={handleItemClick}
                />
              </CardContent>
            </Card>
          </div>

          {/* Panel derecho - Sidebar de encuentros importantes */}
          <div className="lg:col-span-4">
            <ImportantEventsSidebar 
              items={filteredData}
              onEventClick={handleItemClick}
              className="shadow-lg border-0"
            />
          </div>
        </div>
      </div>

      {/* Dialog de detalles */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-cyan-900 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Detalles de la Actividad
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-semibold text-lg text-gray-900">{selectedItem.topicTitle}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-cyan-700">
                    {selectedItem.subjectName}
                  </Badge>
                  <Badge variant="outline" className="text-gray-600">
                    Semana {selectedItem.weekNumber}
                  </Badge>
                  <Badge className={
                    selectedItem.activityType === ActivityType.SEMINAR ? "bg-yellow-100 text-yellow-800" :
                    selectedItem.activityType === ActivityType.ASSESSMENT ? "bg-red-100 text-red-800" :
                    selectedItem.activityType === ActivityType.PROJECT ? "bg-purple-100 text-purple-800" :
                    "bg-gray-100 text-gray-800"
                  }>
                    {activityTypeLabels[selectedItem.activityType] || selectedItem.activityType}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Descripción</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedItem.contentDescription}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-1 text-sm">Duración</h4>
                  <p className="text-lg font-semibold text-cyan-700">{selectedItem.durationHours} horas</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-1 text-sm">Período</h4>
                  <p className="text-lg font-semibold text-cyan-700">{selectedItem.academicPeriod}</p>
                </div>
              </div>
              
              {selectedItem.startDate && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-1 text-sm">Fechas</h4>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedItem.startDate).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      weekday: 'long'
                    })} 
                    {selectedItem.endDate && selectedItem.endDate !== selectedItem.startDate && 
                      ` - ${new Date(selectedItem.endDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}`
                    }
                  </p>
                </div>
              )}
              
              {selectedItem.learningObjectives && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Objetivos de Aprendizaje</h4>
                  <p className="text-sm text-gray-700">{selectedItem.learningObjectives}</p>
                </div>
              )}
              
              {selectedItem.evaluationMethod && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-1 text-sm">Método de Evaluación</h4>
                  <p className="text-sm text-gray-700">{selectedItem.evaluationMethod}</p>
                </div>
              )}
              
              {selectedItem.requiredMaterials && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Materiales Requeridos</h4>
                  <p className="text-sm text-gray-700">{selectedItem.requiredMaterials}</p>
                </div>
              )}
              
              {selectedItem.prerequisites && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Prerrequisitos</h4>
                  <p className="text-sm text-gray-700">{selectedItem.prerequisites}</p>
                </div>
              )}
              
              {selectedItem.onlineMeetingLink && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Enlace Virtual</h4>
                  <a 
                    href={selectedItem.onlineMeetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-600 hover:underline break-all flex items-center gap-1"
                  >
                    {selectedItem.onlineMeetingLink}
                  </a>
                </div>
              )}
              
              {selectedItem.priority && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Prioridad</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-red-500 rounded-full h-2 transition-all"
                        style={{ width: `${(selectedItem.priority / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{selectedItem.priority}/10</span>
                  </div>
                </div>
              )}
              
              <div className="pt-2">
                <Badge variant={selectedItem.isActive ? "default" : "secondary"} 
                       className={selectedItem.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {selectedItem.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}