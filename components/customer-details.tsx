"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Phone, Mail, Calendar, CreditCard, Gift } from "lucide-react"

interface CustomerDetailsProps {
  customer: any
  onClose: () => void
}

// Mock purchase history
const mockPurchaseHistory = [
  {
    id: "001234",
    date: "2024-01-15",
    total: 45.5,
    items: 3,
    status: "completed",
    paymentMethod: "cash",
  },
  {
    id: "001198",
    date: "2024-01-10",
    total: 28.75,
    items: 2,
    status: "completed",
    paymentMethod: "card",
  },
  {
    id: "001156",
    date: "2024-01-05",
    total: 67.25,
    items: 5,
    status: "completed",
    paymentMethod: "cash",
  },
]

export function CustomerDetails({ customer, onClose }: CustomerDetailsProps) {
  const getCustomerTypeBadge = (type: string) => {
    switch (type) {
      case "retail":
        return <Badge variant="default">Minorista</Badge>
      case "wholesale":
        return <Badge variant="secondary">Mayorista</Badge>
      case "institutional":
        return <Badge variant="outline">Institucional</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? <Badge variant="default">Activo</Badge> : <Badge variant="secondary">Inactivo</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold">{customer.name}</h3>
            {getCustomerTypeBadge(customer.type)}
            {getStatusBadge(customer.status)}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {customer.phone}
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {customer.email}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="purchases">Historial de Compras</TabsTrigger>
          <TabsTrigger value="loyalty">Programa de Fidelización</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documento:</span>
                  <span className="font-medium">
                    {customer.documentType}: {customer.document}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span className="font-medium">{customer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{customer.email}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground">Dirección:</span>
                  <div className="text-right">
                    <div className="font-medium">{customer.address}</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registro:</span>
                  <span className="font-medium">{customer.registrationDate}</span>
                </div>
              </CardContent>
            </Card>

            {/* Commercial Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información Comercial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo de Cliente:</span>
                  {getCustomerTypeBadge(customer.type)}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Descuento:</span>
                  <span className="font-medium">
                    {customer.discount > 0 ? `${customer.discount}%` : "Sin descuento"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Compras:</span>
                  <span className="font-medium">{customer.totalPurchases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Gastado:</span>
                  <span className="font-medium">${customer.totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última Compra:</span>
                  <span className="font-medium">{customer.lastPurchase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Puntos de Fidelización:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{customer.loyaltyPoints}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-2xl font-bold">{customer.totalPurchases}</div>
                    <div className="text-xs text-muted-foreground">Compras Totales</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-2xl font-bold">
                      ${(customer.totalSpent / customer.totalPurchases).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">Ticket Promedio</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">{customer.loyaltyPoints}</div>
                    <div className="text-xs text-muted-foreground">Puntos Disponibles</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-2xl font-bold">
                      {Math.floor(
                        (new Date().getTime() - new Date(customer.lastPurchase).getTime()) / (1000 * 60 * 60 * 24),
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">Días desde última compra</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Compras</CardTitle>
              <CardDescription>Últimas transacciones del cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPurchaseHistory.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">#{purchase.id}</TableCell>
                      <TableCell>{purchase.date}</TableCell>
                      <TableCell>{purchase.items} productos</TableCell>
                      <TableCell className="font-semibold">${purchase.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{purchase.paymentMethod === "cash" ? "Efectivo" : "Tarjeta"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Completado</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Puntos de Fidelización
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{customer.loyaltyPoints}</div>
                  <div className="text-sm text-muted-foreground">Puntos disponibles</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso al siguiente nivel</span>
                    <span>{customer.loyaltyPoints}/500</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(customer.loyaltyPoints / 500) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Beneficios Disponibles</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Descuento $5</span>
                      <span className="text-muted-foreground">100 puntos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Descuento $10</span>
                      <span className="text-muted-foreground">200 puntos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Descuento $25</span>
                      <span className="text-muted-foreground">500 puntos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historial de Puntos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Compra #001234</div>
                      <div className="text-sm text-muted-foreground">2024-01-15</div>
                    </div>
                    <div className="text-green-600 font-medium">+45 puntos</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Compra #001198</div>
                      <div className="text-sm text-muted-foreground">2024-01-10</div>
                    </div>
                    <div className="text-green-600 font-medium">+28 puntos</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Canje descuento</div>
                      <div className="text-sm text-muted-foreground">2024-01-08</div>
                    </div>
                    <div className="text-red-600 font-medium">-100 puntos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
