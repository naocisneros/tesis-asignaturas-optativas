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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { useSubjects } from "@/hooks/use-fetch-subjects"
import { Subject } from "@/mapped_types/subject.type"
import { globalFilterFn } from "@/utils/table-filters"
import { SubjectDetailsDialog } from "./subject-detail-dialog" // Ajusta la ruta si es necesario

export function SubjectDataTable() {
  const { subjects, loading, error } = useSubjects()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState<string>("")

  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [selectedSubject, setSelectedSubject] = React.useState<Subject | null>(null)

  // Definición de columnas (memorizada)
  const columns = React.useMemo<ColumnDef<Subject>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "categoría",
      header: "Categoría",
      cell: ({ row }) => {
        const subject = row.original
        return <div className="capitalize">{subject.categoría}</div>
      },
    },
    {
      accessorKey: "nombre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const subject = row.original
        return <div className="lowercase">{subject.nombre}</div>
      },
    },
    {
      accessorKey: "descripción",
      header: "Descripción",
      cell: ({ row }) => {
        const subject = row.original
        return <div className="text-sm text-gray-600">{subject.descripción ?? "-"}</div>
      },
    },
    {
      accessorKey: "matrícula",
      header: () => <div className="text-right">Matrícula</div>,
      cell: ({ row }) => {
        const subject = row.original
        const matricula = subject.matrícula ?? 0
        return <div className="text-right font-medium">{matricula}</div>
      },
    },
    {
      accessorKey: "inicio_de_matrícula",
      header: () => <div className="text-right">Inicio de Matrícula</div>,
      cell: ({ row }) => {
        const subject = row.original
        const fecha = subject.inicio_de_matrícula
        const fechaFormateada = fecha instanceof Date
          ? fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
        return <div className="text-right font-medium">{fechaFormateada}</div>
      },
    },
    {
      accessorKey: "fin_de_matrícula",
      header: () => <div className="text-right">Fin de Matrícula</div>,
      cell: ({ row }) => {
        const subject = row.original
        const fecha = subject.fin_de_matrícula
        const fechaFormateada = fecha instanceof Date
          ? fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
        return <div className="text-right font-medium">{fechaFormateada}</div>
      },
    },
    {
      accessorKey: "fecha_de_inicio",
      header: () => <div className="text-right">Fecha de inicio</div>,
      cell: ({ row }) => {
        const subject = row.original
        const fecha = subject.fecha_de_inicio
        const fechaFormateada = fecha instanceof Date
          ? fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
        return <div className="text-right font-medium">{fechaFormateada}</div>
      },
    },
    {
      accessorKey: "fecha_de_fin",
      header: () => <div className="text-right">Fecha de fin</div>,
      cell: ({ row }) => {
        const subject = row.original
        const fecha = subject.fecha_de_fin
        const fechaFormateada = fecha instanceof Date
          ? fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
          : new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
        return <div className="text-right font-medium">{fechaFormateada}</div>
      },
    },
    {
      accessorKey: "estado",
      header: () => <div className="text-right">Estado</div>,
      cell: ({ row }) => {
        const subject = row.original
        return <div className="capitalize text-right">{subject.estado}</div>
      },
    },
    {
      accessorKey: "sección",
      header: "Sección",
      cell: ({ row }) => {
        const subject = row.original
        return <div>{subject.sección ?? "-"}</div>
      },
    },
    {
      accessorKey: "profesor",
      header: "Profesor",
      cell: ({ row }) => {
        const subject = row.original
        return <div>{subject.profesor ?? "-"}</div>
      },
    },
    {
      accessorKey: "sede",
      header: "Sede",
      cell: ({ row }) => {
        const subject = row.original
        return <div>{subject.sede ?? "-"}</div>
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
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(subject.id)}
                >
                  Copiar identificador
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem>Editar</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedSubject(subject)
                    setDetailsOpen(true)
                  }}
                >
                  Detalles
                </DropdownMenuItem>
                <DropdownMenuItem>Eliminar</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [])

  // Preparar datos: convertir fechas a Date
  const tableData = React.useMemo(() => {
    return subjects.map((subject) => ({
      ...subject,
      inicio_de_matrícula: new Date(subject.inicio_de_matrícula),
      fin_de_matrícula: new Date(subject.fin_de_matrícula),
      fecha_de_inicio: new Date(subject.fecha_de_inicio),
      fecha_de_fin: new Date(subject.fecha_de_fin),
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
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-900 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Cargando materias...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="text-center text-red-600">
          <p>Error al cargar las materias: {error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
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
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto bg-cyan-900 text-white hover:bg-gray-300 hover:text-cyan-900">
                Columnas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
                    className="h-24 text-center"
                  >
                    Sin resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <SubjectDetailsDialog
        subject={selectedSubject}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  )
}