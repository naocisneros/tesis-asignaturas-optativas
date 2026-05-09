'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector
} from 'recharts';
import { useSubjects } from '@/hooks/use-fetch-subjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download, FileSpreadsheet, Image, Info } from 'lucide-react';
import { toPng } from 'html-to-image';
import * as XLSX from 'xlsx';

// Colores degradados en tonos esmeralda/teal
const CHART_COLORS = {
  primary: '#0F766E',   // esmeralda oscuro
  secondary: '#14B8A6', // teal
  accent: '#2DD4BF',    // menta
  pie: ['#0F766E', '#14B8A6', '#2DD4BF', '#5EEAD4', '#134E4A', '#042F2E', '#115E59', '#1D6F6F']
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-teal-200 transition-all duration-200">
        <p className="font-semibold text-teal-800">{label}</p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Cantidad:</span> {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export function StatisticsDashboard() {
  const { subjects, loading, error } = useSubjects();
  const [exportingChart, setExportingChart] = useState<string | null>(null);
  
  // Referencias para cada gráfico (para exportar a imagen)
  const chart1Ref = useRef<HTMLDivElement>(null);
  const chart2Ref = useRef<HTMLDivElement>(null);
  const chart3Ref = useRef<HTMLDivElement>(null);

  // Procesar datos
  const { subjectData, categoryData, topSubjects, totalStudents, topSubject } = useMemo(() => {
    if (!subjects || subjects.length === 0) {
      return { subjectData: [], categoryData: [], topSubjects: [], totalStudents: 0, topSubject: null };
    }

    // Asegurar que cada subject tenga studentCount (si no, calcular desde students.length)
    const enriched = subjects.map(subj => ({
      ...subj,
      studentCount: subj.matrícula?? 0,
      category: subj.categoría || 'Sin categoría'
    }));

    const subjectStats = enriched.map(subj => ({
      name: subj.nombre,
      value: subj.studentCount,
      category: subj.category
    }));

    subjectStats.sort((a, b) => b.value - a.value);
    const topSubjects = subjectStats.slice(0, 8);
    const totalStudents = subjectStats.reduce((sum, curr) => sum + curr.value, 0);
    const topSubject = topSubjects[0] || null;

    // Agrupar por categoría
    const categoryMap = new Map<string, number>();
    subjectStats.forEach(item => {
      const cat = item.category;
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + item.value);
    });
    const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

    return { subjectData: subjectStats, categoryData, topSubjects, totalStudents, topSubject };
  }, [subjects]);

  // Exportar gráfico como PNG
  const exportAsImage = async (ref: React.RefObject<HTMLDivElement>, name: string) => {
    if (!ref.current) return;
    setExportingChart(name);
    try {
      const dataUrl = await toPng(ref.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `${name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al exportar imagen:', err);
      alert('No se pudo exportar la imagen');
    } finally {
      setExportingChart(null);
    }
  };

  // Exportar todos los datos a Excel
  const exportToExcel = () => {
    const wsData = [
      ['Estadísticas Académicas - Reporte completo'],
      [''],
      ['Asignaturas por cantidad de estudiantes'],
      ['Asignatura', 'Estudiantes matriculados', 'Categoría']
    ];
    subjectData.forEach(s => {
      wsData.push([s.category]);
    });
    wsData.push([''], ['Resumen por categoría'], ['Categoría', 'Total estudiantes']);
    wsData.push([''], ['Asignaturas con mayor demanda (Top 8)'], ['Asignatura', 'Demanda']);
    wsData.push([''], [`Total estudiantes: ${totalStudents}`]);
    if (topSubject) wsData.push([`Asignatura con más estudiantes: ${topSubject.name} (${topSubject.value})`]);
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Estadísticas');
    XLSX.writeFile(wb, `estadisticas_${new Date().toISOString().slice(0,19)}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
        <span className="ml-2 text-teal-800">Cargando estadísticas...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  }

  return (
    <div className="space-y-8 p-4 md:p-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Cabecera con métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-teal-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total estudiantes</p>
                <h3 className="text-3xl font-bold text-teal-800">{totalStudents}</h3>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <Info className="h-6 w-6 text-teal-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-teal-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total asignaturas</p>
                <h3 className="text-3xl font-bold text-teal-800">{subjects.length}</h3>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <Info className="h-6 w-6 text-teal-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-teal-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Asignatura con más estudiantes</p>
                <h3 className="text-lg font-bold text-teal-800 truncate">{topSubject?.name || '-'}</h3>
                <p className="text-sm text-gray-600">{topSubject?.value || 0} estudiantes</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <Info className="h-6 w-6 text-teal-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botones globales de exportación */}
      <div className="flex justify-end gap-3">
        <Button 
          onClick={exportToExcel}
          className="bg-teal-700 hover:bg-teal-800 text-white transition-all duration-200 transform hover:scale-105"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar a Excel
        </Button>
      </div>

      {/* Gráfico 1: Estudiantes por asignatura (barras horizontales) */}
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between bg-white dark:bg-gray-800 border-b">
          <CardTitle className="text-teal-800 flex items-center gap-2">
            <span>📊</span> Estudiantes por asignatura
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportAsImage(chart1Ref, 'estudiantes_por_asignatura')}
            disabled={exportingChart === 'chart1'}
            className="border-teal-300 text-teal-700 hover:bg-teal-50"
          >
            {exportingChart === 'chart1' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Image className="h-4 w-4 mr-1" />
            )}
            Exportar PNG
          </Button>
        </CardHeader>
        <CardContent className="p-4" ref={chart1Ref}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart
              layout="vertical"
              data={topSubjects}
              margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
              <XAxis type="number" tick={{ fill: '#0F766E' }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={120} 
                tick={{ fill: '#0F766E', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#CCFBF1', opacity: 0.3 }} />
              <Legend wrapperStyle={{ color: '#0F766E' }} />
              <Bar 
                dataKey="value" 
                fill={CHART_COLORS.primary}
                radius={[0, 8, 8, 0]}
                animationDuration={1000}
                animationEasing="ease-out"
                label={{ position: 'right', fill: '#115E59', fontSize: 12 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico 2: Estudiantes por categoría (Pie - dona) */}
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between bg-white dark:bg-gray-800 border-b">
          <CardTitle className="text-teal-800 flex items-center gap-2">
            <span>🥧</span> Distribución por categorías
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportAsImage(chart2Ref, 'distribucion_por_categorias')}
            disabled={exportingChart === 'chart2'}
            className="border-teal-300 text-teal-700 hover:bg-teal-50"
          >
            {exportingChart === 'chart2' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Image className="h-4 w-4 mr-1" />}
            Exportar PNG
          </Button>
        </CardHeader>
        <CardContent className="p-4" ref={chart2Ref}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={130}
                paddingAngle={3}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#14B8A6', strokeWidth: 1 }}
                animationDuration={1000}
                animationBegin={300}
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CHART_COLORS.pie[index % CHART_COLORS.pie.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#0F766E' }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico 3: Asignaturas con mayor demanda (barras verticales) */}
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between bg-white dark:bg-gray-800 border-b">
          <CardTitle className="text-teal-800 flex items-center gap-2">
            <span>📈</span> Asignaturas con mayor demanda de matrícula
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportAsImage(chart3Ref, 'mayor_demanda')}
            disabled={exportingChart === 'chart3'}
            className="border-teal-300 text-teal-700 hover:bg-teal-50"
          >
            {exportingChart === 'chart3' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Image className="h-4 w-4 mr-1" />}
            Exportar PNG
          </Button>
        </CardHeader>
        <CardContent className="p-4" ref={chart3Ref}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={topSubjects} margin={{ top: 20, right: 30, left: 60, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
              <XAxis 
                dataKey="name" 
                angle={-35} 
                textAnchor="end" 
                height={80} 
                interval={0} 
                tick={{ fill: '#0F766E', fontSize: 11 }}
              />
              <YAxis allowDecimals={false} tick={{ fill: '#0F766E' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#CCFBF1', opacity: 0.3 }} />
              <Legend wrapperStyle={{ color: '#0F766E' }} />
              <Bar 
                dataKey="value" 
                fill={CHART_COLORS.secondary}
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
                animationEasing="ease-out"
                label={{ position: 'top', fill: '#115E59', fontSize: 12 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}