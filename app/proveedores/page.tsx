"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Building, Phone, Mail, Package } from "lucide-react"

interface Supplier {
  id: number
  name: string
  contact: string
  email: string
  phone: string
  products: string[]
  status: "active" | "inactive"
  orders: number
}

const mockSuppliers: Supplier[] = [ 
  {
    id: 1,
    name: "Distribuidora Papelera Nacional",
    contact: "Carlos Mendoza",
    email: "ventas@papeleranacional.com",
    phone: "+57 300 123 4567",
    products: ["Cuadernos", "Lápices", "Borradores"],
    status: "active",
    orders: 24
  },
  {
    id: 2,
    name: "Librería Educativa S.A.",
    contact: "María Rodríguez",
    email: "compras@libreriaeducativa.com",
    phone: "+57 301 987 6543",
    products: ["Libros", "Material didáctico"],
    status: "active",
    orders: 18
  },
  {
    id: 3,
    name: "Suministros de Oficina",
    contact: "Jorge Silva",
    email: "info@suministros.com",
    phone: "+57 302 456 7890",
    products: ["Papelería", "Tintas", "Cartuchos"],
    status: "inactive",
    orders: 8
  }
]

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeSuppliers = suppliers.filter(s => s.status === "active").length
  const totalOrders = suppliers.reduce((sum, s) => sum + s.orders, 0)

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Proveedores</h2>
                <p className="text-muted-foreground">Gestiona tus proveedores de papelería</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proveedor
              </Button>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{suppliers.length}</div>
                  <p className="text-xs text-muted-foreground">{activeSuppliers} activos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Realizados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Proveedores Activos</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeSuppliers}</div>
                  <p className="text-xs text-muted-foreground">Disponibles</p>
                </CardContent>
              </Card>
            </div>

            {/* Búsqueda */}
            <Card>
              <CardHeader>
                <CardTitle>Buscar Proveedores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o contacto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tabla de proveedores */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Proveedores</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Productos</TableHead>
                      <TableHead>Pedidos</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {supplier.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {supplier.phone}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {supplier.contact}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {supplier.products.slice(0, 2).map((product, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {product}
                              </Badge>
                            ))}
                            {supplier.products.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{supplier.products.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">{supplier.orders}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                            {supplier.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
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