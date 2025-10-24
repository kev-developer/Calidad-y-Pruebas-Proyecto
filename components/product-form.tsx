"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Swal from "sweetalert2"
import { productosService } from "@/lib/services/productos"
import { Categoria, ProductoCreate, ProductoUpdate, Producto } from "@/lib/models"

interface ProductFormData {
  nombre: string
  descripcion: string
  precio: string
  idCategoria: string
  imagen?: string
}

interface ProductFormProps {
  product?: any
  onClose: () => void
  onProductCreated?: (product: Producto) => void
  onProductUpdated?: (product: Producto) => void
}

export function ProductForm({ product, onClose, onProductCreated, onProductUpdated }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    nombre: "",
    descripcion: "",
    precio: "",
    idCategoria: "",
    imagen: "",
  })

  const [categories, setCategories] = useState<Categoria[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    // Cargar categorías usando el servicio
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        setCategoriesError(null)
        const response = await productosService.getCategorias()
        
        if (response.success && response.data) {
          setCategories(response.data)
        } else {
          setCategoriesError(response.message || "Error al cargar categorías")
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
        imagen: product.imagen || "",
      })
      if (product.imagen) {
        setImagePreview(product.imagen)
      }
    }
  }, [product])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        setFormData((prev) => ({ ...prev, imagen: base64 }))
        setImagePreview(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const productData: ProductoCreate | ProductoUpdate = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number.parseFloat(formData.precio),
        idCategoria: Number.parseInt(formData.idCategoria),
        ...(formData.imagen && { imagen: formData.imagen })
      }

      let response
      if (product) {
        // Actualizar producto existente
        response = await productosService.updateProducto(product.idProducto, productData as ProductoUpdate)
      } else {
        // Crear nuevo producto
        response = await productosService.createProducto(productData as ProductoCreate)
      }

      if (response.success) {
        await Swal.fire({
          title: "¡Éxito!",
          text: product ? "Producto actualizado correctamente" : "Producto creado correctamente",
          icon: "success",
          confirmButtonText: "Aceptar"
        })
        
        // Llamar a los callbacks si existen
        if (product && onProductUpdated && response.data) {
          onProductUpdated(response.data)
        } else if (!product && onProductCreated && response.data) {
          onProductCreated(response.data)
        }
        
        onClose()
      } else {
        await Swal.fire({
          title: "Error",
          text: response.message || "Ha ocurrido un error al guardar el producto",
          icon: "error",
          confirmButtonText: "Aceptar"
        })
      }
    } catch (error) {
      console.error("Error:", error)
      await Swal.fire({
        title: "Error",
        text: "Ha ocurrido un error inesperado",
        icon: "error",
        confirmButtonText: "Aceptar"
      })
    } finally {
      setIsSubmitting(false)
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

          <div className="space-y-2">
            <Label htmlFor="imagen">Imagen del Producto</Label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setImagePreview(null)
                      setFormData(prev => ({ ...prev, imagen: "" }))
                    }}
                  >
                    Eliminar imagen
                  </Button>
                </div>
              )}
              <Input
                id="imagen"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
            </p>
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
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {product ? "Actualizando..." : "Creando..."}
            </>
          ) : (
            product ? "Actualizar Producto" : "Crear Producto"
          )}
        </Button>
      </div>
    </form>
  )
}
