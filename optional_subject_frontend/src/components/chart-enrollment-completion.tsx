"use client"

import * as React from "react"
import { TrendingUp, Users, DollarSign, Target, AlertCircle, Loader2, GraduationCap } from "lucide-react"
import { RadialBar, RadialBarChart, ResponsiveContainer, Cell } from "recharts"
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
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Subject } from "@/mapped_types/subject.type"

interface EnrollmentCompletionChartProps {
  subject?: Subject | null
  enrollmentCount?: number
  capacity?: number
  subjectCost?: number
  loading?: boolean
  onRefresh?: () => void
}

export function EnrollmentCompletionChart({
  subject,
  enrollmentCount = 0,
  capacity = 50, // Capacidad por defecto
  subjectCost = 0,
  loading = false,
  onRefresh
}: EnrollmentCompletionChartProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  // Calcular porcentaje de completitud
  const completionPercentage = React.useMemo(() => {
    if (!capacity || capacity === 0) return 0
    const percentage = (enrollmentCount / capacity) * 100
    return Math.min(100, Math.round(percentage))
  }, [enrollmentCount, capacity])

  // Calcular ingresos
  const revenue = React.useMemo(() => {
    return enrollmentCount * subjectCost
  }, [enrollmentCount, subjectCost])

  const maxRevenue = capacity * subjectCost

  // Datos para el gráfico radial
  const chartData = React.useMemo(() => {
    return [
      {
        name: 'Completitud',
        value: completionPercentage,
        fill: getProgressColor(completionPercentage)
      },
      {
        name: 'Restante',
        value: 100 - completionPercentage,
        fill: 'hsl(var(--muted))'
      }
    ]
  }, [completionPercentage])

  // Obtener color según el porcentaje
  function getProgressColor(percentage: number) {
    if (percentage >= 90) return "hsl(var(--destructive))"
    if (percentage >= 70) return "hsl(var(--warning))"
    if (percentage >= 50) return "hsl(var(--primary))"
    return "hsl(var(--success))"
  }

  // Obtener texto según el porcentaje
  function getStatusText(percentage: number) {
    if (percentage >= 90) return "¡Casi lleno!"
    if (percentage >= 70) return "Buena demanda"
    if (percentage >= 50) return "Progreso moderado"
    if (percentage >= 30) return "Comenzando"
    return "Baja demanda"
  }

  // Obtener icono según el porcentaje
  function getStatusIcon(percentage: number) {
    if (percentage >= 90) return <AlertCircle className="h-5 w-5" />
    if (percentage >= 70) return <TrendingUp className="h-5 w-5" />
    return <Users className="h-5 w-5" />
  }

  if (loading) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando estadísticas...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Obteniendo datos de inscripciones</p>
          </div>
        </CardContent>
      </Card>
    )
  }

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
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold">
                Progreso de Matrícula
              </CardTitle>
              <CardDescription>
                {subject ? subject.nombre : 'Estadísticas generales'}
              </CardDescription>
            </div>
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                className="h-8 w-8 p-0"
              >
                <Loader2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 space-y-6">
          {/* Gráfico radial central */}
          <div className="relative">
            <ChartContainer
              config={{}}
              className="mx-auto aspect-square max-h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="30%"
                  outerRadius="100%"
                  data={chartData}
                  startAngle={90}
                  endAngle={450}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    background={{ fill: 'hsl(var(--muted))' }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </RadialBar>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        formatter={(value) => [`${value}%`, 'Completitud']}
                      />
                    }
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Texto central */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                animate={{ scale: isHovered ? 1.1 : 1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold">
                  {completionPercentage}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Completado
                </div>
              </motion.div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="space-y-4">
            {/* Barra de progreso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Cupos ocupados</span>
                <span className="font-bold">
                  {enrollmentCount} / {capacity}
                </span>
              </div>
              <Progress 
                value={completionPercentage} 
                className="h-3"
                style={{
                  backgroundColor: `${getProgressColor(completionPercentage)}20`
                }}
              />
            </div>

            {/* Estadísticas detalladas */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="p-3 rounded-lg bg-primary/5 border"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Estudiantes</span>
                </div>
                <div className="text-2xl font-bold">{enrollmentCount}</div>
                <div className="text-xs text-muted-foreground">
                  Inscritos
                </div>
              </motion.div>

              <motion.div 
                className="p-3 rounded-lg bg-green-500/5 border border-green-500/20"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Cupos</span>
                </div>
                <div className="text-2xl font-bold">{revenue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">
                  de {maxRevenue.toLocaleString()}
                </div>
              </motion.div>
            </div>

            {/* Estado actual */}
            <div className={`p-3 rounded-lg border ${
              completionPercentage >= 90 
                ? 'bg-destructive/10 border-destructive/20' 
                : completionPercentage >= 70
                ? 'bg-warning/10 border-warning/20'
                : 'bg-success/10 border-success/20'
            }`}>
              <div className="flex items-center gap-2">
                {getStatusIcon(completionPercentage)}
                <span className="font-medium">{getStatusText(completionPercentage)}</span>
                <Badge 
                  className="ml-auto"
                  variant={completionPercentage >= 90 ? "destructive" : "outline"}
                >
                  {capacity - enrollmentCount} cupos disponibles
                </Badge>
              </div>
            </div>

            {/* Información de la asignatura */}
            {subject && (
              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium text-sm">Detalles de la asignatura:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Matrícula:</span>
                    <span className="ml-2 font-medium">{subject.matrícula}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Categoría:</span>
                    <span className="ml-2 font-medium">{subject.categoría}</span>
                  </div>
                  {subject.sección && (
                    <div>
                      <span className="text-muted-foreground">Sección:</span>
                      <span className="ml-2 font-medium">{subject.sección}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Estado:</span>
                    <Badge 
                      className="ml-2"
                      variant={subject.estado === 'disponible' ? 'default' : 'destructive'}
                    >
                      {subject.estado}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex-col gap-2 text-sm pt-4 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Meta de inscripción</span>
            </div>
            <div className="font-medium">
              {completionPercentage >= 100 ? '✅ Completado' : `${100 - completionPercentage}% restante`}
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center w-full">
            Última actualización: {new Date().toLocaleTimeString('es-ES')}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}