'use client'

import { useState, useEffect, useCallback } from 'react'
import { Subject } from '@/mapped_types/subject.type'

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/subjects')
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setSubjects(data.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching subjects:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  return { 
    subjects, 
    loading, 
    error,
    refresh: fetchSubjects // Función para recargar los datos
  }
}