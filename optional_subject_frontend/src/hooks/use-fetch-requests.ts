'use client'

import { useState, useEffect } from 'react'
import { Request } from '@/mapped_types/request.type'

export const useRequests = () => {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:8000/api/requests')
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        
        const data = await response.json()
        setRequests(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        console.error('Error fetching requests:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  return { requests, loading, error }
}