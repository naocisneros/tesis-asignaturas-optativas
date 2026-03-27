"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, ArrowRight, BookOpen, Filter, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Subject } from "@/mapped_types/subject.type"

interface SubjectSearchCarouselProps {
  subjects: Subject[]
  currentIndex: number
  onIndexChange: (index: number) => void
  onSubjectClick?: (subject: Subject) => void
  placeholder?: string
}

export function SubjectSearchCarousel({
  subjects,
  currentIndex,
  onIndexChange,
  onSubjectClick,
  placeholder = "Buscar asignatura..."
}: SubjectSearchCarouselProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchResults, setSearchResults] = useState<Subject[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filtrar resultados según la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const filtered = subjects.filter(subject => 
      subject.nombre.toLowerCase().includes(query) ||
      subject.descripción?.toLowerCase().includes(query) ||
      subject.categoría.toLowerCase().includes(query) ||
      subject.profesor?.toLowerCase().includes(query)
    )

    setSearchResults(filtered.slice(0, 5)) // Limitar a 5 resultados
    setShowSuggestions(true)
  }, [searchQuery, subjects])

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      handleSelectResult(searchResults[0])
    }
  }

  const handleSelectResult = (subject: Subject) => {
    const index = subjects.findIndex(s => s.id === subject.id)
    if (index !== -1) {
      onIndexChange(index)
      
      // Efecto visual de éxito
      const input = inputRef.current
      if (input) {
        input.classList.add("ring-2", "ring-green-500")
        setTimeout(() => {
          input.classList.remove("ring-2", "ring-green-500")
        }, 1000)
      }
      
      // Si hay callback para click en asignatura
      if (onSubjectClick) {
        onSubjectClick(subject)
      }
      
      // Cerrar sugerencias y resetear búsqueda después de un momento
      setTimeout(() => {
        setShowSuggestions(false)
        setSearchQuery("")
        setIsExpanded(false)
      }, 1500)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      MATEMATICA: "bg-blue-500/10 text-blue-600",
      INFORMATICA: "bg-purple-500/10 text-purple-600",
      FISICA: "bg-red-500/10 text-red-600",
      QUIMICA: "bg-green-500/10 text-green-600",
      BIOLOGIA: "bg-emerald-500/10 text-emerald-600",
      LENGUAJE: "bg-amber-500/10 text-amber-600",
      HISTORIA: "bg-indigo-500/10 text-indigo-600"
    }
    return colors[category] || "bg-gray-500/10 text-gray-600"
  }

  return (
    <div ref={searchRef} className="relative">
      {/* Botón de búsqueda compacto (estado inicial) */}
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="compact"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => {
                setIsExpanded(true)
                setTimeout(() => inputRef.current?.focus(), 100)
              }}
              variant="outline"
              className="group relative overflow-hidden bg-white dark:bg-gray-900 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Search className="h-4 w-4 mr-2 text-primary" />
              </motion.div>
              <span className="font-medium text-primary">Buscar asignatura</span>
              
              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Button>
          </motion.div>
        ) : (
          /* Campo de búsqueda expandido */
          <motion.div
            key="expanded"
            initial={{ width: "auto", opacity: 0, y: -10 }}
            animate={{ width: "100%", opacity: 1, y: 0 }}
            exit={{ width: "auto", opacity: 0, y: -10 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative"
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                
                <Input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={placeholder}
                  className="pl-10 pr-12 py-6 text-base rounded-xl border-2 border-primary/20 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-white dark:bg-gray-900 shadow-lg"
                />
                
                {/* Controles dentro del input */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <motion.button
                      type="button"
                      onClick={handleClearSearch}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                  )}
                  
                  <motion.button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                </div>
              </div>
              
              {/* Botón de búsqueda (opcional) */}
              {searchQuery && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mt-2"
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Buscar "{searchQuery}"
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel de sugerencias */}
      <AnimatePresence>
        {showSuggestions && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden"
          >
            {/* Header de sugerencias */}
            <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {subjects.length} asignaturas totales
                </Badge>
              </div>
            </div>
            
            {/* Lista de sugerencias */}
            <div className="max-h-80 overflow-y-auto">
              {searchResults.map((subject, index) => (
                <motion.button
                  key={subject.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    x: 5,
                    backgroundColor: "rgba(59, 130, 246, 0.05)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectResult(subject)}
                  className="w-full text-left p-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
                          {subject.nombre}
                        </h4>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={`text-xs ${getCategoryColor(subject.categoría)}`}>
                          {subject.categoría.toLowerCase()}
                        </Badge>
                        
                        {subject.sección && (
                          <Badge variant="outline" className="text-xs">
                            {subject.sección}
                          </Badge>
                        )}
                        
                        {subject.estado === 'disponible' ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Disponible
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            {subject.estado}
                          </Badge>
                        )}
                        
                        <span className="text-xs text-muted-foreground ml-auto">
                          ${subject.matrícula}
                        </span>
                      </div>
                      
                      {subject.descripción && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                          {subject.descripción}
                        </p>
                      )}
                    </div>
                    
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="ml-4 flex-shrink-0"
                    >
                      <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                    </motion.div>
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* Footer de sugerencias */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
              <p className="text-xs text-muted-foreground text-center">
                Selecciona una asignatura para navegar automáticamente a ella
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje de sin resultados */}
      <AnimatePresence>
        {showSuggestions && searchQuery && searchResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron resultados
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              No hay asignaturas que coincidan con "{searchQuery}"
            </p>
            <div className="text-xs text-muted-foreground">
              Prueba con otras palabras o términos diferentes
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}