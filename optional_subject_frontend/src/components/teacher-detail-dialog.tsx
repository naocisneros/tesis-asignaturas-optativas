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
  User,
  Mail,
  Phone,
  IdCard,
  Calendar,
  Briefcase,
  GraduationCap,
  MapPin,
  Globe,
  Camera,
  Award,
  Clock,
  X
} from "lucide-react"
import { Teacher } from "@/mapped_types/teacher.type"

interface TeacherDetailsDialogProps {
  teacher: Teacher | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeacherDetailsDialog({ teacher, open, onOpenChange }: TeacherDetailsDialogProps) {
  if (!teacher) return null

  // Función para formatear fechas
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-"
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
        {/* Encabezado con degradado rojo vino */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-gradient-to-r from-red-900 via-red-800 to-rose-900 text-white p-4"
        >
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <User className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Detalles del profesor
                </DialogTitle>
                <DialogDescription className="text-red-200 text-xs">
                  Información completa del profesor seleccionado.
                </DialogDescription>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  <span className="text-xs">Experiencia</span>
                </div>
                <p className="text-sm font-bold mt-0.5 truncate">{teacher.años_experiencia} años</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">Contratación</span>
                </div>
                <p className="text-sm font-bold mt-0.5">{formatDate(teacher.fecha_contratacion)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span className="text-xs">Nacionalidad</span>
                </div>
                <p className="text-sm font-bold mt-0.5 capitalize truncate">{teacher.nacionalidad || "-"}</p>
              </div>
            </div>
          </DialogHeader>
        </motion.div>

        {/* Contenido con scroll */}
        <div className="p-4 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Información personal */}
            <div className="space-y-2">
              <h3 className="font-semibold text-red-900 flex items-center gap-1 text-sm">
                <User className="h-3.5 w-3.5" />
                Información personal
              </h3>
              <div className="bg-red-50/50 rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <User className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-600">Nombre completo</p>
                    <p className="text-xs font-medium text-red-900">{teacher.nombre} {teacher.apellido}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-600">Email</p>
                    <p className="text-xs font-medium text-red-900">{teacher.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-600">Teléfono</p>
                    <p className="text-xs font-medium text-red-900">{teacher.telefono || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <IdCard className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-600">Documento identidad</p>
                    <p className="text-xs font-medium text-red-900">{teacher.documento_identidad || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fechas importantes */}
            <div className="space-y-2">
              <h3 className="font-semibold text-red-900 flex items-center gap-1 text-sm">
                <Calendar className="h-3.5 w-3.5" />
                Fechas
              </h3>
              <div className="bg-red-50/50 rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-600">Fecha nacimiento</p>
                    <p className="text-xs font-medium text-red-900">{formatDate(teacher.fecha_nacimiento)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-600">Fecha contratación</p>
                    <p className="text-xs font-medium text-red-900">{formatDate(teacher.fecha_contratacion)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-600">Fecha terminación</p>
                    <p className="text-xs font-medium text-red-900">{formatDate(teacher.fecha_terminacion) || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formación y experiencia */}
            <div className="space-y-2 md:col-span-2">
              <h3 className="font-semibold text-red-900 flex items-center gap-1 text-sm">
                <GraduationCap className="h-3.5 w-3.5" />
                Formación y experiencia
              </h3>
              <div className="bg-red-50/50 rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Award className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-600">Títulos académicos</p>
                    <p className="text-xs font-medium text-red-900">{teacher.titulos_academicos || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-600">Años de experiencia</p>
                    <p className="text-xs font-medium text-red-900">{teacher.años_experiencia} años</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dirección y ubicación */}
            <div className="space-y-2 md:col-span-2">
              <h3 className="font-semibold text-red-900 flex items-center gap-1 text-sm">
                <MapPin className="h-3.5 w-3.5" />
                Ubicación
              </h3>
              <div className="bg-red-50/50 rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-600">Dirección</p>
                    <p className="text-xs font-medium text-red-900">{teacher.direccion || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-600">Nacionalidad</p>
                    <p className="text-xs font-medium text-red-900">{teacher.nacionalidad || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Foto URL */}
            {teacher.foto_url && (
              <div className="space-y-2 md:col-span-2">
                <h3 className="font-semibold text-red-900 flex items-center gap-1 text-sm">
                  <Camera className="h-3.5 w-3.5" />
                  Foto
                </h3>
                <div className="bg-red-50/50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Camera className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-red-600">URL de la foto</p>
                      <p className="text-xs font-medium text-red-900 break-all">{teacher.foto_url}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pie compacto */}
        <div className="border-t border-red-200 p-3 flex justify-end bg-red-50/30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800 transition-colors text-xs h-8 px-3"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}