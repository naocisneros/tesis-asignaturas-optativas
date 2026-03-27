"use client"

import * as React from "react"
import { TrendingUp, Info } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { motion } from "framer-motion"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"

export const description = "A donut chart with text"

// Colores para las categorías
const CATEGORY_COLORS: Record<string, string> = {
  "Inteligencia Artificial": "var(--color-ai)",
  "Matemáticas": "var(--color-math)",
  "Ingeniería de Software": "var(--color-software)",
  "Ciencias de la Computación": "var(--color-cs)",
  "Bases de Datos": "var(--color-db)",
  "Redes y Comunicaciones": "var(--color-network)",
  "Seguridad Informática": "var(--color-security)",
  "Desarrollo Web": "var(--color-web)",
  "Sistemas Operativos": "var(--color-os)",
  "Programación": "var(--color-programming)",
}

// Colores por defecto para categorías no definidas
const DEFAULT_COLORS = [
  "var(--color-ai)",
  "var(--color-math)",
  "var(--color-software)",
  "var(--color-cs)",
  "var(--color-db)",
  "var(--color-network)",
  "var(--color-security)",
  "var(--color-web)",
  "var(--color-os)",
  "var(--color-programming)",
]

const chartConfig = {
  percentage: {
    label: "Porcentaje",
  },
} satisfies ChartConfig

interface ChartPieSubjectProps {
  selectedSubjects?: string[]
  allSubjects?: Array<{
    id: string
    categoría: string
    nombre: string
    matrícula: number
  }>
}

export function ChartPieSubject({ 
  selectedSubjects = [], 
  allSubjects = [] 
}: ChartPieSubjectProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  // Calcular distribución de categorías en tiempo real
  const chartData = React.useMemo(() => {
    if (!selectedSubjects || selectedSubjects.length === 0) {
      return []
    }

    // Filtrar las asignaturas seleccionadas
    const selected = allSubjects.filter(subject => 
      subject && subject.id && selectedSubjects.includes(subject.id)
    )

    // Si no hay asignaturas seleccionadas válidas
    if (selected.length === 0) {
      return []
    }

    // Agrupar por categoría
    const categories = selected.reduce((acc, subject) => {
      const category = subject.categoría || "Sin categoría"
      if (!acc[category]) {
        acc[category] = {
          count: 0,
          credits: 0,
          subjects: []
        }
      }
      acc[category].count += 1
      acc[category].credits += subject.matrícula || 0
      acc[category].subjects.push(subject.nombre)
      return acc
    }, {} as Record<string, { count: number; credits: number; subjects: string[] }>)

    // Convertir a array para el gráfico
    const totalCount = selected.length
    const result = Object.entries(categories).map(([category, data], index) => {
      const percentage = Math.round((data.count / totalCount) * 100)
      return {
        subject: category,
        percentage,
        count: data.count,
        credits: data.credits,
        fill: CATEGORY_COLORS[category] || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
      }
    })

    // Ordenar por porcentaje descendente
    return result.sort((a, b) => b.percentage - a.percentage)
  }, [selectedSubjects, allSubjects])

  // Calcular porcentaje total
  const totalPercentage = React.useMemo(() => {
    if (!selectedSubjects || selectedSubjects.length === 0) return 0
    return Math.min(100, selectedSubjects.length * 20) // Asumiendo máximo 5 asignaturas
  }, [selectedSubjects])

  // Generar config dinámica para el gráfico
  const dynamicChartConfig = React.useMemo(() => {
    const config: any = {
      percentage: {
        label: "Porcentaje",
      },
    }

    chartData.forEach((item, index) => {
      const key = item.subject.toLowerCase().replace(/\s+/g, '_')
      config[key] = {
        label: item.subject,
        color: item.fill,
      }
    })

    return config satisfies ChartConfig
  }, [chartData])

  // Contar asignaturas seleccionadas válidas
  const validSelectedCount = React.useMemo(() => {
    if (!selectedSubjects || !allSubjects) return 0
    
    return allSubjects.filter(subject => 
      subject && subject.id && selectedSubjects.includes(subject.id)
    ).length
  }, [selectedSubjects, allSubjects])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        className="flex flex-col h-full transition-all duration-300 hover:shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="items-center pb-4">
          <CardTitle className="text-xl font-bold">
            Distribución por Categoría
          </CardTitle>
          <CardDescription>
            {validSelectedCount > 0 
              ? `${validSelectedCount} asignatura(s) seleccionada(s)` 
              : 'Selecciona asignaturas para ver la distribución'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 space-y-6">
          {validSelectedCount === 0 ? (
            // Estado cuando no hay selecciones
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="rounded-full bg-gray-100 p-6 mb-4">
                <Info className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Sin datos para mostrar
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-xs">
                Selecciona asignaturas en la lista para ver la distribución por categorías
              </p>
            </motion.div>
          ) : (
            <>
              {/* Progress Bars */}
              <div className="space-y-4">
                {chartData.map((item, index) => (
                  <motion.div 
                    key={item.subject}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.subject}</span>
                        <span className="text-xs text-muted-foreground">
                          ({item.count} asignatura{item.count > 1 ? 's' : ''})
                        </span>
                      </div>
                
                    </div>
                    <Progress 
                      value={item.percentage} 
                      className="h-2"
                      style={{
                        backgroundColor: `${item.fill}20`,
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pie Chart */}
              <motion.div
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ChartContainer
                  config={dynamicChartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="percentage"
                      nameKey="subject"
                      innerRadius={isHovered ? 50 : 60}
                      outerRadius={isHovered ? 90 : 80}
                      strokeWidth={isHovered ? 8 : 5}
                      animationDuration={500}
                      animationEasing="ease-out"
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox && validSelectedCount > 0) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {validSelectedCount}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground text-sm"
                                >
                                  {validSelectedCount === 1 ? 'asignatura' : 'asignaturas'}
                                </tspan>
                              </text>
                            )
                          }
                          return null
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </motion.div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex-col gap-2 text-sm pt-4">
          {validSelectedCount > 0 ? (
            <>
              <div className="flex items-center gap-2 leading-none font-medium text-green-600">
                <TrendingUp className="h-4 w-4" />
                Progreso de tu solicitud actual
              </div>
              <div className="text-muted-foreground leading-none text-center">
                Distribución de {chartData.length} categoría{chartData.length > 1 ? 's' : ''} distintas
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 leading-none text-amber-600">
              <Info className="h-4 w-4" />
              Selecciona al menos 1 asignatura para ver estadísticas
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}