"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Percent, Calculator } from "lucide-react"

interface BulkPriceUpdateFormProps {
  onClose: () => void
}

const mockProducts = [
  {
    id: 1,
    name: "Cuaderno Universitario 100 hojas",
    category: "Escolares",
    currentCost: 2.5,
    currentSale: 4.0,
    selected: false,
  },
  {
    id: 2,
    name: "Bolígrafo BIC Azul",
    category: "Útiles",
    currentCost: 0.8,
    currentSale: 1.5,
    selected: false,
  },
  {
    id: 3,
    name: "Cien Años de Soledad",
    category: "Libros",
    currentCost: 15.0,
    currentSale: 25.0,
    selected: false,
  },
  {
    id: 4,
    name: "Kit Escolar Básico",
    category: "Combos",
    currentCost: 12.0,
    currentSale: 20.0,
    selected: false,
  },
]

export function BulkPriceUpdateForm({ onClose }: BulkPriceUpdateFormProps) {
  const [products, setProducts] = useState(mockProducts)
  const [updateType, setUpdateType] = useState("percentage")
  const [priceType, setPriceType] = useState("sale")
  const [value, setValue] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const categories = ["all", "Escolares", "Útiles", "Libros", "Combos"]

  const handleProductToggle = (productId: number) => {
    setProducts(
      products.map((product) => (product.id === productId ? { ...product, selected: !product.selected } : product)),
    )
  }

  const handleSelectAll = () => {
    const filteredProducts = getFilteredProducts()
    const allSelected = filteredProducts.every((p) => p.selected)
    setProducts(
      products.map((product) => {
        if (filterCategory === "all" || product.category === filterCategory) {
          return { ...product, selected: !allSelected }
        }
        return product
      }),
    )
  }

  const getFilteredProducts = () => {
    return products.filter((product) => filterCategory === "all" || product.category === filterCategory)
  }

  const calculateNewPrice = (currentPrice: number) => {
    if (!value) return currentPrice

    const numValue = Number.parseFloat(value)
    if (updateType === "percentage") {
      return currentPrice * (1 + numValue / 100)
    } else {
      return currentPrice + numValue
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedProducts = products.filter((p) => p.selected)
    console.log("Bulk price update:", {
      products: selectedProducts,
      updateType,
      priceType,
      value: Number.parseFloat(value),
    })
    onClose()
  }

  const selectedCount = products.filter((p) => p.selected).length
  const filteredProducts = getFilteredProducts()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Configuración de Actualización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceType">Tipo de Precio *</Label>
                <Select value={priceType} onValueChange={setPriceType} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cost">Precio de Costo</SelectItem>
                    <SelectItem value="sale">Precio de Venta</SelectItem>
                    <SelectItem value="both">Ambos Precios</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="updateType">Método de Actualización *</Label>
                <Select value={updateType} onValueChange={setUpdateType} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Porcentaje
                      </div>
                    </SelectItem>
                    <SelectItem value="fixed">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Valor Fijo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">
                {updateType === "percentage" ? "Porcentaje de Cambio" : "Valor a Agregar"} *
              </Label>
              <div className="relative">
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={updateType === "percentage" ? "10" : "1.50"}
                  required
                />
                <div className="absolute right-3 top-2.5 text-muted-foreground">
                  {updateType === "percentage" ? "%" : "$"}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {updateType === "percentage"
                  ? "Ejemplo: 10 = aumentar 10%, -5 = reducir 5%"
                  : "Ejemplo: 1.50 = agregar $1.50, -0.50 = reducir $0.50"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selección de Productos</CardTitle>
            <CardDescription>
              {selectedCount} de {products.length} productos seleccionados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" variant="outline" onClick={handleSelectAll}>
                {filteredProducts.every((p) => p.selected) ? "Deseleccionar Todo" : "Seleccionar Todo"}
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredProducts.length > 0 && filteredProducts.every((p) => p.selected)}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio Actual</TableHead>
                  <TableHead>Nuevo Precio</TableHead>
                  <TableHead>Cambio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const currentPrice = priceType === "cost" ? product.currentCost : product.currentSale
                  const newPrice = calculateNewPrice(currentPrice)
                  const change = newPrice - currentPrice

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox checked={product.selected} onCheckedChange={() => handleProductToggle(product.id)} />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>${currentPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={product.selected ? "font-semibold text-accent" : ""}>
                          ${newPrice.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`${change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : ""}`}>
                          {change > 0 ? "+" : ""}${change.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedCount > 0 && (
          <Card className="border-accent">
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Cambios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Productos a actualizar:</span>
                  <span className="font-medium">{selectedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipo de precio:</span>
                  <span className="font-medium">
                    {priceType === "cost" ? "Costo" : priceType === "sale" ? "Venta" : "Ambos"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Método:</span>
                  <span className="font-medium">{updateType === "percentage" ? `${value}%` : `$${value}`}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={selectedCount === 0}>
          Actualizar Precios ({selectedCount})
        </Button>
      </div>
    </form>
  )
}
