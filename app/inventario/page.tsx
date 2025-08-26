"use client"

import { useState } from "react"
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
import { AlertTriangle, Package, TrendingUp, Plus, Minus, Search, DollarSign } from "lucide-react"
import { StockAdjustmentForm } from "@/components/stock-adjustment-form"
import { BulkPriceUpdateForm } from "@/components/bulk-price-update-form"
import { InventoryMovements } from "@/components/inventory-movements"

// Mock data for inventory
const mockInventory = [
  {
    id: 1,
    name: "Cuaderno Universitario 100 hojas",
    sku: "CU-100-001",
    category: "Escolares",
    currentStock: 15,
    minStock: 20,
    maxStock: 200,
    costPrice: 2.5,
    salePrice: 4.0,
    totalValue: 37.5,
    lastMovement: "2024-01-15",
    status: "low_stock",
  },
  {
    id: 2,
    name: "Bolígrafo BIC Azul",
    sku: "BOL-BIC-001",
    category: "Útiles",
    currentStock: 300,
    minStock: 50,
    maxStock: 500,
    costPrice: 0.8,
    salePrice: 1.5,
    totalValue: 240.0,
    lastMovement: "2024-01-16",
    status: "normal",
  },
  {
    id: 3,
    name: "Cien Años de Soledad",
    sku: "LIB-CAS-001",
    category: "Libros",
    currentStock: 5,
    minStock: 5,
    maxStock: 50,
    costPrice: 15.0,
    salePrice: 25.0,
    totalValue: 75.0,
    lastMovement: "2024-01-14",
    status: "critical",
  },
  {
    id: 4,
    name: "Kit Escolar Básico",
    sku: "KIT-ESC-001",
    category: "Combos",
    currentStock: 45,
    minStock: 10,
    maxStock: 100,
    costPrice: 12.0,
    salePrice: 20.0,
    totalValue: 540.0,
    lastMovement: "2024-01-16",
    status: "normal",
  },
]

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
  const [inventory, setInventory] = useState(mockInventory)
  const [alerts, setAlerts] = useState(mockAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isAdjustmentFormOpen, setIsAdjustmentFormOpen] = useState(false)
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "low_stock" && item.status === "low_stock") ||
      (selectedFilter === "critical" && item.status === "critical") ||
      (selectedFilter === "normal" && item.status === "normal")

    return matchesSearch && matchesFilter
  })

  const getStockStatusBadge = (status) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Crítico</Badge>
      case "low_stock":
        return <Badge variant="secondary">Stock Bajo</Badge>
      case "normal":
        return <Badge variant="default">Normal</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getAlertIcon = (priority) => {
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

  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = inventory.filter((item) => item.status === "low_stock" || item.status === "critical").length
  const totalProducts = inventory.length

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
                        {filteredInventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{item.currentStock}</span>
                                {item.currentStock <= item.minStock && (
                                  <AlertTriangle className="h-4 w-4 text-destructive" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {item.minStock} / {item.maxStock}
                              </span>
                            </TableCell>
                            <TableCell>${item.costPrice.toFixed(2)}</TableCell>
                            <TableCell>${item.totalValue.toFixed(2)}</TableCell>
                            <TableCell>{getStockStatusBadge(item.status)}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedProduct(item)
                                    setIsAdjustmentFormOpen(true)
                                  }}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedProduct(item)
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
