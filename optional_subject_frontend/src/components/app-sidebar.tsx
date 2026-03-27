"use client"

import { 
  UserPen, Home, School, Search, Settings, NotebookPen, User, LogOut, ChevronDown,
  Menu, ChevronLeft, ChevronRight, PanelLeft, ClipboardType
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

// Menu items.
const items = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Asignaturas",
    url: "/subjects",
    icon: School,
  },
  {
    title: "Profesores",
    url: "/teachers",
    icon: UserPen,
  },
  {
    title: "Plan de estudio",
    url: "/study-plan",
    icon: Search,
  },
  {
    title: "Solicitudes",
    url: "/requests",
    icon: NotebookPen,
  },
  {
    title: "Inscripciones",
    url: "/enrollments",
    icon: ClipboardType,
  },
  {
    title: "Configuraciones",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { state } = useSidebar()
  
  const isCollapsed = state === "collapsed"

  const getInitials = (name: string) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <>
      {/* Trigger para móvil - siempre visible */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <SidebarTrigger className="bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </div>

      <Sidebar 
        collapsible="icon" 
        className="bg-gradient-to-b from-cyan-900 to-blue-900 border-r-0"
      >
        {/* Header del sidebar con título y botón de collapse */}
        <SidebarHeader className="p-4 border-b border-white/20 flex items-center justify-between">
          {!isCollapsed ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-white hover:bg-white/10 h-8 w-8"
                asChild
              >
                <SidebarTrigger>
                  <ChevronLeft className="h-4 w-4" />
                </SidebarTrigger>
              </Button>
            </>
          ) : (
            <div className="flex justify-center w-full">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 h-8 w-8"
                asChild
              >
                <SidebarTrigger>
                  <ChevronRight className="h-4 w-4" />
                </SidebarTrigger>
              </Button>
            </div>
          )}
        </SidebarHeader>

        <SidebarContent>
          {/* Logo/Título expandido */}
          {!isCollapsed && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-white flex items-center justify-center text-center py-6">
                <div className="flex flex-col items-center">
                  <div className="text-lg font-bold">Sistema de Gestión</div>
                  <div className="text-sm text-white/80">Asignaturas Optativas</div>
                </div>
              </SidebarGroupLabel>
            </SidebarGroup>
          )}

          {/* Separador */}
          {!isCollapsed && (
            <div className="px-4">
              <div className="h-px bg-white/20 w-full"></div>
            </div>
          )}

          {/* Menú principal */}
          <SidebarGroup className="mt-4">
            <SidebarGroupContent>
              <SidebarMenu className="text-white">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={isCollapsed ? item.title : undefined}
                      className="hover:bg-white/10"
                    >
                      <a 
                        href={item.url}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors"
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <span className="text-sm font-medium">{item.title}</span>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Espacio flexible */}
          <div className="flex-1" />
        </SidebarContent>

        {/* Footer con información del usuario */}
        <SidebarFooter className="border-t border-white/20 p-4 items">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between hover:bg-white/10 text-white p-2"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src="" alt={user.name || "Usuario"} />
                      <AvatarFallback className="bg-cyan-600 text-white">
                        {getInitials(user.name || "Usuario")}
                      </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-sm font-medium truncate">
                          {user.name || "Usuario"}
                        </span>
                        <span className="text-xs text-white/70 truncate">
                          {user.email || "usuario@ejemplo.com"}
                        </span>
                      </div>
                    )}
                  </div>
                  {!isCollapsed && <ChevronDown className="h-4 w-4 flex-shrink-0" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || "Usuario"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email || "usuario@ejemplo.com"}
                    </p>
                    {user.role && (
                      <p className="text-xs leading-none text-cyan-600 font-medium">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !isCollapsed ? (
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleLogin}
                className="w-full bg-white text-cyan-900 hover:bg-white/90"
              >
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => router.push("/register")}
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10"
              >
                Registrarse
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button 
                onClick={handleLogin}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                title="Iniciar Sesión"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          )}
        </SidebarFooter>

        {/* Rail para indicar que se puede hacer hover */}
        <SidebarRail />
      </Sidebar>
    </>
  )
}