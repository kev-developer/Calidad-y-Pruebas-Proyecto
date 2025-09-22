"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductFormData {
  nombre: string
  descripcion: string
  precio: string
  idCategoria: string
}

interface ProductFormProps {
  product?: any
  onClose: () => void
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    nombre: "",
    descripcion: "",
    precio: "",
    idCategoria: "",
  })

  const [categories, setCategories] = useState<{ idCategoria: number; nombre: string }[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  useEffect(() => {
    // Cargar categorías desde el backend
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        setCategoriesError(null)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/productos/categorias/`)
        
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        } else {
          setCategoriesError("Error al cargar categorías")
          console.error("Error en respuesta:", response.status)
        }
      } catch (error) {
        setCategoriesError("Error de conexión al cargar categorías")
        console.error("Error cargando categorías:", error)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre || "",
        descripcion: product.descripcion || "",
        precio: product.precio?.toString() || "",
        idCategoria: product.idCategoria?.toString() || "",
      })
    }
  }, [product])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const productData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number.parseFloat(formData.precio),
        idCategoria: Number.parseInt(formData.idCategoria),
      }

      const url = product
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/productos/${product.id}/`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/productos/`
      
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        onClose()
        // Recargar la página o actualizar la lista de productos
        window.location.reload()
      } else {
        console.error("Error al guardar el producto")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{product ? "Editar" : "Nuevo"} Producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Producto *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              placeholder="Ej: Cuaderno Universitario 100 hojas"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              placeholder="Descripción detallada del producto"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idCategoria">Categoría *</Label>
              <Select
                value={formData.idCategoria}
                onValueChange={(value) => handleInputChange("idCategoria", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCategories ? (
                    <SelectItem value="loading" disabled>
                      Cargando categorías...
                    </SelectItem>
                  ) : categoriesError ? (
                    <SelectItem value="error" disabled>
                      Error al cargar categorías
                    </SelectItem>
                  ) : categories.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No hay categorías disponibles
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.idCategoria} value={category.idCategoria.toString()}>
                        {category.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio *</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={(e) => handleInputChange("precio", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">{product ? "Actualizar" : "Crear"} Producto</Button>
      </div>
    </form>
  )
}
