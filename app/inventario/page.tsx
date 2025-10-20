"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, AlertTriangle, Package, Edit, Trash2 } from "lucide-react"
import type { Inventario, Producto, Categoria, ApiResponse, InventarioCreate, Sucursal } from "@/lib/models"
import { inventarioService } from "@/lib/services/inventario"
import { productosService } from "@/lib/services/productos"
import Swal from "sweetalert2"

export default function InventarioPage() {
  const [inventario, setInventario] = useState<Inventario[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStock, setFilterStock] = useState<string>("all")

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Inventario | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    idSucursal: "",
    idProducto: "",
    stock: "",
    stockMinimo: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const [sucursales, setSucursales] = useState<Sucursal[]>([])

  const fetchData = async () => {
    try {
      const [inventarioData, productosData, categoriasData, sucursalesData] = await Promise.all([
        inventarioService.getInventarios(),
        productosService.getProductos(),
        productosService.getCategorias(),
        inventarioService.getSucursales(),
      ])

      if (inventarioData.success && inventarioData.data) {
        setInventario(inventarioData.data)
      } else {
        console.error("Error in inventario response:", inventarioData.message)
      }
      
      if (productosData.success && productosData.data) {
        setProductos(productosData.data)
      } else {
        console.error("Error in productos response:", productosData.message)
      }
      
      if (categoriasData.success && categoriasData.data) {
        setCategorias(categoriasData.data)
      } else {
        console.error("Error in categorias response:", categoriasData.message)
      }

      // Handle both ApiResponse format and direct array response
      let sucursalesArray: Sucursal[] = [];
      
      if (Array.isArray(sucursalesData)) {
        // Direct array response from backend
        sucursalesArray = sucursalesData;
      } else if (sucursalesData.success && sucursalesData.data) {
        // ApiResponse format
        sucursalesArray = sucursalesData.data;
      } else {
        console.error("Error in sucursales response:", sucursalesData.message)
      }
      
      setSucursales(sucursalesArray)
      // Set default sucursal if available
      if (sucursalesArray.length > 0 && !formData.idSucursal) {
        const firstSucursal = sucursalesArray[0];
        setFormData(prev => ({ ...prev, idSucursal: firstSucursal.idSucursal.toString() }))
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInventario = inventario.filter((item) => {
    const matchesSearch = item.producto?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchesCategory = filterCategory === "all" || item.producto?.idCategoria?.toString() === filterCategory
    const matchesStock =
      filterStock === "all" ||
      (filterStock === "low" && item.stock <= item.stockMinimo) ||
      (filterStock === "normal" && item.stock > item.stockMinimo)

    return matchesSearch && matchesCategory && matchesStock
  })

  const getStockStatus = (stock: number, stockMinimo: number) => {
    if (stock === 0) return { label: "Sin Stock", variant: "destructive" as const }
    if (stock <= stockMinimo) return { label: "Stock Bajo", variant: "secondary" as const }
    return { label: "En Stock", variant: "default" as const }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const inventoryData: InventarioCreate = {
        idSucursal: parseInt(formData.idSucursal),
        idProducto: parseInt(formData.idProducto),
        stock: parseInt(formData.stock),
        stockMinimo: parseInt(formData.stockMinimo) || 0,
      }

      let result: ApiResponse<Inventario>
      if (editingItem) {
        // Update existing inventory
        result = await inventarioService.updateInventario(editingItem.idInventario, inventoryData)
      } else {
        // Create new inventory
        result = await inventarioService.createInventario(inventoryData)
      }

      if (result.success) {
        // ✅ CAMBIO IMPORTANTE: Cerrar primero los diálogos ANTES de mostrar SweetAlert
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
        resetForm()
        
        // Mostrar SweetAlert después de cerrar los diálogos
        await Swal.fire({
          title: "¡Éxito!",
          text: editingItem ? "Inventario actualizado correctamente" : "Producto agregado al inventario correctamente",
          icon: "success",
          confirmButtonText: "Aceptar"
        })
        
        // Recargar datos sin refrescar la página completa
        await fetchData()
      } else {
        // ✅ CAMBIO: Cerrar diálogos antes de mostrar error
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
        
        await Swal.fire({
          title: "Error",
          text: result.message || "Ha ocurrido un error al guardar el inventario.",
          icon: "error",
          confirmButtonText: "Aceptar"
        })
        
        // Recargar para limpiar estado
        await fetchData()
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      // ✅ CAMBIO: Cerrar diálogos antes de mostrar error
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
      
      await Swal.fire({
        title: "Error",
        text: "Ha ocurrido un error inesperado al guardar el inventario.",
        icon: "error",
        confirmButtonText: "Aceptar"
      })
      
      await fetchData()
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      idSucursal: sucursales.length > 0 && sucursales[0] ? sucursales[0].idSucursal.toString() : "",
      idProducto: "",
      stock: "",
      stockMinimo: "",
    })
    setEditingItem(null)
  }

  const handleEdit = (item: Inventario) => {
    setEditingItem(item)
    setFormData({
      idSucursal: item.idSucursal.toString(),
      idProducto: item.idProducto.toString(),
      stock: item.stock.toString(),
      stockMinimo: item.stockMinimo.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (item: Inventario) => {
    // ✅ CAMBIO: Usar SweetAlert2 en lugar de window.confirm
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Estás seguro de que deseas eliminar el inventario de ${item.producto?.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      focusCancel: true // ✅ NUEVO: Enfocar el botón de cancelar por seguridad
    })
    
    if (result.isConfirmed) {
      try {
        const result = await inventarioService.deleteInventario(item.idInventario)
        if (result.success) {
          await Swal.fire({
            title: "¡Eliminado!",
            text: "El inventario ha sido eliminado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar"
          })
          // Refresh data after successful deletion
          await fetchData()
        } else {
          await Swal.fire({
            title: "Error",
            text: result.message || "Ha ocurrido un error al eliminar el inventario.",
            icon: "error",
            confirmButtonText: "Aceptar"
          })
        }
      } catch (error) {
        console.error("Error deleting inventario:", error)
        await Swal.fire({
          title: "Error",
          text: "Ha ocurrido un error inesperado al eliminar el inventario.",
          icon: "error",
          confirmButtonText: "Aceptar"
        })
      }
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando inventario...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const lowStockCount = inventario.filter((item) => item.stock <= item.stockMinimo).length
  const outOfStockCount = inventario.filter((item) => item.stock === 0).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-balance">Gestión de Inventario</h2>
            <p className="text-muted-foreground">Administra el stock de tus productos</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar al Inventario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Producto al Inventario</DialogTitle>
                <DialogDescription>Agrega un nuevo producto al inventario de la sucursal.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sucursal">Sucursal</Label>
                    <Select
                      value={formData.idSucursal}
                      onValueChange={(value) => setFormData({ ...formData, idSucursal: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar sucursal" />
                      </SelectTrigger>
                      <SelectContent>
                        {sucursales.map((sucursal) => (
                          <SelectItem key={sucursal.idSucursal} value={sucursal.idSucursal.toString()}>
                            {sucursal.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="producto">Producto</Label>
                    <Select
                      value={formData.idProducto}
                      onValueChange={(value) => setFormData({ ...formData, idProducto: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {productos.map((producto) => (
                          <SelectItem key={producto.idProducto} value={producto.idProducto.toString()}>
                            {producto.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Stock Inicial</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="Cantidad en stock"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                    <Input
                      id="stockMinimo"
                      type="number"
                      value={formData.stockMinimo}
                      onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
                      placeholder="Stock mínimo requerido"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      "Agregar"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventario.length}</div>
              <p className="text-xs text-muted-foreground">En inventario</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground">Requieren reposición</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
              <p className="text-xs text-muted-foreground">Productos agotados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
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
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.idCategoria} value={categoria.idCategoria.toString()}>
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStock} onValueChange={setFilterStock}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Estado de stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="normal">En stock</SelectItem>
                  <SelectItem value="low">Stock bajo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventario</CardTitle>
            <CardDescription>Lista completa de productos en inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Stock Mínimo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventario.length > 0 ? (
                  filteredInventario.map((item) => {
                    const status = getStockStatus(item.stock, item.stockMinimo)
                    return (
                      <TableRow key={item.idInventario}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-medium">{item.producto?.nombre}</p>
                            <p className="text-sm text-muted-foreground">{item.producto?.descripcion}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {categorias.find((c) => c.idCategoria === item.producto?.idCategoria)?.nombre ||
                              "Sin categoría"}
                          </Badge>
                        </TableCell>
                        <TableCell>S/ {item.producto?.precio.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={item.stock <= item.stockMinimo ? "text-orange-600 font-medium" : ""}>
                            {item.stock}
                          </span>
                        </TableCell>
                        <TableCell>{item.stockMinimo}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>{item.sucursal?.nombre}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      {inventario.length === 0 ? "No hay productos en inventario. Agrega algunos usando el botón 'Agregar al Inventario'." : "No se encontraron productos con los filtros aplicados"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Inventario</DialogTitle>
              <DialogDescription>Actualiza la información del inventario.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-sucursal">Sucursal</Label>
                  <Select
                    value={formData.idSucursal}
                    onValueChange={(value) => setFormData({ ...formData, idSucursal: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      {sucursales.map((sucursal) => (
                        <SelectItem key={sucursal.idSucursal} value={sucursal.idSucursal.toString()}>
                          {sucursal.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-producto">Producto</Label>
                  <Select
                    value={formData.idProducto}
                    onValueChange={(value) => setFormData({ ...formData, idProducto: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((producto) => (
                        <SelectItem key={producto.idProducto} value={producto.idProducto.toString()}>
                          {producto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-stock">Stock Actual</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="Cantidad en stock"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-stockMinimo">Stock Mínimo</Label>
                  <Input
                    id="edit-stockMinimo"
                    type="number"
                    value={formData.stockMinimo}
                    onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
                    placeholder="Stock mínimo requerido"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Actualizando...
                    </>
                  ) : (
                    "Actualizar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}