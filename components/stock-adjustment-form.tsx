"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Package } from "lucide-react"

interface StockAdjustmentFormProps {
  product?: any
  onClose: () => void
}

const mockProducts = [
  { id: 1, name: "Cuaderno Universitario 100 hojas", sku: "CU-100-001", currentStock: 15 },
  { id: 2, name: "Bolígrafo BIC Azul", sku: "BOL-BIC-001", currentStock: 300 },
  { id: 3, name: "Cien Años de Soledad", sku: "LIB-CAS-001", currentStock: 5 },
  { id: 4, name: "Kit Escolar Básico", sku: "KIT-ESC-001", currentStock: 45 },
]

export function StockAdjustmentForm({ product, onClose }: StockAdjustmentFormProps) {
  const [selectedProduct, setSelectedProduct] = useState(product?.id?.toString() || "")
  const [adjustmentType, setAdjustmentType] = useState("add")
  const [quantity, setQuantity] = useState("")
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")

  const currentProduct = mockProducts.find((p) => p.id.toString() === selectedProduct)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the stock adjustment
    console.log("Stock adjustment:", {
      productId: selectedProduct,
      type: adjustmentType,
      quantity: Number.parseInt(quantity),
      reason,
      notes,
    })
    onClose()
  }

  const getNewStock = () => {
    if (!currentProduct || !quantity) return currentProduct?.currentStock || 0
    const adjustment = Number.parseInt(quantity) || 0
    return adjustmentType === "add"
      ? currentProduct.currentStock + adjustment
      : currentProduct.currentStock - adjustment
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product">Producto *</Label>
          <Select value={selectedProduct} onValueChange={setSelectedProduct} required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar producto" />
            </SelectTrigger>
            <SelectContent>
              {mockProducts.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  <div className="flex items-center justify-between w-full">
                    <span>{product.name}</span>
                    <Badge variant="outline" className="ml-2">
                      Stock: {product.currentStock}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentProduct && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Producto</Label>
                  <div className="font-medium">{currentProduct.name}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">SKU</Label>
                  <div className="font-medium">{currentProduct.sku}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Stock Actual</Label>
                  <div className="font-medium text-lg">{currentProduct.currentStock}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Nuevo Stock</Label>
                  <div className="font-medium text-lg text-accent">{getNewStock()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adjustmentType">Tipo de Ajuste *</Label>
            <Select value={adjustmentType} onValueChange={setAdjustmentType} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-green-500" />
                    Entrada (Agregar)
                  </div>
                </SelectItem>
                <SelectItem value="subtract">
                  <div className="flex items-center gap-2">
                    <Minus className="h-4 w-4 text-red-500" />
                    Salida (Restar)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Motivo del Ajuste *</Label>
          <Select value={reason} onValueChange={setReason} required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar motivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inventory_count">Conteo de Inventario</SelectItem>
              <SelectItem value="damaged_goods">Mercancía Dañada</SelectItem>
              <SelectItem value="theft_loss">Pérdida/Robo</SelectItem>
              <SelectItem value="supplier_return">Devolución a Proveedor</SelectItem>
              <SelectItem value="customer_return">Devolución de Cliente</SelectItem>
              <SelectItem value="expired_goods">Productos Vencidos</SelectItem>
              <SelectItem value="system_error">Error del Sistema</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notas Adicionales</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detalles adicionales sobre el ajuste..."
            rows={3}
          />
        </div>

        {quantity && currentProduct && (
          <Card className="border-accent">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Resumen del Ajuste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Stock Actual:</span>
                  <span className="font-medium">{currentProduct.currentStock}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ajuste:</span>
                  <span className={`font-medium ${adjustmentType === "add" ? "text-green-600" : "text-red-600"}`}>
                    {adjustmentType === "add" ? "+" : "-"}
                    {quantity}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Nuevo Stock:</span>
                  <span className="font-bold text-lg">{getNewStock()}</span>
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
        <Button type="submit">Aplicar Ajuste</Button>
      </div>
    </form>
  )
}
