import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { title } from "process"

interface SubjectFormCardProps {
  nombre: string
  descripción: string
  matrícula: number
  profesor: string
  inicio_de_matrícula: string
  sede: string
  seats: string
  tags: string[]
  onSelectChange?: (selected: boolean) => void
  isSelected?: boolean
  selectionOrder?: number
}

export function SubjectFormCard({ 
  nombre, 
  descripción, 
  matrícula, 
  profesor, 
  inicio_de_matrícula, 
  sede, 
  seats, 
  tags, 
  onSelectChange 
}: SubjectFormCardProps) {
  const [isSelected, setIsSelected] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleCheckboxChange = (checked: boolean) => {
    setIsSelected(checked)
    onSelectChange?.(checked)
  }

  // Colores de imágenes por tema
  const imageUrls = [
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]

  // Seleccionar imagen aleatoria basada en el título
  const imageIndex = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % imageUrls.length

  return (
    <div 
      className="relative transition-all duration-300"
      style={{ perspective: "1000px" }}
    >
      <Card
        className={cn(
          "relative w-full transition-all duration-300 transform-gpu hover:z-10",
          "hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-green-500/10",
          isSelected 
            ? "scale-[1.02] bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 shadow-lg shadow-green-500/20 ring-2 ring-green-400"
            : isHovered 
              ? "scale-[1.01] bg-card"
              : "scale-100"
        )}
        style={{
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transformStyle: "preserve-3d",
          height: "100%",
          minHeight: "280px"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full">
          {/* Contenedor de imagen - Ahora en la parte superior */}
          <div className="relative w-full h-32 overflow-hidden">
            <div className={cn(
              "absolute inset-0 z-30 transition-all duration-500",
              isSelected ? "bg-green-500/20" : "bg-black/10"
            )} />
            <img
              src={imageUrls[imageIndex]}
              alt={nombre}
              className={cn(
                "relative z-20 h-full w-full object-cover transition-all duration-500 transform-gpu",
                isSelected 
                  ? "brightness-110 scale-105" 
                  : "brightness-90 grayscale hover:grayscale-0 hover:brightness-100"
              )}
              style={{
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            />
          </div>

          {/* Contenido de la card */}
          <div className="flex flex-col flex-grow p-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className={cn(
                "text-base font-bold transition-all duration-300 line-clamp-1",
                isSelected && "text-white"
              )}>
                {nombre}
              </CardTitle>
              <CardDescription className={cn(
                "text-xs transition-all duration-300 line-clamp-2 h-10",
                isSelected && "text-green-100"
              )}>
                {descripción}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow p-0 space-y-2">
              <div className="flex flex-wrap gap-1 mb-2">
                <Badge 
                  variant="secondary"
                  className={cn(
                    "transition-all duration-300 text-xs",
                    isSelected && "bg-white/20 text-white border-white/30"
                  )}
                >
                  {matrícula} Matrícula
                </Badge>
                {tags.slice(0, 2).map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className={cn(
                      "transition-all duration-300 text-xs",
                      isSelected && "bg-white/20 text-white border-white/30"
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Profesor:</span>
                  <span className={cn("transition-all duration-300", isSelected && "text-green-100")}>
                    {profesor}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Horario:</span>
                  <span className={cn("transition-all duration-300", isSelected && "text-green-100")}>
                    {inicio_de_matrícula}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Aula:</span>
                  <span className={cn("transition-all duration-300", isSelected && "text-green-100")}>
                    {sede}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-0 pt-3 mt-auto">
              {/* Checkbox y label ahora en todo el ancho del footer */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1">
                  <span className={cn(
                    "text-xs font-medium",
                    isSelected ? "text-green-100" : "text-muted-foreground"
                  )}>
                    Cupos:
                  </span>
                  <span className={cn(
                    "text-xs font-bold",
                    seats.split('/')[0] === seats.split('/')[1] 
                      ? "text-red-500" 
                      : isSelected 
                        ? "text-white" 
                        : "text-green-600"
                  )}>
                    {seats}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor={`select-card-${nombre}`}
                    className={cn(
                      "text-sm font-medium leading-none cursor-pointer transition-all duration-300",
                      "hover:scale-105 active:scale-95",
                      isSelected 
                        ? "text-white font-bold" 
                        : "text-gray-700 hover:text-green-600"
                    )}
                  >
                    Seleccionar
                  </label>
                  <Checkbox
                    id={`select-card-${nombre}`}
                    checked={isSelected}
                    onCheckedChange={handleCheckboxChange}
                    className={cn(
                      "h-5 w-5 transition-all duration-300 transform-gpu",
                      "hover:scale-110 active:scale-95",
                      "border-2 border-gray-300 hover:border-green-500",
                      "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600",
                      "data-[state=checked]:scale-110 data-[state=checked]:shadow-md"
                    )}
                    style={{
                      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    }}
                  />
                </div>
              </div>
            </CardFooter>
          </div>
        </div>

        {/* Indicador de selección */}
        {isSelected && (
          <div className="absolute top-2 right-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              Seleccionada
            </div>
          </div>
        )}

        {/* Efecto de brillo cuando está seleccionado */}
        {isSelected && (
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, rgba(72, 187, 120, 0.1) 0%, transparent 70%)",
              animation: "pulse 2s infinite",
            }}
          />
        )}
      </Card>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}