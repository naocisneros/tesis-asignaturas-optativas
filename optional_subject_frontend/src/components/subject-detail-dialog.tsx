"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import {
  BookOpen,
  Hash,
  Type,
  FolderTree,
  FileText,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle,
  Users,
  User,
  MapPin,
  X
} from "lucide-react"
import { Subject } from "@/mapped_types/subject.type"

interface SubjectDetailsDialogProps {
  subject: Subject | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SubjectDetailsDialog({ subject, open, onOpenChange }: SubjectDetailsDialogProps) {
  if (!subject) return null

  // Función para formatear fechas
  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-0 bg-white">
        {/* Encabezado compacto */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-4"
        >
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Detalles de la asignatura
                </DialogTitle>
                <DialogDescription className="text-blue-200 text-xs">
                  Información completa de la asignatura seleccionada.
                </DialogDescription>
              </div>
            </div>

            {/* Estadísticas rápidas más pequeñas */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  <span className="text-xs">ID</span>
                </div>
                <p className="text-sm font-bold mt-0.5 truncate">{subject.id}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  <span className="text-xs">Matrícula</span>
                </div>
                <p className="text-sm font-bold mt-0.5">{subject.matrícula}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span className="text-xs">Estado</span>
                </div>
                <p className="text-sm font-bold mt-0.5 capitalize truncate">{subject.estado}</p>
              </div>
            </div>
          </DialogHeader>
        </motion.div>

        {/* Contenido con scroll - más compacto */}
        <div className="p-4 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Información básica */}
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900 flex items-center gap-1 text-sm">
                <Type className="h-3.5 w-3.5" />
                Información general
              </h3>
              <div className="bg-blue-50/50 rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Type className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-600">Nombre</p>
                    <p className="text-xs font-medium text-blue-900">{subject.nombre}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FolderTree className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-600">Categoría</p>
                    <p className="text-xs font-medium text-blue-900 capitalize">{subject.categoría}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-600">Descripción</p>
                    <p className="text-xs text-blue-800">{subject.descripción || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fechas importantes */}
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900 flex items-center gap-1 text-sm">
                <Calendar className="h-3.5 w-3.5" />
                Fechas
              </h3>
              <div className="bg-blue-50/50 rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-600">Inicio matrícula</p>
                    <p className="text-xs font-medium text-blue-900">{formatDate(subject.inicio_de_matrícula)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-600">Fin matrícula</p>
                    <p className="text-xs font-medium text-blue-900">{formatDate(subject.fin_de_matrícula)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-600">Fecha inicio</p>
                    <p className="text-xs font-medium text-blue-900">{formatDate(subject.fecha_de_inicio)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-600">Fecha fin</p>
                    <p className="text-xs font-medium text-blue-900">{formatDate(subject.fecha_de_fin)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Asignación */}
            <div className="space-y-2 md:col-span-2">
              <h3 className="font-semibold text-blue-900 flex items-center gap-1 text-sm">
                <Users className="h-3.5 w-3.5" />
                Asignación
              </h3>
              <div className="bg-blue-50/50 rounded-lg p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-start gap-2">
                  <User className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-600">Profesor</p>
                    <p className="text-xs font-medium text-blue-900">{subject.profesor || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-600">Sección</p>
                    <p className="text-xs font-medium text-blue-900">{subject.sección || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-600">Sede</p>
                    <p className="text-xs font-medium text-blue-900">{subject.sede || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie compacto */}
        <div className="border-t border-blue-100 p-3 flex justify-end bg-blue-50/30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition-colors text-xs h-8 px-3"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}