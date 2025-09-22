"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Tag, AlertCircle } from "lucide-react"
import { productosService } from "@/lib/services/productos"
import { Categoria } from "@/lib/models"

interface CategoryManagerProps {
  products: any[]
}

export function CategoryManager({ products }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ nombre: "" })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await productosService.getCategorias()
        if (response.success && response.data) {
          setCategories(response.data)
        } else {
          throw new Error(response.message || 'Error al cargar categorías')
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar categorías')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleAddCategory = async () => {
    if (newCategory.nombre.trim()) {
      try {
        setError(null)
        const response = await productosService.createCategoria(newCategory)
        if (response.success && response.data) {
          const newCat = response.data
          setCategories(prev => [...prev, newCat])
          setNewCategory({ nombre: "" })
        } else {
          throw new Error(response.message || 'Error al crear categoría')
        }
      } catch (err) {
        console.error('Error creating category:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido al crear categoría')
      }
    }
  }

  const handleDeleteCategory = async (id: number) => {
    try {
      setError(null)
      const response = await productosService.deleteCategoria(id)
      if (response.success) {
        setCategories(prev => prev.filter(cat => cat.idCategoria !== id))
      } else {
        throw new Error(response.message || 'Error al eliminar categoría')
      }
    } catch (err) {
      console.error('Error deleting category:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido al eliminar categoría')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando categorías...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Error al cargar categorías</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categorías
          </CardTitle>
          <CardDescription>Gestiona las categorías de productos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Nombre de la categoría"
                value={newCategory.nombre}
                onChange={(e) => setNewCategory({ nombre: e.target.value })}
              />
            </div>
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                 <TableHead>Productos</TableHead>
                 <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.idCategoria}>
                  <TableCell className="font-medium">{category.nombre}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {products.filter(product => product.idCategoria === category.idCategoria).length}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.idCategoria)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  )
}
