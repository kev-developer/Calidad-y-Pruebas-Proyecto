"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Package, TrendingUp, Plus, Minus, Search, DollarSign, Tag } from "lucide-react"
import { StockAdjustmentForm } from "@/components/stock-adjustment-form"
import { BulkPriceUpdateForm } from "@/components/bulk-price-update-form"
import { InventoryMovements } from "@/components/inventory-movements"
import { ProductoGet } from '@/lib/models'
import { CategoryManager } from "@/components/category-manager"
import { ProductForm } from "@/components/product-form"

const mockAlerts = [
  {
    id: 1,
    type: "low_stock",
    product: "Cuaderno Universitario 100 hojas",
    message: "Stock por debajo del mínimo (15/20)",
    priority: "medium",
    date: "2024-01-16",
  },
  {
    id: 2,
    type: "critical_stock",
    product: "Cien Años de Soledad",
    message: "Stock crítico (5/5)",
    priority: "high",
    date: "2024-01-16",
  },
  {
    id: 3,
    type: "overstock",
    product: "Bolígrafo BIC Azul",
    message: "Stock alto, considerar reducir pedidos",
    priority: "low",
    date: "2024-01-15",
  },
]

export default function InventoryPage() {
  const [inventory, setInventory] = useState([])
  const [alerts, setAlerts] = useState(mockAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isAdjustmentFormOpen, setIsAdjustmentFormOpen] = useState(false)
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const [isProductFormOpen, setIsProductFormOpen] = useState(false)
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const filteredInventory = inventory.filter((item:ProductoGet) => {
    const matchesSearch =
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Id_producto.toString().toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "low_stock" && item.stock < 5) ||
      (selectedFilter === "critical" && item.stock < 50) ||
      (selectedFilter === "normal" && item.stock < 500)

    return matchesSearch && matchesFilter
  })

  const getStockStatusBadge = (activo:boolean) => {
    if(activo){
      return <Badge variant="default">Normal</Badge>
    }else{

      return <Badge variant="destructive">Crítico</Badge>
    }
  }

  const getAlertIcon = (priority:any) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "low":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const totalInventoryValue = inventory.reduce((sum, item:ProductoGet) => sum + item.precio, 0)
  const lowStockItems = inventory.filter((item:ProductoGet) => item.stock < 5 || item.stock < 50).length
  const totalProducts = inventory.length

  useEffect(() => {
    let mounted=true;
    fetch("http://localhost:8000/productos/")
      .then((r) => r.json())
      .then((data) => {
        setInventory(data)
      })
      .catch(console.error)
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])
  

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground">Control de Inventario</h2>
                <p className="text-muted-foreground">Gestiona el stock y movimientos de inventario</p>
              </div>
              <div className="flex gap-2">
                <Dialog open={isCategoryManagerOpen} onOpenChange={setIsCategoryManagerOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Tag className="h-4 w-4 mr-2" />
                      Categorías
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Gestión de Categorías</DialogTitle>
                      <DialogDescription>Administra las categorías de productos</DialogDescription>
                    </DialogHeader>
                    <CategoryManager />
                  </DialogContent>
                </Dialog>

                <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                      <DialogDescription>
                        {editingProduct ? "Modifica los datos del producto" : "Agrega un nuevo producto al catálogo"}
                      </DialogDescription>
                    </DialogHeader>
                    <ProductForm
                      product={editingProduct}
                      onClose={() => {
                        setIsProductFormOpen(false)
                        setEditingProduct(null)
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex gap-2">
                <Dialog open={isBulkUpdateOpen} onOpenChange={setIsBulkUpdateOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Actualizar Precios
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Actualización Masiva de Precios</DialogTitle>
                      <DialogDescription>Actualiza precios de múltiples productos</DialogDescription>
                    </DialogHeader>
                    <BulkPriceUpdateForm onClose={() => setIsBulkUpdateOpen(false)} />
                  </DialogContent>
                </Dialog>

                <Dialog open={isAdjustmentFormOpen} onOpenChange={setIsAdjustmentFormOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Package className="h-4 w-4 mr-2" />
                      Ajustar Stock
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Ajuste de Inventario</DialogTitle>
                      <DialogDescription>Realiza ajustes manuales al inventario</DialogDescription>
                    </DialogHeader>
                    <StockAdjustmentForm
                      product={selectedProduct}
                      onClose={() => {
                        setIsAdjustmentFormOpen(false)
                        setSelectedProduct(null)
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Total Inventario</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Costo de inventario actual</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                  <p className="text-xs text-muted-foreground">Productos en inventario</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alertas de Stock</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{lowStockItems}</div>
                  <p className="text-xs text-muted-foreground">Productos requieren atención</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Movimientos Hoy</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">Entradas y salidas</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="inventory" className="space-y-4">
              <TabsList>
                <TabsTrigger value="inventory">Inventario</TabsTrigger>
                <TabsTrigger value="alerts">Alertas</TabsTrigger>
                <TabsTrigger value="movements">Movimientos</TabsTrigger>
              </TabsList>

              <TabsContent value="inventory" className="space-y-4">
                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={selectedFilter === "all" ? "default" : "outline"}
                          onClick={() => setSelectedFilter("all")}
                        >
                          Todos
                        </Button>
                        <Button
                          variant={selectedFilter === "critical" ? "default" : "outline"}
                          onClick={() => setSelectedFilter("critical")}
                        >
                          Crítico
                        </Button>
                        <Button
                          variant={selectedFilter === "low_stock" ? "default" : "outline"}
                          onClick={() => setSelectedFilter("low_stock")}
                        >
                          Stock Bajo
                        </Button>
                        <Button
                          variant={selectedFilter === "normal" ? "default" : "outline"}
                          onClick={() => setSelectedFilter("normal")}
                        >
                          Normal
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Inventory Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estado del Inventario</CardTitle>
                    <CardDescription>{filteredInventory.length} productos encontrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead>Stock Actual</TableHead>
                          <TableHead>Stock Mín/Máx</TableHead>
                          <TableHead>Precio Costo</TableHead>
                          <TableHead>Valor Total</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInventory.map((item:ProductoGet) => (
                          <TableRow key={item.Id_producto}>
                            <TableCell className="font-medium">{item.nombre}</TableCell>
                            <TableCell>{item.Id_producto}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.id_marca}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{item.stock}</span>
                                {item.stock <= 50 && (
                                  <AlertTriangle className="h-4 w-4 text-destructive" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {item.stock} / {item.stock * 23}
                              </span>
                            </TableCell>
                            <TableCell>${item.precio.toFixed(2)}</TableCell>
                            <TableCell>${item.precio.toFixed(4)}</TableCell>
                            <TableCell>{getStockStatusBadge(item.activo)}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedProduct(item as any)
                                    setIsAdjustmentFormOpen(true)
                                  }}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedProduct(item as any)
                                    setIsAdjustmentFormOpen(true)
                                  }}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Alertas de Inventario</CardTitle>
                    <CardDescription>Notificaciones importantes sobre el stock</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getAlertIcon(alert.priority)}
                            <div>
                              <div className="font-medium">{alert.product}</div>
                              <div className="text-sm text-muted-foreground">{alert.message}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                alert.priority === "high"
                                  ? "destructive"
                                  : alert.priority === "medium"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {alert.priority === "high" ? "Alta" : alert.priority === "medium" ? "Media" : "Baja"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{alert.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="movements" className="space-y-4">
                <InventoryMovements />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
