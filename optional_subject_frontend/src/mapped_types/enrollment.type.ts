
export interface Enrollment {
  id: string
  user_id: string
  subject_id: string
  createdAt: Date | string
  user?: {
    id: string
    name: string
    email: string
    faculty?: string
  }
  subject?: {
    id: string
    nombre: string
    matrícula: number
    capacidad?: number
  }
}