// components/kanban-card.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, BookOpen, Video, MapPin } from "lucide-react"
import { ContentDistribution, ActivityType } from "@/mapped_types/content-distribution.type"

interface KanbanCardProps {
  item: ContentDistribution
  onClick?: (item: ContentDistribution) => void
}

const activityTypeColors: Record<ActivityType, string> = {
  [ActivityType.CONFERENCE]: "bg-blue-100 text-blue-800",
  [ActivityType.PRACTICAL_CLASS]: "bg-green-100 text-green-800",
  [ActivityType.LABORATORY]: "bg-purple-100 text-purple-800",
  [ActivityType.WORKSHOP]: "bg-orange-100 text-orange-800",
  [ActivityType.SEMINAR]: "bg-yellow-100 text-yellow-800",
  [ActivityType.TUTORIAL]: "bg-indigo-100 text-indigo-800",
  [ActivityType.FIELD_TRIP]: "bg-emerald-100 text-emerald-800",
  [ActivityType.ASSESSMENT]: "bg-red-100 text-red-800",
  [ActivityType.PROJECT]: "bg-pink-100 text-pink-800"
}

const activityTypeLabels: Record<ActivityType, string> = {
  [ActivityType.CONFERENCE]: "Conferencia",
  [ActivityType.PRACTICAL_CLASS]: "Clase Práctica",
  [ActivityType.LABORATORY]: "Laboratorio",
  [ActivityType.WORKSHOP]: "Taller",
  [ActivityType.SEMINAR]: "Seminario",
  [ActivityType.TUTORIAL]: "Tutoría",
  [ActivityType.FIELD_TRIP]: "Salida de Campo",
  [ActivityType.ASSESSMENT]: "Evaluación",
  [ActivityType.PROJECT]: "Proyecto"
}

export function KanbanCard({ item, onClick }: KanbanCardProps) {
  const formatDate = (date?: Date | string) => {
    if (!date) return "Fecha no definida"
    const d = new Date(date)
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 border-l-cyan-500"
      onClick={() => onClick?.(item)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base font-semibold line-clamp-2">
            {item.topicTitle}
          </CardTitle>
          <Badge className={activityTypeColors[item.activityType]}>
            {activityTypeLabels[item.activityType]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-600 line-clamp-2">
          {item.contentDescription}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <BookOpen className="h-3 w-3" />
          <span>{item.subjectName}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(item.startDate)}</span>
          {item.endDate && (
            <>
              <span>-</span>
              <span>{formatDate(item.endDate)}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{item.durationHours} horas</span>
        </div>
        
        {item.onlineMeetingLink && (
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <Video className="h-3 w-3" />
            <span className="truncate">Enlace virtual</span>
          </div>
        )}
        
        {item.priority && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              Prioridad: {item.priority}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}