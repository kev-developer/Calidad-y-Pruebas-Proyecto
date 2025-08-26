"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface ProductFormProps {
  product?: any
  onClose: () => void
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState<{
    name: string,
    description: string,
    category: string,
    brand: string,
    author: string,
    publisher: string,
    sku: string,
    costPrice: string,
    salePrice: string,
    stock: string,
    minStock: string,
    status: string,
    isCombo: boolean,
    comboProducts: { id: number; name: string; quantity: number; }[],
    tags: string[],
    
  }>({
    name: "",
    description: "",
    category: "",
    brand: "",
    author: "",
    publisher: "",
    sku: "",
    costPrice: "",
    salePrice: "",
    stock: "",
    minStock: "",
    status: "active",
    isCombo: false,
    comboProducts: [],
    tags: [""],
  })

  const [newTag, setNewTag] = useState("")
  const [comboProduct, setComboProduct] = useState({ productId: "", quantity: 1 })

  const categories = ["Escolares", "Útiles", "Libros", "Arte", "Oficina", "Combos"]
  const mockProducts = [
    { id: 1, name: "Cuaderno Universitario" },
    { id: 2, name: "Bolígrafo BIC" },
    { id: 3, name: "Lápiz HB" },
  ]

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        brand: product.brand || "",
        author: product.author || "",
        publisher: product.publisher || "",
        sku: product.sku || "",
        costPrice: product.costPrice?.toString() || "",
        salePrice: product.salePrice?.toString() || "",
        stock: product.stock?.toString() || "",
        minStock: product.minStock?.toString() || "",
        status: product.status || "active",
        isCombo: product.isCombo || false,
        comboProducts: product.comboProducts || [],
        tags: product.tags || [],
      })
    }
  }, [product])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleAddComboProduct = () => {
    if (comboProduct.productId && comboProduct.quantity > 0) {
      const product = mockProducts.find((p) => p.id.toString() === comboProduct.productId)
      if (product) {
        setFormData((prev) => ({
          ...prev,
          comboProducts: [
            ...prev.comboProducts,
            {
              id: product.id,
              name: product.name,
              quantity: comboProduct.quantity,
            },
          ],
        }))
        setComboProduct({ productId: "", quantity: 1 })
      }
    }
  }

  const handleRemoveComboProduct = (productId: number) => {
    setFormData((prev) => ({
      ...prev,
      comboProducts: prev.comboProducts.filter((p) => p.id !== productId),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the product data
    console.log("Product data:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="pricing">Precios</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="combo">Combo</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ej: Cuaderno Universitario 100 hojas"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Ej: CU-100-001"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descripción detallada del producto"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    placeholder="Ej: Norma, BIC"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                    placeholder="Para libros"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publisher">Editorial</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) => handleInputChange("publisher", e.target.value)}
                    placeholder="Para libros"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Etiquetas</Label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nueva etiqueta"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Precios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Precio de Costo *</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => handleInputChange("costPrice", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Precio de Venta *</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => handleInputChange("salePrice", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {formData.costPrice && formData.salePrice && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Margen de Ganancia</div>
                  <div className="text-lg font-semibold">
                    ${(Number.parseFloat(formData.salePrice) - Number.parseFloat(formData.costPrice)).toFixed(2)}(
                    {(
                      ((Number.parseFloat(formData.salePrice) - Number.parseFloat(formData.costPrice)) /
                        Number.parseFloat(formData.costPrice)) *
                      100
                    ).toFixed(1)}
                    %)
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Control de Inventario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Actual *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Stock Mínimo *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => handleInputChange("minStock", e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="combo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Combo</CardTitle>
              <CardDescription>Configura este producto como un combo o paquete de productos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isCombo"
                  checked={formData.isCombo}
                  onCheckedChange={(checked) => handleInputChange("isCombo", checked)}
                />
                <Label htmlFor="isCombo">Este es un producto combo</Label>
              </div>

              {formData.isCombo && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Productos del Combo</Label>
                    {formData.comboProducts.length > 0 && (
                      <div className="space-y-2">
                        {formData.comboProducts.map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                            <span>
                              {product.name} x {product.quantity}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveComboProduct(product.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={comboProduct.productId}
                      onValueChange={(value) => setComboProduct((prev) => ({ ...prev, productId: value }))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="1"
                      value={comboProduct.quantity}
                      onChange={(e) =>
                        setComboProduct((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))
                      }
                      className="w-20"
                    />
                    <Button type="button" onClick={handleAddComboProduct}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">{product ? "Actualizar" : "Crear"} Producto</Button>
      </div>
    </form>
  )
}
