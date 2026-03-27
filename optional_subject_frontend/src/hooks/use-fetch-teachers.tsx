'use client'

import { useState, useEffect } from 'react'
import { Teacher } from '@/mapped_types/teacher.type';

interface PaginatedResponse {
    data: Teacher[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const useTeachers = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
    })

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setLoading(true)
                // Ajusta la URL según tu configuración
                const response = await fetch('http://localhost:8000/api/teachers')
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`)
                }
                
                const data: PaginatedResponse = await response.json()
                setTeachers(data.data)
                setPagination(data.meta)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido')
                console.error('Error fetching teachers:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchTeachers()
    }, [])

    return { 
        teachers, 
        loading, 
        error,
        pagination
    }
}