'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Student } from "@/mapped_types/student.type";

interface DeleteStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSuccess?: () => void;
}

export function DeleteStudentDialog({ open, onOpenChange, student, onSuccess }: DeleteStudentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!student) return;

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/students/${student.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Respuesta del servidor:", response.status, errorText);
        throw new Error(`Error al eliminar el estudiante (${response.status})`);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-white">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-gradient-to-r from-cyan-700 via-cyan-800 to-blue-900 text-white p-4"
        >
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Eliminar estudiante
                </DialogTitle>
                <DialogDescription className="text-cyan-100 text-xs">
                  Esta acción no se puede deshacer.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </motion.div>

        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-cyan-100 rounded-full">
              <Trash2 className="h-8 w-8 text-cyan-700" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              ¿Estás seguro de eliminar este estudiante?
            </p>
            <p className="text-sm text-gray-500">
              {student?.nombre} {student?.apellidos}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Se eliminarán todos los datos asociados a este estudiante.
            </p>
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
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-cyan-700 hover:bg-cyan-800"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}