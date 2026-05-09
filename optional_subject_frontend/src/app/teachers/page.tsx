"use client"

import { useState } from "react"
import { ButtonGroupCustom } from "@/components/button-group-menu"
import { TeacherDataTable } from "@/components/teacher-data-table"
import { CustomFooter } from "@/components/footer"
import { AddTeacherDialog } from "@/components/add-teacher-dialog"
import { Users, Plus, UserPen } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Teachers() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
    console.log("Profesor agregado con éxito")
  }

  return (
    <div className="min-h-screen p-6">
      
      <div className="flex justify-between items-start mb-8">
        <Button onClick={() => setDialogOpen(true)} className="flex items-center gap-2 bg-cyan-800 hover:text-cyan-950 hover:bg-white">
          <Plus className="h-4 w-4" />
          Agregar profesor
        </Button>
        {/* <ButtonGroupCustom /> */}
      </div>

      
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-800 hover:text-cyan-950 transition-colors duration-200 flex items-center gap-3">
          <UserPen size={32} />
          Listado de profesores
        </h1>
      </div>

      
      <TeacherDataTable key={refreshTrigger} />

      
      <CustomFooter color="cyan" />

      {/* Diálogo para agregar profesor */}
      <AddTeacherDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  )
}