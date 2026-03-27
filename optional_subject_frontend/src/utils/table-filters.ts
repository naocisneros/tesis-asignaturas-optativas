import { Row } from "@tanstack/react-table"
import { Subject } from "@/mapped_types/subject.type"

export const subjectStringFields: (keyof Subject)[] = [
  'id',
  'nombre',
  'descripción',
  'estado',
  'categoría',
  'sección',
  'profesor',
  'sede'
]

export const globalFilterFn = (row: Row<Subject>, columnId: string, filterValue: string) => {
  const subject = row.original
  const searchTerm = filterValue.toLowerCase()

  return subjectStringFields.some(field => {
    const value = subject[field]
    if (value == null) return false
    
    return String(value).toLowerCase().includes(searchTerm)
  })
}