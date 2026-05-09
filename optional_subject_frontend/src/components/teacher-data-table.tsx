"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { useTeachers } from "@/hooks/use-fetch-teachers"
import { Teacher } from "@/mapped_types/teacher.type"
import { TeacherDetailsDialog } from "./teacher-detail-dialog"
import { EditTeacherDialog } from "./edit-teacher-dialog"
import { DeleteTeacherDialog } from "./delete-teacher-dialog"

// Tipo para los datos de la tabla con fechas convertidas
type TableTeacher = Teacher & {
  fecha_contratacion: Date | null;
  fecha_terminacion: Date | null;
  fecha_nacimiento: Date | null;
}

export function TeacherDataTable() {
  const { teachers, loading, error, refresh } = useTeachers()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(null)

  // Definición de columnas
  const columns = React.useMemo<ColumnDef<TableTeacher>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleccionar todos"
          className="border-cyan-400 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
          className="border-cyan-400 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nombre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:text-cyan-800"
          >
            Nombre
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const teacher = row.original
        return <div className="font-medium">{teacher.nombre} {teacher.apellido}</div>
      },
    },
    {
      accessorKey: "apellido",
      header: "Apellido",
      cell: ({ row }) => {
        const teacher = row.original
        return <div>{teacher.apellido}</div>
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:text-cyan-800"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const teacher = row.original
        return <div className="lowercase">{teacher.email}</div>
      },
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
      cell: ({ row }) => {
        const teacher = row.original
        return <div>{teacher.telefono ?? "-"}</div>
      },
    },
    {
      accessorKey: "documento_identidad",
      header: "Documento",
      cell: ({ row }) => {
        const teacher = row.original
        return <div>{teacher.documento_identidad ?? "-"}</div>
      },
    },
    {
      accessorKey: "años_experiencia",
      header: () => <div className="text-right">Experiencia</div>,
      cell: ({ row }) => {
        const teacher = row.original
        return <div className="text-right font-medium">{teacher.años_experiencia} años</div>
      },
    },
    {
      accessorKey: "fecha_contratacion",
      header: () => <div className="text-right">Contratación</div>,
      cell: ({ row }) => {
        const teacher = row.original
        const fecha = teacher.fecha_contratacion
        const fechaFormateada = fecha
          ? fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : "-"
        return <div className="text-right font-medium">{fechaFormateada}</div>
      },
    },
    {
      accessorKey: "nacionalidad",
      header: "Nacionalidad",
      cell: ({ row }) => {
        const teacher = row.original
        return <div>{teacher.nacionalidad ?? "-"}</div>
      },
    },
    {
      accessorKey: "titulos_academicos",
      header: "Títulos",
      cell: ({ row }) => {
        const teacher = row.original
        return <div className="max-w-[200px] truncate">{teacher.titulos_academicos ?? "-"}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const teacher = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:text-cyan-800 hover:bg-cyan-50">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-cyan-200">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-cyan-900">Acciones</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(teacher.id)}
                  className="hover:bg-cyan-50 hover:text-cyan-900"
                >
                  Copiar identificador
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedTeacher(teacher)
                    setEditDialogOpen(true)
                  }}
                  className="hover:bg-cyan-50 hover:text-cyan-900"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedTeacher(teacher)
                    setDetailsOpen(true)
                  }}
                  className="hover:bg-cyan-50 hover:text-cyan-900"
                >
                  Detalles
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedTeacher(teacher)
                    setDeleteDialogOpen(true)
                  }}
                  className="hover:bg-red-50 hover:text-red-600 text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [])

  // Preparar datos: convertir fechas a Date
  const tableData = React.useMemo<TableTeacher[]>(() => {
    return teachers.map((teacher) => ({
      ...teacher,
      fecha_contratacion: teacher.fecha_contratacion ? new Date(teacher.fecha_contratacion) : null,
      fecha_terminacion: teacher.fecha_terminacion ? new Date(teacher.fecha_terminacion) : null,
      fecha_nacimiento: teacher.fecha_nacimiento ? new Date(teacher.fecha_nacimiento) : null,
    }))
  }, [teachers])

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const handleSuccess = () => {
    refresh() // Recargar los datos después de editar/eliminar
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-800 border-r-transparent"></div>
          <p className="mt-2 text-cyan-700">Cargando profesores...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="text-center text-cyan-600">
          <p>Error al cargar los profesores: {error}</p>
          <Button
            variant="outline"
            className="mt-4 border-cyan-300 text-cyan-700 hover:bg-cyan-50"
            onClick={refresh}
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Buscar en todos los campos..."
            className="max-w-sm border-cyan-200 focus-visible:ring-cyan-400"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto border-cyan-300 text-cyan-800 hover:bg-cyan-50 hover:text-cyan-900">
                Columnas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-cyan-200">
              <DropdownMenuGroup>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize hover:bg-cyan-50 hover:text-cyan-900"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id === "años_experiencia" ? "Años experiencia" : 
                         column.id === "fecha_contratacion" ? "Fecha contratación" :
                         column.id === "documento_identidad" ? "Documento" :
                         column.id === "titulos_academicos" ? "Títulos académicos" :
                         column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-hidden rounded-md border border-cyan-200">
          <Table>
            <TableHeader className="bg-cyan-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-cyan-100/50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-cyan-900 font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-cyan-50/50 border-cyan-100"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-cyan-700"
                  >
                    No se encontraron profesores.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-cyan-700">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 disabled:opacity-50"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 disabled:opacity-50"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>

      {/* Diálogo de detalles */}
      <TeacherDetailsDialog
        teacher={selectedTeacher}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      {/* Diálogo para editar profesor */}
      <EditTeacherDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        teacher={selectedTeacher}
        onSuccess={handleSuccess}
      />

      {/* Diálogo para eliminar profesor */}
      <DeleteTeacherDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        teacher={selectedTeacher}
        onSuccess={handleSuccess}
      />
    </>
  )
}