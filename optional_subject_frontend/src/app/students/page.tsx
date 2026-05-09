'use client';

import { useState } from "react";
import { ButtonGroupCustom } from "@/components/button-group-menu";
import { StudentDataTable } from "@/components/student-data-table";
import { CustomFooter } from "@/components/footer";
import { AddStudentDialog } from "@/components/add-student-dialog";
import { Users, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Students() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    console.log("Estudiante agregado con éxito");
  };

  return (
    <div className="min-h-screen p-6">
      {/* Botón para agregar estudiante */}
      <div className="flex justify-between items-start mb-8">
        <Button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 bg-cyan-800 hover:text-cyan-950 hover:bg-white"
        >
          <Plus className="h-4 w-4" />
          Agregar estudiante
        </Button>
        {/* <ButtonGroupCustom /> */}
      </div>

      {/* Título */}
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-800 hover:text-cyan-950 transition-colors duration-200 flex items-center gap-3">
          <User size={32} />
          Listado de estudiantes
        </h1>
      </div>

      {/* Tabla de estudiantes */}
      <StudentDataTable key={refreshTrigger} />

      {/* Footer */}
      <CustomFooter color="cyan" />

      {/* Diálogo para agregar estudiante */}
      <AddStudentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}