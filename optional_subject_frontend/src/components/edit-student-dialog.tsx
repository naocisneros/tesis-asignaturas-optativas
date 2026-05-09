'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { UserPen, Loader2 } from "lucide-react";
import { Student } from "@/mapped_types/student.type";

interface EditStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSuccess?: () => void;
}

export function EditStudentDialog({ open, onOpenChange, student, onSuccess }: EditStudentDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    facultad: "",
    año_academico: 1,
    grupo_docente: "",
    estado: "activo",
    avales: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos del estudiante cuando se abre el diálogo
  useEffect(() => {
    if (student && open) {
      setFormData({
        nombre: student.nombre || "",
        apellidos: student.apellidos || "",
        facultad: student.facultad || "",
        año_academico: student.año_academico || 1,
        grupo_docente: student.grupo_docente || "",
        estado: student.estado || "activo",
        avales: student.avales || "",
      });
    }
  }, [student, open]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setIsLoading(true);

    try {
      // Validaciones básicas
      if (!formData.nombre.trim()) throw new Error("El nombre es requerido");
      if (!formData.apellidos.trim()) throw new Error("Los apellidos son requeridos");
      if (!formData.facultad) throw new Error("La facultad es requerida");
      if (!formData.grupo_docente.trim()) throw new Error("El grupo docente es requerido");
      if (formData.año_academico < 1 || formData.año_academico > 5) {
        throw new Error("El año académico debe estar entre 1 y 5");
      }

      // Construir payload según el modelo Student
      const payload = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        facultad: formData.facultad,
        año_academico: formData.año_academico,
        grupo_docente: formData.grupo_docente,
        estado: formData.estado,
        avales: formData.avales || null,
      };

      console.log("Payload PATCH Student:", payload);

      const response = await fetch(`http://localhost:8000/api/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Respuesta del servidor:", response.status, errorText);
        throw new Error(`Error al actualizar el estudiante (${response.status})`);
      }

      // Éxito
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  // Opciones para facultad (ajústalas según tu backend)
  const facultadOptions = [
    "Facultad de Tecnología Libre",
    "Facultad de Ciencias Tecnológicas Organizacionales",
    "Facultad de Tecnología Interactiva",
    "Facultad de Informática Organizacional",
    "Facultad de Tecnología Educativa",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 bg-white">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-gradient-to-r from-cyan-700 via-cyan-800 to-blue-900 text-white p-4"
        >
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <UserPen className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Editar estudiante
                </DialogTitle>
                <DialogDescription className="text-cyan-200 text-xs">
                  Modifica los campos para actualizar la información del estudiante.
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

            {/* Apellidos */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Apellidos *</label>
              <Input
                placeholder="Ej. Pérez García"
                value={formData.apellidos}
                onChange={(e) => handleChange("apellidos", e.target.value)}
                required
              />
            </div>

            {/* Facultad */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Facultad *</label>
              <Select
                value={formData.facultad}
                onValueChange={(value) => handleChange("facultad", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una facultad" />
                </SelectTrigger>
                <SelectContent>
                  {facultadOptions.map((fac) => (
                    <SelectItem key={fac} value={fac}>
                      {fac}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Año académico */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Año académico *</label>
              <Input
                type="number"
                min="1"
                max="5"
                step="1"
                value={formData.año_academico}
                onChange={(e) => handleChange("año_academico", parseInt(e.target.value) || 1)}
                required
              />
            </div>

            {/* Grupo docente */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Grupo docente *</label>
              <Input
                placeholder="Ej. GRUPO-A-101"
                value={formData.grupo_docente}
                onChange={(e) => handleChange("grupo_docente", e.target.value)}
                required
              />
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado *</label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleChange("estado", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="graduado">Graduado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Avales (texto largo) */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Avales / Comentarios</label>
              <Textarea
                placeholder="Información adicional, avales académicos, observaciones..."
                value={formData.avales}
                onChange={(e) => handleChange("avales", e.target.value)}
                rows={3}
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
              Actualizar estudiante
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}