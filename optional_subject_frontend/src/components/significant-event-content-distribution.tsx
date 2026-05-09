"use client"

import { ContentDistribution, ActivityType } from "@/mapped_types/content-distribution.type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, Star, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImportantEventsSidebarProps {
  items: ContentDistribution[]
  onEventClick?: (item: ContentDistribution) => void
  className?: string
}

const importantTypes: ActivityType[] = [
  ActivityType.SEMINAR,
  ActivityType.ASSESSMENT,
  ActivityType.PROJECT
]

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200"
}

export function ImportantEventsSidebar({ items, onEventClick, className }: ImportantEventsSidebarProps) {
  const importantEvents = items
    .filter(item => importantTypes.includes(item.activityType) && item.isActive)
    .sort((a, b) => {
      // Ordenar por prioridad (mayor primero) y luego por fecha
      const priorityA = a.priority || 0
      const priorityB = b.priority || 0
      if (priorityA !== priorityB) return priorityB - priorityA
      
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0
      return dateA - dateB
    })

  const getPriorityLabel = (priority?: number) => {
    if (!priority) return { label: "Media", color: "medium" }
    if (priority >= 8) return { label: "Alta", color: "high" }
    if (priority >= 5) return { label: "Media", color: "medium" }
    return { label: "Baja", color: "low" }
  }

  const getEventIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.SEMINAR:
        return <Star className="h-4 w-4 text-yellow-600" />
      case ActivityType.ASSESSMENT:
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case ActivityType.PROJECT:
        return <Calendar className="h-4 w-4 text-purple-600" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const formatDate = (date?: Date | string) => {
    if (!date) return "Fecha por definir"
    const d = new Date(date)
    return d.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="border-b bg-gradient-to-r from-cyan-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-cyan-900">
          <Star className="h-5 w-5 text-yellow-500" />
          Encuentros Importantes
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Seminarios, Evaluaciones y Proyectos
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="space-y-3 p-4">
            {importantEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No hay encuentros importantes próximos</p>
              </div>
            ) : (
              importantEvents.map((event) => {
                const priority = getPriorityLabel(event.priority)
                return (
                  <div
                    key={event.id}
                    className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all hover:border-cyan-300"
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.activityType)}
                        <span className="font-semibold text-sm">
                          {event.topicTitle}
                        </span>
                      </div>
                      <Badge className={priorityColors[priority.color as keyof typeof priorityColors]}>
                        Prioridad {priority.label}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {event.contentDescription}
                    </p>
                    
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(event.startDate)}</span>
                        {event.endDate && (
                          <>
                            <span>-</span>
                            <span>{formatDate(event.endDate)}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{event.durationHours} horas</span>
                      </div>
                      
                      <div className="text-cyan-700 font-medium">
                        {event.subjectName} - Semana {event.weekNumber}
                      </div>
                    </div>
                    
                    {event.evaluationMethod && (
                      <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-1 rounded">
                        📝 {event.evaluationMethod}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}