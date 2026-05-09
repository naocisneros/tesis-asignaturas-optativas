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
import { useSubjects } from "@/hooks/use-fetch-subjects"
import { Subject } from "@/mapped_types/subject.type"
import { EditSubjectDialog } from "./edit-subject-dialog"
import { DeleteSubjectDialog } from "./delete-subject-dialog"

// Tipo para los datos de la tabla con fechas convertidas
type TableSubject = Subject & {
  fecha_de_inicio: Date | null;
  fecha_de_fin: Date | null;
  inicio_de_matrícula: Date | null;
  fin_de_matrícula: Date | null;
}

export function SubjectDataTable() {
  const { subjects, loading, error, refresh } = useSubjects()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedSubject, setSelectedSubject] = React.useState<Subject | null>(null)

  // Definición de columnas con el tipo correcto
  const columns = React.useMemo<ColumnDef<TableSubject>[]>(() => [
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
        const subject = row.original
        return <div className="font-medium">{subject.nombre}</div>
      },
    },
    {
      accessorKey: "categoría",
      header: "Categoría",
      cell: ({ row }) => {
        const subject = row.original
        const categorias: Record<string, string> = {
          inteligencia_artificial: "Inteligencia Artificial",
          programacion: "Programación",
          matematica: "Matemática",
          inteligencia_organizacional: "Inteligencia Organizacional",
          ingenieria_de_software: "Ingeniería de Software",
          testing: "Testing"
        }
        return <div>{categorias[subject.categoría] || subject.categoría}</div>
      },
    },
    {
      accessorKey: "matrícula",
      header: () => <div className="text-right">Créditos</div>,
      cell: ({ row }) => {
        const subject = row.original
        return <div className="text-right font-medium">{subject.matrícula}</div>
      },
    },
    {
      accessorKey: "sección",
      header: "Horario",
      cell: ({ row }) => {
        const subject = row.original
        const horarios: Record<string, string> = {
          matutina: "Matutina (8am - 12pm)",
          vespertina: "Vespertina (1pm - 5pm)"
        }
        return <div>{horarios[subject.sección] || subject.sección}</div>
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const subject = row.original
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            subject.estado === "disponible" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {subject.estado === "disponible" ? "Disponible" : "Cerrada"}
          </span>
        )
      },
    },
    {
      accessorKey: "fecha_de_inicio",
      header: "Fecha inicio",
      cell: ({ row }) => {
        const subject = row.original
        const fecha = subject.fecha_de_inicio
        const fechaFormateada = fecha
          ? new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : "-"
        return <div>{fechaFormateada}</div>
      },
    },
    {
      accessorKey: "fecha_de_fin",
      header: "Fecha fin",
      cell: ({ row }) => {
        const subject = row.original
        const fecha = subject.fecha_de_fin
        const fechaFormateada = fecha
          ? new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : "-"
        return <div>{fechaFormateada}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const subject = row.original
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
                  onClick={() => navigator.clipboard.writeText(subject.id)}
                  className="hover:bg-cyan-50 hover:text-cyan-900"
                >
                  Copiar identificador
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedSubject(subject)
                    setEditDialogOpen(true)
                  }}
                  className="hover:bg-cyan-50 hover:text-cyan-900"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedSubject(subject)
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

  // Preparar datos: mantener las fechas como strings o convertirlas según necesidad
  const tableData = React.useMemo<TableSubject[]>(() => {
    return subjects.map((subject) => ({
      ...subject,
      fecha_de_inicio: subject.fecha_de_inicio ? new Date(subject.fecha_de_inicio) : null,
      fecha_de_fin: subject.fecha_de_fin ? new Date(subject.fecha_de_fin) : null,
      inicio_de_matrícula: subject.inicio_de_matrícula ? new Date(subject.inicio_de_matrícula) : null,
      fin_de_matrícula: subject.fin_de_matrícula ? new Date(subject.fin_de_matrícula) : null,
    }))
  }, [subjects])

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
          <p className="mt-2 text-cyan-700">Cargando asignaturas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="text-center text-cyan-600">
          <p>Error al cargar las asignaturas: {error}</p>
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
              <Button variant="outline" className="ml-auto bg-cyan-800 text-white hover:bg-cyan-50 hover:text-cyan-900">
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
                        {column.id === "matrícula" ? "Créditos" : 
                         column.id === "sección" ? "Horario" :
                         column.id === "fecha_de_inicio" ? "Fecha inicio" :
                         column.id === "fecha_de_fin" ? "Fecha fin" :
                         column.id === "inicio_de_matrícula" ? "Inicio matrícula" :
                         column.id === "fin_de_matrícula" ? "Fin matrícula" :
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
                    No se encontraron asignaturas.
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

      {/* Diálogo para editar asignatura */}
      <EditSubjectDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        subject={selectedSubject}
        onSuccess={handleSuccess}
      />

      {/* Diálogo para eliminar asignatura */}
      <DeleteSubjectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        subject={selectedSubject}
        onSuccess={handleSuccess}
      />
    </>
  )
}