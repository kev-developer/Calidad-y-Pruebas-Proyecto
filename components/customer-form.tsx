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

interface CustomerFormProps {
  customer?: any
  onClose: () => void
}

export function CustomerForm({ customer, onClose }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    documentType: "CC",
    type: "retail",
    address: "",
    city: "",
    notes: "",
    discount: "",
    creditLimit: "",
    paymentTerms: "immediate",
    status: "active",
    loyaltyProgram: true,
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        document: customer.document || "",
        documentType: customer.documentType || "CC",
        type: customer.type || "retail",
        address: customer.address || "",
        city: customer.city || "",
        notes: customer.notes || "",
        discount: customer.discount?.toString() || "",
        creditLimit: customer.creditLimit?.toString() || "",
        paymentTerms: customer.paymentTerms || "immediate",
        status: customer.status || "active",
        loyaltyProgram: customer.loyaltyProgram !== false,
      })
    }
  }, [customer])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Customer data:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="commercial">Datos Comerciales</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ej: María González"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Cliente *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Minorista</SelectItem>
                      <SelectItem value="wholesale">Mayorista</SelectItem>
                      <SelectItem value="institutional">Institucional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Tipo de Documento</Label>
                  <Select
                    value={formData.documentType}
                    onValueChange={(value) => handleInputChange("documentType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                      <SelectItem value="NIT">NIT</SelectItem>
                      <SelectItem value="PP">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="document">Número de Documento *</Label>
                  <Input
                    id="document"
                    value={formData.document}
                    onChange={(e) => handleInputChange("document", e.target.value)}
                    placeholder="Ej: 12345678"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="cliente@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+57 300 123 4567"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Calle 123 #45-67"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Bogotá"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Información adicional sobre el cliente..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Comercial</CardTitle>
              <CardDescription>Descuentos, crédito y condiciones de pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">Descuento Personalizado (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.discount}
                    onChange={(e) => handleInputChange("discount", e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Límite de Crédito ($)</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.creditLimit}
                    onChange={(e) => handleInputChange("creditLimit", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Condiciones de Pago</Label>
                <Select
                  value={formData.paymentTerms}
                  onValueChange={(value) => handleInputChange("paymentTerms", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Pago Inmediato</SelectItem>
                    <SelectItem value="15_days">15 días</SelectItem>
                    <SelectItem value="30_days">30 días</SelectItem>
                    <SelectItem value="45_days">45 días</SelectItem>
                    <SelectItem value="60_days">60 días</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "wholesale" && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Beneficios Mayorista</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Descuentos automáticos por volumen</li>
                    <li>• Condiciones de pago extendidas</li>
                    <li>• Precios preferenciales</li>
                  </ul>
                </div>
              )}

              {formData.type === "institutional" && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Beneficios Institucionales</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Descuentos especiales para instituciones</li>
                    <li>• Facturación con términos extendidos</li>
                    <li>• Atención personalizada</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="loyaltyProgram">Programa de Fidelización</Label>
                  <p className="text-sm text-muted-foreground">Participar en el programa de puntos y recompensas</p>
                </div>
                <Switch
                  id="loyaltyProgram"
                  checked={formData.loyaltyProgram}
                  onCheckedChange={(checked) => handleInputChange("loyaltyProgram", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado del Cliente</Label>
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

              {formData.loyaltyProgram && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Programa de Fidelización</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Gana 1 punto por cada $1 gastado</li>
                    <li>• Canjea 100 puntos por $5 de descuento</li>
                    <li>• Ofertas exclusivas para miembros</li>
                    <li>• Descuentos en cumpleaños</li>
                  </ul>
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
        <Button type="submit">{customer ? "Actualizar" : "Crear"} Cliente</Button>
      </div>
    </form>
  )
}
