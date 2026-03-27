"use client"

import { useState, useEffect } from 'react'

interface Enrollment {
  id: string
  user_id: string
  subject_id: string
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export const useEnrollments = (subjectId?: string) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enrollmentStats, setEnrollmentStats] = useState<{
    total: number
    uniqueStudents: number
    completionPercentage: number
  }>({
    total: 0,
    uniqueStudents: 0,
    completionPercentage: 0
  })

  const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || 
             localStorage.getItem('auth_token') || 
             sessionStorage.getItem('token') ||
             null
    }
    return null
  }

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true)
        setError(null)

        const authToken = getAuthToken()
        let url = 'http://localhost:8000/api/enrollments'
        
        if (subjectId) {
          url = `http://localhost:8000/api/enrollments/subject/${subjectId}`
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        
        const data = await response.json()
        setEnrollments(data.data || data)
        
        // Calcular estadísticas
        if (data.data || data) {
          const enrollmentsData = data.data || data
          const uniqueStudents = new Set(enrollmentsData.map((e: Enrollment) => e.user_id)).size
          setEnrollmentStats({
            total: enrollmentsData.length,
            uniqueStudents,
            completionPercentage: 0 // Se calculará con matrícula
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Error fetching enrollments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollments()
  }, [subjectId])

  // Función para calcular porcentaje de completitud basado en matrícula
  const calculateCompletionPercentage = (subjectCapacity: number, subjectCost: number) => {
    if (!subjectCapacity || !subjectCost) return 0
    
    // Suponiendo que subjectCapacity es el número máximo de estudiantes
    const currentEnrollments = enrollments.length
    const percentage = (currentEnrollments / subjectCapacity) * 100
    
    // También considerar el costo (si hay un presupuesto)
    const maxRevenue = subjectCapacity * subjectCost
    const currentRevenue = currentEnrollments * subjectCost
    const revenuePercentage = (currentRevenue / maxRevenue) * 100
    
    // Retornar el promedio o el que prefieras
    return Math.min(100, Math.round((percentage + revenuePercentage) / 2))
  }

  return { 
    enrollments, 
    loading, 
    error, 
    enrollmentStats,
    calculateCompletionPercentage,
    refresh: () => {
      // Recargar datos
      setLoading(true)
      const authToken = getAuthToken()
      const url = subjectId 
        ? `http://localhost:8000/api/enrollments/subject/${subjectId}`
        : 'http://localhost:8000/api/enrollments'
      
      fetch(url, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          setEnrollments(data.data || data)
          const uniqueStudents = new Set((data.data || data).map((e: Enrollment) => e.user_id)).size
          setEnrollmentStats({
            total: (data.data || data).length,
            uniqueStudents,
            completionPercentage: 0
          })
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
    }
  }
}