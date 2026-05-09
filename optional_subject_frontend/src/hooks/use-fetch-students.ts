'use client';

import { useState, useEffect, useCallback } from 'react';
import { Student } from '@/mapped_types/student.type';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/students');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      // Ajusta según la estructura que devuelva tu backend:
      // Si devuelve { data: Student[] } -> data.data
      // Si devuelve directamente el array -> data
      setStudents(data.data || data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { 
    students, 
    loading, 
    error,
    refresh: fetchStudents
  };
};