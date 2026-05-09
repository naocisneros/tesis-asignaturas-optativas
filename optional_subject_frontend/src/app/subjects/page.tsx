"use client"

import { useState } from "react"
import { ButtonGroupCustom } from "@/components/button-group-menu"
import { SubjectDataTable } from "@/components/subject-data-table"
import { CustomFooter } from "@/components/footer"
import { AddSubjectDialog } from "@/components/add-subject-dialog"
import { School, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Subjects() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
    console.log("Asignatura agregada con éxito")
  }

  return (
    <div className="min-h-screen p-6">
      
      <div className="flex justify-between items-start mb-8">
        <Button onClick={() => setDialogOpen(true)} className="flex items-center gap-2 bg-cyan-800  hover:text-cyan-950  hover:bg-white">
          <Plus className="h-4 w-4"/>
          Agregar asignatura
        </Button>
        {/* <ButtonGroupCustom /> */}
      </div>

      
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-900 hover:text-red-950 transition-colors duration-200 flex items-center gap-3">
          <School size={32} />
          Listado de asignaturas optativas
        </h1>
      </div>

      
      <SubjectDataTable key={refreshTrigger} />

      
      <CustomFooter />

      
      <AddSubjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  )
}