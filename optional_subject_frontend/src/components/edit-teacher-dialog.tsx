"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { UserPen, Loader2 } from "lucide-react"
import { Teacher } from "@/mapped_types/teacher.type"

interface EditTeacherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teacher: Teacher | null
  onSuccess?: () => void
}

export function EditTeacherDialog({ open, onOpenChange, teacher, onSuccess }: EditTeacherDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    documento_identidad: "",
    fecha_contratacion: "",
    fecha_terminacion: "",
    titulos_academicos: "",
    años_experiencia: 0,
    direccion: "",
    fecha_nacimiento: "",
    nacionalidad: "",
    foto_url: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Cargar datos del teacher cuando se abre el diálogo
  useEffect(() => {
    if (teacher && open) {
      setFormData({
        nombre: teacher.nombre || "",
        apellido: teacher.apellido || "",
        email: teacher.email || "",
        telefono: teacher.telefono || "",
        documento_identidad: teacher.documento_identidad || "",
        fecha_contratacion: teacher.fecha_contratacion 
          ? new Date(teacher.fecha_contratacion).toISOString().split('T')[0] 
          : "",
        fecha_terminacion: teacher.fecha_terminacion 
          ? new Date(teacher.fecha_terminacion).toISOString().split('T')[0] 
          : "",
        titulos_academicos: teacher.titulos_academicos || "",
        años_experiencia: teacher.años_experiencia || 0,
        direccion: teacher.direccion || "",
        fecha_nacimiento: teacher.fecha_nacimiento 
          ? new Date(teacher.fecha_nacimiento).toISOString().split('T')[0] 
          : "",
        nacionalidad: teacher.nacionalidad || "",
        foto_url: teacher.foto_url || "",
      })
    }
  }, [teacher, open])

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teacher) return
    
    setIsLoading(true)

    try {
      // Validaciones
      if (!formData.nombre) throw new Error("El nombre es requerido")
      if (!formData.apellido) throw new Error("El apellido es requerido")
      if (!formData.email) throw new Error("El email es requerido")
      if (!formData.email.includes("@")) throw new Error("Email inválido")
      if (!formData.documento_identidad) throw new Error("El documento de identidad es requerido")

      // Construir payload según el modelo Teacher
      const payload: Record<string, any> = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono || null,
        documento_identidad: formData.documento_identidad,
        fecha_contratacion: formData.fecha_contratacion || null,
        fecha_terminacion: formData.fecha_terminacion || null,
        titulos_academicos: formData.titulos_academicos || null,
        años_experiencia: Number(formData.años_experiencia) || 0,
        direccion: formData.direccion || null,
        fecha_nacimiento: formData.fecha_nacimiento || null,
        nacionalidad: formData.nacionalidad || null,
        foto_url: formData.foto_url || null,
      }

      console.log("Payload PATCH Teacher:", payload)

      const response = await fetch(`http://localhost:8000/api/teachers/${teacher.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Respuesta del servidor:", response.status, errorText)
        throw new Error(`Error al actualizar el profesor (${response.status})`)
      }

      // Éxito
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 bg-white">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-4"
        >
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <UserPen className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Editar profesor
                </DialogTitle>
                <DialogDescription className="text-blue-200 text-xs">
                  Modifica los campos para actualizar la información del profesor.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </motion.div>

        <form onSubmit={handleSubmit} className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre *</label>
              <Input
                placeholder="Ej. Juan"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                required
              />
            </div>

            {/* Apellido */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Apellido *</label>
              <Input
                placeholder="Ej. Pérez"
                value={formData.apellido}
                onChange={(e) => handleChange("apellido", e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                placeholder="juan.perez@ejemplo.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono</label>
              <Input
                type="tel"
                placeholder="+53 12345678"
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>

            {/* Documento de Identidad */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Documento de Identidad *</label>
              <Input
                placeholder="Ej. 12345678901"
                value={formData.documento_identidad}
                onChange={(e) => handleChange("documento_identidad", e.target.value)}
                required
              />
            </div>

            {/* Nacionalidad */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nacionalidad</label>
              <Input
                placeholder="Ej. Cubana"
                value={formData.nacionalidad}
                onChange={(e) => handleChange("nacionalidad", e.target.value)}
              />
            </div>

            {/* Fecha de nacimiento */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de nacimiento</label>
              <Input
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
              />
            </div>

            {/* Años de experiencia */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Años de experiencia</label>
              <Input
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={formData.años_experiencia}
                onChange={(e) => handleChange("años_experiencia", parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Títulos académicos */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Títulos académicos</label>
              <Textarea
                placeholder="Ej. Doctor en Ciencias, Máster en Educación, Licenciado en Matemáticas"
                value={formData.titulos_academicos}
                onChange={(e) => handleChange("titulos_academicos", e.target.value)}
              />
            </div>

            {/* Dirección */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Dirección</label>
              <Textarea
                placeholder="Ej. Calle 123 #456, Municipio, Ciudad"
                value={formData.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
              />
            </div>

            {/* Fecha de contratación */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de contratación</label>
              <Input
                type="date"
                value={formData.fecha_contratacion}
                onChange={(e) => handleChange("fecha_contratacion", e.target.value)}
              />
            </div>

            {/* Fecha de terminación */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de terminación</label>
              <Input
                type="date"
                value={formData.fecha_terminacion}
                onChange={(e) => handleChange("fecha_terminacion", e.target.value)}
              />
            </div>

            {/* URL de foto */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">URL de foto</label>
              <Input
                type="url"
                placeholder="https://ejemplo.com/foto.jpg"
                value={formData.foto_url}
                onChange={(e) => handleChange("foto_url", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar profesor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}