"use client"

import { useState } from "react"
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
import { BookOpen, Loader2 } from "lucide-react"

interface AddSubjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// Estado inicial del formulario (valores por defecto)
const initialFormState = {
  nombre: "",
  descripción: "",
  matrícula: 0,
  inicio_de_matrícula: "",
  fin_de_matrícula: "",
  fecha_de_inicio: "",
  fecha_de_fin: "",
  estado: "",
  categoría: "",
  sección: "",
  // profesor: "",
  // sede: "",
}

export function AddSubjectDialog({ open, onOpenChange, onSuccess }: AddSubjectDialogProps) {
  const [formData, setFormData] = useState(initialFormState)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validación básica (puedes ampliarla)
      if (!formData.nombre) throw new Error("El nombre es requerido")
      if (!formData.inicio_de_matrícula) throw new Error("Fecha de inicio de matrícula requerida")
      if (!formData.fin_de_matrícula) throw new Error("Fecha de fin de matrícula requerida")
      if (!formData.fecha_de_inicio) throw new Error("Fecha de inicio requerida")
      if (!formData.fecha_de_fin) throw new Error("Fecha de fin requerida")
      if (!formData.estado) throw new Error("Estado requerido")
      if (!formData.categoría) throw new Error("Categoría requerida")
      if (!formData.sección) throw new Error("Sección requerida")

      // Construir payload dinámicamente
      const payload: Record<string, any> = {
        nombre: formData.nombre,
        descripción: formData.descripción || undefined, // si está vacío, no se envía
        matrícula: Number(formData.matrícula),
        inicio_de_matrícula: formData.inicio_de_matrícula, // YYYY-MM-DD
        fin_de_matrícula: formData.fin_de_matrícula,
        fecha_de_inicio: formData.fecha_de_inicio,
        fecha_de_fin: formData.fecha_de_fin,
        estado: formData.estado,
        categoría: formData.categoría,
        sección: formData.sección,
      }

      // Solo incluir profesor y sede si tienen valor (evitar strings vacíos)
      // if (formData.profesor) payload.profesor = formData.profesor
      // if (formData.sede) payload.sede = formData.sede

      // Log para depuración
      console.log("Payload enviado:", payload)

      const response = await fetch("http://localhost:8000/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Respuesta del servidor:", response.status, errorText)
        throw new Error(`Error al crear la asignatura (${response.status})`)
      }

      // Éxito: resetear formulario y cerrar diálogo
      setFormData(initialFormState)
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
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Agregar nueva asignatura
                </DialogTitle>
                <DialogDescription className="text-blue-200 text-xs">
                  Completa los campos para registrar una nueva asignatura optativa.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </motion.div>

        <form onSubmit={handleSubmit} className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <Input
                placeholder="Ej. Matemáticas Avanzadas"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                required
              />
            </div>

            {/* Categoría - valores según backend */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select
                value={formData.categoría}
                onValueChange={(value) => handleChange("categoría", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inteligencia_artificial">Inteligencia Artificial</SelectItem>
                  <SelectItem value="programacion">Programación</SelectItem>
                  <SelectItem value="matematica">Matemática</SelectItem>
                  <SelectItem value="inteligencia_organizacional">Inteligencia Organizacional</SelectItem>
                  <SelectItem value="ingenieria_de_software">Ingeniería de Software</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Créditos */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Créditos</label>
              <Input
                type="number"
                min="0"
                step="1"
                value={formData.matrícula}
                onChange={(e) => handleChange("matrícula", parseInt(e.target.value) || 0)}
                required
              />
            </div>

            {/* Sección - valores según backend */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sección</label>
              <Select
                value={formData.sección}
                onValueChange={(value) => handleChange("sección", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona horario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matutina">Matutina</SelectItem>
                  <SelectItem value="vespertina">Vespertina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estado - valores según backend */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleChange("estado", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="cerrada">Cerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Profesor (opcional) */}
            {/* <div className="space-y-2">
              <label className="text-sm font-medium">Profesor (opcional)</label>
              <Input
                placeholder="Nombre del profesor"
                value={formData.profesor}
                onChange={(e) => handleChange("profesor", e.target.value)}
              />
            </div> */}

            {/* Sede (opcional) */}
            {/* <div className="space-y-2">
              <label className="text-sm font-medium">Sede (opcional)</label>
              <Input
                placeholder="Ej. Campus Central"
                value={formData.sede}
                onChange={(e) => handleChange("sede", e.target.value)}
              />
            </div> */}

            {/* Descripción (opcional) */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Descripción (opcional)</label>
              <Textarea
                placeholder="Breve descripción de la asignatura"
                value={formData.descripción}
                onChange={(e) => handleChange("descripción", e.target.value)}
              />
            </div>

            {/* Fechas - en formato YYYY-MM-DD */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Inicio de matrícula</label>
              <Input
                type="date"
                value={formData.inicio_de_matrícula}
                onChange={(e) => handleChange("inicio_de_matrícula", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fin de matrícula</label>
              <Input
                type="date"
                value={formData.fin_de_matrícula}
                onChange={(e) => handleChange("fin_de_matrícula", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de inicio</label>
              <Input
                type="date"
                value={formData.fecha_de_inicio}
                onChange={(e) => handleChange("fecha_de_inicio", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha de fin</label>
              <Input
                type="date"
                value={formData.fecha_de_fin}
                onChange={(e) => handleChange("fecha_de_fin", e.target.value)}
                required
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
              Guardar asignatura
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}