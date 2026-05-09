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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye, Calendar, Clock } from "lucide-react"
import { ContentDistribution, ActivityType } from "@/mapped_types/content-distribution.type"
import { Badge } from "@/components/ui/badge"

interface ContentDistributionTableProps {
  data: ContentDistribution[]
  onRowClick?: (item: ContentDistribution) => void
}

const activityTypeColors: Record<ActivityType, string> = {
  [ActivityType.CONFERENCE]: "bg-blue-100 text-blue-800",
  [ActivityType.PRACTICAL_CLASS]: "bg-green-100 text-green-800",
  [ActivityType.LABORATORY]: "bg-purple-100 text-purple-800",
  [ActivityType.WORKSHOP]: "bg-orange-100 text-orange-800",
  [ActivityType.SEMINAR]: "bg-yellow-100 text-yellow-800",
  [ActivityType.TUTORIAL]: "bg-indigo-100 text-indigo-800",
  [ActivityType.FIELD_TRIP]: "bg-emerald-100 text-emerald-800",
  [ActivityType.ASSESSMENT]: "bg-red-100 text-red-800",
  [ActivityType.PROJECT]: "bg-pink-100 text-pink-800"
}

const activityTypeLabels: Record<ActivityType, string> = {
  [ActivityType.CONFERENCE]: "Conferencia",
  [ActivityType.PRACTICAL_CLASS]: "Clase Práctica",
  [ActivityType.LABORATORY]: "Laboratorio",
  [ActivityType.WORKSHOP]: "Taller",
  [ActivityType.SEMINAR]: "Seminario",
  [ActivityType.TUTORIAL]: "Tutoría",
  [ActivityType.FIELD_TRIP]: "Salida de Campo",
  [ActivityType.ASSESSMENT]: "Evaluación",
  [ActivityType.PROJECT]: "Proyecto"
}

export function ContentDistributionTable({ data, onRowClick }: ContentDistributionTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const columns = React.useMemo<ColumnDef<ContentDistribution>[]>(() => [
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
          className="border-cyan-400 data-[state=checked]:bg-cyan-600"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
          className="border-cyan-400 data-[state=checked]:bg-cyan-600"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "subjectName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:text-cyan-800"
        >
          Asignatura
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.subjectName}</div>
      ),
    },
    {
      accessorKey: "topicTitle",
      header: "Título del Tema",
      cell: ({ row }) => (
        <div className="max-w-md truncate">{row.original.topicTitle}</div>
      ),
    },
    {
      accessorKey: "activityType",
      header: "Tipo de Actividad",
      cell: ({ row }) => (
        <Badge className={activityTypeColors[row.original.activityType]}>
          {activityTypeLabels[row.original.activityType]}
        </Badge>
      ),
    },
    {
      accessorKey: "weekNumber",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:text-cyan-800"
        >
          Semana
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>Semana {row.original.weekNumber}</div>,
    },
    {
      accessorKey: "durationHours",
      header: "Duración",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{row.original.durationHours} horas</span>
        </div>
      ),
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:text-cyan-800"
        >
          Fecha Inicio
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.original.startDate
        return date ? new Date(date).toLocaleDateString('es-ES') : "-"
      },
    },
    {
      accessorKey: "endDate",
      header: "Fecha Fin",
      cell: ({ row }) => {
        const date = row.original.endDate
        return date ? new Date(date).toLocaleDateString('es-ES') : "-"
      },
    },
    {
      accessorKey: "isActive",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"} 
               className={row.original.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
          {row.original.isActive ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const distribution = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onRowClick?.(distribution)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(distribution.id)}>
                Copiar ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [onRowClick])

  const table = useReactTable({
    data,
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Buscar por asignatura, tema o descripción..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm border-cyan-200 focus-visible:ring-cyan-400"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === "subjectName" ? "Asignatura" :
                     column.id === "topicTitle" ? "Título" :
                     column.id === "activityType" ? "Tipo" :
                     column.id === "weekNumber" ? "Semana" :
                     column.id === "durationHours" ? "Duración" :
                     column.id === "startDate" ? "Fecha Inicio" :
                     column.id === "endDate" ? "Fecha Fin" :
                     column.id === "isActive" ? "Estado" :
                     column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}