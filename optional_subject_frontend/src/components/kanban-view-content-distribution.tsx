"use client"

import { ContentDistribution, ActivityType } from "@/mapped_types/content-distribution.type"
import { KanbanCard } from "./kanban-card-content-distribution"
import { ScrollArea } from "./ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface KanbanViewProps {
  items: ContentDistribution[]
  onItemClick?: (item: ContentDistribution) => void
  groupBy?: "subject" | "activityType" | "week"
}

const activityTypeLabels: Record<ActivityType, string> = {
  [ActivityType.CONFERENCE]: "Conferencias",
  [ActivityType.PRACTICAL_CLASS]: "Clases Prácticas",
  [ActivityType.LABORATORY]: "Laboratorios",
  [ActivityType.WORKSHOP]: "Talleres",
  [ActivityType.SEMINAR]: "Seminarios",
  [ActivityType.TUTORIAL]: "Tutorías",
  [ActivityType.FIELD_TRIP]: "Salidas de Campo",
  [ActivityType.ASSESSMENT]: "Evaluaciones",
  [ActivityType.PROJECT]: "Proyectos"
}

export function KanbanView({ items, onItemClick, groupBy = "activityType" }: KanbanViewProps) {
  
  const getGroupedItems = () => {
    if (groupBy === "subject") {
      const grouped = items.reduce((acc, item) => {
        if (!acc[item.subjectName]) {
          acc[item.subjectName] = []
        }
        acc[item.subjectName].push(item)
        return acc
      }, {} as Record<string, ContentDistribution[]>)
      return Object.entries(grouped)
    }
    
    if (groupBy === "week") {
      const grouped = items.reduce((acc, item) => {
        const week = `Semana ${item.weekNumber}`
        if (!acc[week]) {
          acc[week] = []
        }
        acc[week].push(item)
        return acc
      }, {} as Record<string, ContentDistribution[]>)
      return Object.entries(grouped).sort((a, b) => {
        const weekA = parseInt(a[0].split(" ")[1])
        const weekB = parseInt(b[0].split(" ")[1])
        return weekA - weekB
      })
    }
    
    // Group by activity type
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.activityType]) {
        acc[item.activityType] = []
      }
      acc[item.activityType].push(item)
      return acc
    }, {} as Record<ActivityType, ContentDistribution[]>)
    
    return Object.entries(grouped)
  }

  const groupedItems = getGroupedItems()

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 min-w-max p-4">
        {groupedItems.map(([groupKey, groupItems]) => (
          <div key={groupKey} className="w-80 flex-shrink-0">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-3 px-2">
                <h3 className="font-semibold text-cyan-900">
                  {groupBy === "activityType" 
                    ? activityTypeLabels[groupKey as ActivityType] || groupKey
                    : groupKey}
                </h3>
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
                  {groupItems.length}
                </Badge>
              </div>
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-3 pr-2">
                  {groupItems.map((item) => (
                    <KanbanCard
                      key={item.id}
                      item={item}
                      onClick={onItemClick}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { Badge } from "@/components/ui/badge"