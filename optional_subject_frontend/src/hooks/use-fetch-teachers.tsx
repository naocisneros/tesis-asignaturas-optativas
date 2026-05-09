'use client'

import { useState, useEffect, useCallback } from 'react'
import { Teacher } from '@/mapped_types/teacher.type'

export const useTeachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/teachers')
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setTeachers(data.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching teachers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  return { 
    teachers, 
    loading, 
    error,
    refresh: fetchTeachers // Función para recargar los datos
  }
}