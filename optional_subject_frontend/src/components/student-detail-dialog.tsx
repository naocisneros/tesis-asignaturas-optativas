'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  User,
  Building2,
  Calendar,
  Users,
  CheckCircle,
  FileText,
  X,
  GraduationCap,
  IdCard
} from "lucide-react";
import { Student } from "@/mapped_types/student.type";

interface StudentDetailsDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailsDialog({ student, open, onOpenChange }: StudentDetailsDialogProps) {
  if (!student) return null;

  // Función para capitalizar primera letra (opcional)
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  // Badge para el estado
  const getEstadoBadge = (estado: string) => {
    const styles = {
      activo: "bg-green-100 text-green-800",
      inactivo: "bg-red-100 text-red-800",
      graduado: "bg-blue-100 text-blue-800",
    };
    const colorClass = styles[estado as keyof typeof styles] || "bg-gray-100 text-gray-800";
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {capitalize(estado)}
      </span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-0 bg-white">
        {/* Encabezado con degradado azul/cián */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-gradient-to-r from-cyan-700 via-cyan-800 to-blue-900 text-white p-4"
        >
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <User className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Detalles del estudiante
                </DialogTitle>
                <DialogDescription className="text-cyan-200 text-xs">
                  Información completa del estudiante seleccionado.
                </DialogDescription>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">Año académico</span>
                </div>
                <p className="text-sm font-bold mt-0.5 truncate">{student.año_academico}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span className="text-xs">Estado</span>
                </div>
                <div className="mt-0.5">{getEstadoBadge(student.estado)}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span className="text-xs">Grupo docente</span>
                </div>
                <p className="text-sm font-bold mt-0.5 truncate">{student.grupo_docente}</p>
              </div>
            </div>
          </DialogHeader>
        </motion.div>

        {/* Contenido con scroll */}
        <div className="p-4 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-3">
            {/* Información personal */}
            <div className="space-y-2">
              <h3 className="font-semibold text-cyan-800 flex items-center gap-1 text-sm">
                <User className="h-3.5 w-3.5" />
                Datos personales
              </h3>
              <div className="bg-cyan-50/50 rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <User className="h-3.5 w-3.5 text-cyan-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-cyan-700">Nombre completo</p>
                    <p className="text-sm font-medium text-cyan-900">
                      {student.nombre} {student.apellidos}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <IdCard className="h-3.5 w-3.5 text-cyan-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-cyan-700">ID</p>
                    <p className="text-sm font-medium text-cyan-900">{student.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información académica */}
            <div className="space-y-2">
              <h3 className="font-semibold text-cyan-800 flex items-center gap-1 text-sm">
                <GraduationCap className="h-3.5 w-3.5" />
                Información académica
              </h3>
              <div className="bg-cyan-50/50 rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Building2 className="h-3.5 w-3.5 text-cyan-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-cyan-700">Facultad</p>
                    <p className="text-sm font-medium text-cyan-900">{student.facultad}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-3.5 w-3.5 text-cyan-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-cyan-700">Año académico</p>
                    <p className="text-sm font-medium text-cyan-900">{student.año_academico}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-3.5 w-3.5 text-cyan-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-cyan-700">Grupo docente</p>
                    <p className="text-sm font-medium text-cyan-900">{student.grupo_docente}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-cyan-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-cyan-700">Estado</p>
                    <div className="mt-1">{getEstadoBadge(student.estado)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Avales */}
            {student.avales && (
              <div className="space-y-2">
                <h3 className="font-semibold text-cyan-800 flex items-center gap-1 text-sm">
                  <FileText className="h-3.5 w-3.5" />
                  Avales
                </h3>
                <div className="bg-cyan-50/50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <FileText className="h-3.5 w-3.5 text-cyan-700 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-cyan-700">Comentarios / Avales</p>
                      <p className="text-sm font-medium text-cyan-900 whitespace-pre-wrap">
                        {student.avales}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pie compacto */}
        <div className="border-t border-cyan-200 p-3 flex justify-end bg-cyan-50/30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="border-cyan-300 text-cyan-700 hover:bg-cyan-100 hover:text-cyan-800 transition-colors text-xs h-8 px-3"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}