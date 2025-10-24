"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, Package, Users, Truck, ShoppingCart, Menu, Home, Settings, LogOut, FileText, Tags } from "lucide-react"
import { authService } from "@/lib/services/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { bytesToImageUrl } from "@/lib/utils"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Inventario",
    href: "/inventario",
    icon: Package,
  },
  {
    name: "Clientes",
    href: "/clientes",
    icon: Users,
  },
  {
    name: "Proveedores",
    href: "/proveedores",
    icon: Truck,
  },
  {
    name: "Ventas",
    href: "/ventas",
    icon: ShoppingCart,
  },
  {
    name: "Reportes",
    href: "/reportes",
    icon: FileText,
  },
  {
    name: "Productos",
    href: "/productos",
    icon: Tags,
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = authService.getStoredUser()
      setUser(storedUser)
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    authService.logout()
    router.push('/catalogo')
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex h-full flex-col", mobile ? "w-full" : "w-64")}>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border bg-sidebar px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <ShoppingCart className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">Papelería</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 bg-sidebar p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border bg-sidebar p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.foto_perfil ? bytesToImageUrl(user.foto_perfil) || undefined : undefined}
              alt={user?.nombre || 'Usuario'}
            />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm">
              {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground">{user?.nombre || 'Usuario'}</p>
            <p className="text-xs text-sidebar-foreground/60">
              {user?.idRol === 2 ? 'Cliente' : user?.idRol === 1 ? 'Administrador' : 'Usuario'}
            </p>
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => router.push('/perfil')}
          >
            <Settings className="h-4 w-4" />
            Configuración
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col border-r border-sidebar-border">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <Sidebar mobile />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold text-card-foreground">
              {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
