'use client'

import { useState, useEffect } from 'react'
import { Subject } from '@/mapped_types/subject.type'

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8000/api/subjects')
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        
        const data = await response.json()
        setSubjects(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Error fetching subjects:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  return { subjects, loading, error }
}