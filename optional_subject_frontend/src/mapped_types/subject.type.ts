

export interface Subject {
  id: string
  nombre: string
  descripción: string
  matrícula: number
  inicio_de_matrícula: Date | string
  fin_de_matrícula: Date | string
  fecha_de_inicio: Date | string
  fecha_de_fin: Date | string
  estado: string
  categoría: string
  sección: string // Agregar este campo para mostrar matutino/vespertino
  profesor: string
  sede: string
}