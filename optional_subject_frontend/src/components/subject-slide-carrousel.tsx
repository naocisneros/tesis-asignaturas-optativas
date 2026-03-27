// src/components/subject-list.tsx
"use client"

import { motion } from "framer-motion"
import React from "react"
import { Subject } from "@/mapped_types/subject.type"
import { SubjectFormCard } from "@/components/subject-card"
import { toast } from "sonner"

interface SubjectListProps {
  subjects: Subject[]
  selectedSubjects: string[]
  selectionOrder: Array<{ id: string; timestamp: number }>
  onSelectChange: (subjectId: string, selected: boolean) => void
  onSelectionOrderUpdate: (order: Array<{ id: string; timestamp: number }>) => void
  loading?: boolean
}

export const SubjectList: React.FC<SubjectListProps> = ({
  subjects,
  selectedSubjects,
  selectionOrder,
  onSelectChange,
  onSelectionOrderUpdate,
  loading = false
}) => {
  // Filtrar solo asignaturas disponibles
  const availableSubjects = subjects.filter(subject => 
    subject.estado === 'disponible'
  )

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

  // Función para mostrar toast de límite máximo
  const showMaxSubjectsToast = () => {
    toast.error("Límite alcanzado", {
      description: "Has seleccionado el máximo de 14 asignaturas permitidas (7 matutinas + 7 vespertinas).",
      duration: 5000,
      action: {
        label: "Ver selección",
        onClick: () => {} // Esta función será inyectada desde el padre
      }
    })
  }

  // Manejar selección de asignaturas (versión local para SubjectList)
  const handleSelectChange = (subjectId: string, selected: boolean) => {
    if (selected) {
      // Verificar límite máximo
      if (selectedSubjects.length >= 14) {
        showMaxSubjectsToast()
        return
      }
      
      // Verificar si ya está seleccionada
      if (selectedSubjects.includes(subjectId)) {
        return // Ya está seleccionada, no hacer nada
      }
      
      // Agregar al orden de selección SOLO si no existe ya
      const alreadyExists = selectionOrder.some(item => item.id === subjectId)
      if (!alreadyExists) {
        onSelectionOrderUpdate([...selectionOrder, { id: subjectId, timestamp: Date.now() }])
      }
      
      onSelectChange(subjectId, true)
    } else {
      // Remover del orden de selección
      const newOrder = selectionOrder.filter(item => item.id !== subjectId)
      onSelectionOrderUpdate(newOrder)
      onSelectChange(subjectId, false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
        <p className="text-lg text-cyan-800">Cargando asignaturas...</p>
      </div>
    )
  }

  if (availableSubjects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay asignaturas disponibles</h3>
        <p className="text-muted-foreground">
          Todas las asignaturas están cerradas o no hay oferta para este período.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 350px)' }}>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 pb-6">
        {availableSubjects.map((subject, index) => {
          const isSelected = selectedSubjects.includes(subject.id)
          // Obtener el orden de selección si está seleccionada
          const selectionItem = selectionOrder.find(item => item.id === subject.id)
          const selectionIndex = selectionItem ? selectionOrder.findIndex(item => item.id === subject.id) + 1 : undefined

          return (
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
                onSelectChange={(selected) => handleSelectChange(subject.id, selected)}
                isSelected={isSelected}
                selectionOrder={selectionIndex}
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}