'use client'

import { useState, useEffect, useCallback } from 'react'
import { ContentDistribution } from '@/mapped_types/content-distribution.type'

export const useContentDistribution = () => {
  const [distributions, setDistributions] = useState<ContentDistribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDistributions = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/content-distribution')
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setDistributions(data.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching distributions:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDistributions()
  }, [fetchDistributions])

  return { 
    distributions, 
    loading, 
    error,
    refresh: fetchDistributions
  }
}