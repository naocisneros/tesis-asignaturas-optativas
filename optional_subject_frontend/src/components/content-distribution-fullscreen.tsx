"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KanbanView } from "./kanban-view-content-distribution"
import { ContentDistributionTable } from "./content-distribution-datatable"
import { ContentDistribution } from "@/mapped_types/content-distribution.type"
import { LayoutGrid, Table as TableIcon } from "lucide-react"

interface ContentDistributionTabsProps {
  data: ContentDistribution[]
  onItemClick?: (item: ContentDistribution) => void
  defaultView?: "kanban" | "table"
}

export function ContentDistributionTabs({ 
  data, 
  onItemClick, 
  defaultView = "kanban" 
}: ContentDistributionTabsProps) {
  const [activeView, setActiveView] = useState<"kanban" | "table">(defaultView)

  return (
    <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "kanban" | "table")} className="w-full">
      <TabsList className="grid w-full max-w-[300px] grid-cols-2 mb-4">
        <TabsTrigger value="kanban" className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" />
          Kanban
        </TabsTrigger>
        <TabsTrigger value="table" className="flex items-center gap-2">
          <TableIcon className="h-4 w-4" />
          Tabla
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="kanban" className="mt-0">
        <KanbanView items={data} onItemClick={onItemClick} />
      </TabsContent>
      
      <TabsContent value="table" className="mt-0">
        <ContentDistributionTable data={data} onRowClick={onItemClick} />
      </TabsContent>
    </Tabs>
  )
}