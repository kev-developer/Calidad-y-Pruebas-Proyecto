"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Package, Tag } from "lucide-react"
import { ProductForm } from "@/components/product-form"
import { CategoryManager } from "@/components/category-manager"

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "Cuaderno Universitario 100 hojas",
    category: "Escolares",
    brand: "Norma",
    author: "",
    publisher: "",
    sku: "CU-100-001",
    costPrice: 2.5,
    salePrice: 4.0,
    stock: 150,
    minStock: 20,
    status: "active",
  },
  {
    id: 2,
    name: "Bolígrafo BIC Azul",
    category: "Útiles",
    brand: "BIC",
    author: "",
    publisher: "",
    sku: "BOL-BIC-001",
    costPrice: 0.8,
    salePrice: 1.5,
    stock: 300,
    minStock: 50,
    status: "active",
  },
  {
    id: 3,
    name: "Cien Años de Soledad",
    category: "Libros",
    brand: "",
    author: "Gabriel García Márquez",
    publisher: "Editorial Sudamericana",
    sku: "LIB-CAS-001",
    costPrice: 15.0,
    salePrice: 25.0,
    stock: 25,
    minStock: 5,
    status: "active",
  },
  {
    id: 4,
    name: "Kit Escolar Básico",
    category: "Combos",
    brand: "Varios",
    author: "",
    publisher: "",
    sku: "KIT-ESC-001",
    costPrice: 12.0,
    salePrice: 20.0,
    stock: 45,
    minStock: 10,
    status: "active",
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isProductFormOpen, setIsProductFormOpen] = useState(false)
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const categories = ["Todos", "Escolares", "Útiles", "Libros", "Arte", "Oficina", "Combos"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleEditProduct = (product:any) => {
    setEditingProduct(product)
    setIsProductFormOpen(true)
  }

  const handleDeleteProduct = (productId:any) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  const getStockStatus = (stock:any, minStock:any) => {
    if (stock <= minStock) return { label: "Stock Bajo", variant: "destructive" }
    if (stock <= minStock * 2) return { label: "Stock Medio", variant: "secondary" }
    return { label: "Stock Alto", variant: "default" }
  }

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
                  <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
                  <Package className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {products.filter((p) => p.stock <= p.minStock).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${products.reduce((sum, p) => sum + p.costPrice * p.stock, 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categorías</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Set(products.map((p) => p.category)).size}</div>
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
                      {categories.slice(1).map((category) => (
                        <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                          {category}
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
                      <TableHead>SKU</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Marca/Autor</TableHead>
                      <TableHead>Precio Costo</TableHead>
                      <TableHead>Precio Venta</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock, product.minStock)
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>{product.brand || product.author || "-"}</TableCell>
                          <TableCell>${product.costPrice.toFixed(2)}</TableCell>
                          <TableCell>${product.salePrice.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{product.stock}</span>
                              <Badge variant={stockStatus.variant as any} className="text-xs">
                                {stockStatus.label}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.status === "active" ? "default" : "secondary"}>
                              {product.status === "active" ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
