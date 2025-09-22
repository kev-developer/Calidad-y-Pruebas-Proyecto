"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Filter, Edit, Trash2, Package, Tag, AlertCircle } from "lucide-react"
import { ProductForm } from "@/components/product-form"
import { CategoryManager } from "@/components/category-manager"
import { productosService } from "@/lib/services/productos"
import { Producto, Categoria } from "@/lib/models"

export default function ProductsPage() {
  const [products, setProducts] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isProductFormOpen, setIsProductFormOpen] = useState(false)
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [productosResponse, categoriasResponse] = await Promise.all([
          productosService.getProductos(),
          productosService.getCategorias()
        ])

        if (productosResponse.success && productosResponse.data) {
          setProducts(productosResponse.data)
        } else {
          throw new Error(productosResponse.message || 'Error al cargar productos')
        }

        if (categoriasResponse.success && categoriasResponse.data) {
          setCategorias(categoriasResponse.data)
        } else {
          throw new Error(categoriasResponse.message || 'Error al cargar categorías')
        }

      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar datos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.descripcion && product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" ||
      (product.categoria && product.categoria.nombre === selectedCategory)
    
    return matchesSearch && matchesCategory
  })

  const handleEditProduct = (product: Producto) => {
    setEditingProduct(product)
    setIsProductFormOpen(true)
  }

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await productosService.deleteProducto(productId)
      if (response.success) {
        setProducts(products.filter((p) => p.idProducto !== productId))
      } else {
        throw new Error(response.message || 'Error al eliminar producto')
      }
    } catch (err) {
      console.error('Error deleting product:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido al eliminar producto')
    }
  }

  const handleProductCreated = (newProduct: Producto) => {
    setProducts(prev => [...prev, newProduct])
  }

  const handleProductUpdated = (updatedProduct: Producto) => {
    setProducts(prev => prev.map(p =>
      p.idProducto === updatedProduct.idProducto ? updatedProduct : p
    ))
  }

  const getStockStatus = () => {
    // Función placeholder ya que el modelo Producto no incluye información de inventario
    return { label: "Info no disponible", variant: "secondary" }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando productos...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Error al cargar productos</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-serif font-bold text-foreground">Gestión de Productos</h2>
                <p className="text-muted-foreground">Administra tu catálogo de productos</p>
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
                    <CategoryManager products={products} />
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
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categorías</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categorias.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gestión</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Datos en tiempo real</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Categoría: {selectedCategory === "all" ? "Todas" : selectedCategory}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                        Todas las categorías
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {categorias.map((categoria) => (
                        <DropdownMenuItem key={categoria.idCategoria} onClick={() => setSelectedCategory(categoria.nombre)}>
                          {categoria.nombre}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Productos</CardTitle>
                <CardDescription>{filteredProducts.length} productos encontrados</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      // Obtener el nombre de la categoría del producto
                      const categoriaNombre = product.categoria?.nombre ||
                        (product.idCategoria ?
                          categorias.find(cat => cat.idCategoria === product.idCategoria)?.nombre :
                          'Sin categoría')
                      
                      return (
                        <TableRow key={product.idProducto}>
                          <TableCell className="font-medium">{product.nombre}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {categoriaNombre}
                            </Badge>
                          </TableCell>
                          <TableCell>{product.descripcion || "-"}</TableCell>
                          <TableCell>${product.precio?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.idProducto)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
      </div>
    </DashboardLayout>
  )
}
