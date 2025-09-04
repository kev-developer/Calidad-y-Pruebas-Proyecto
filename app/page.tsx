import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Users, ShoppingCart, Truck, BarChart3, TrendingUp, AlertTriangle, DollarSign } from "lucide-react"


export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground">Dashboard Principal</h2>
              <p className="text-muted-foreground">Resumen general de tu papelería</p>

              {/* Botón a Catálogo Público */}
              <div className="mt-4">
                <Button asChild variant="secondary">
                  <Link href="/catalogo">Ver catálogo público</Link>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,350</div>
                  <p className="text-xs text-muted-foreground">+12% desde ayer</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Productos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+5 nuevos esta semana</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">456</div>
                  <p className="text-xs text-muted-foreground">+8 nuevos este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">23</div>
                  <p className="text-xs text-muted-foreground">Productos requieren reposición</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-accent" />
                    Gestión de Productos
                  </CardTitle>
                  <CardDescription>Administra tu inventario, categorías y precios</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Ir a Productos</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-accent" />
                    Punto de Venta
                  </CardTitle>
                  <CardDescription>Procesa ventas y genera comprobantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Nueva Venta</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Clientes
                  </CardTitle>
                  <CardDescription>Gestiona clientes y programas de fidelización</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Ver Clientes</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-accent" />
                    Proveedores
                  </CardTitle>
                  <CardDescription>Administra proveedores y pedidos de compra</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Gestionar Proveedores</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Reportes
                  </CardTitle>
                  <CardDescription>Analiza ventas, inventario y rendimiento</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Ver Reportes</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Análisis
                  </CardTitle>
                  <CardDescription>Insights y tendencias de tu negocio</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Ver Análisis</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-accent" />
                    Catálogo Público
                  </CardTitle>
                  <CardDescription>Landing catálogo</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/catalogo">Ver Catálogo</Link>
                  </Button>
                </CardContent>
              </Card>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
