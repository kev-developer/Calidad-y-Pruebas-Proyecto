"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Users, Star, Gift, Eye } from "lucide-react"
import { CustomerForm } from "@/components/customer-form"
import { CustomerDetails } from "@/components/customer-details"
import { LoyaltyProgram } from "@/components/loyalty-program"

// Mock data for customers
const mockCustomers = [
  {
    id: 1,
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+57 300 123 4567",
    document: "12345678",
    documentType: "CC",
    type: "retail",
    address: "Calle 123 #45-67, Bogotá",
    registrationDate: "2023-06-15",
    lastPurchase: "2024-01-15",
    totalPurchases: 15,
    totalSpent: 450.75,
    loyaltyPoints: 225,
    discount: 0,
    status: "active",
  },
  {
    id: 2,
    name: "Colegio San José",
    email: "compras@colegiosanjose.edu.co",
    phone: "+57 301 987 6543",
    document: "900123456-1",
    documentType: "NIT",
    type: "institutional",
    address: "Carrera 50 #30-20, Medellín",
    registrationDate: "2023-03-10",
    lastPurchase: "2024-01-14",
    totalPurchases: 8,
    totalSpent: 2850.0,
    loyaltyPoints: 0,
    discount: 15,
    status: "active",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@papeleria.com",
    phone: "+57 302 456 7890",
    document: "87654321",
    documentType: "CC",
    type: "wholesale",
    address: "Avenida 80 #25-30, Cali",
    registrationDate: "2023-08-22",
    lastPurchase: "2024-01-16",
    totalPurchases: 25,
    totalSpent: 1250.5,
    loyaltyPoints: 625,
    discount: 10,
    status: "active",
  },
  {
    id: 4,
    name: "Ana Martínez",
    email: "ana.martinez@gmail.com",
    phone: "+57 303 789 0123",
    document: "11223344",
    documentType: "CC",
    type: "retail",
    address: "Calle 45 #12-34, Barranquilla",
    registrationDate: "2023-11-05",
    lastPurchase: "2024-01-10",
    totalPurchases: 3,
    totalSpent: 89.25,
    loyaltyPoints: 44,
    discount: 0,
    status: "inactive",
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false)
  const [isLoyaltyProgramOpen, setIsLoyaltyProgramOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [viewingCustomer, setViewingCustomer] = useState(null)

  const customerTypes = ["all", "retail", "wholesale", "institutional"]
  const customerStatuses = ["all", "active", "inactive"]

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.document.includes(searchTerm)

    const matchesType = selectedType === "all" || customer.type === selectedType
    const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer)
    setIsCustomerFormOpen(true)
  }

  const handleViewCustomer = (customer) => {
    setViewingCustomer(customer)
  }

  const handleDeleteCustomer = (customerId) => {
    setCustomers(customers.filter((c) => c.id !== customerId))
  }

  const getCustomerTypeBadge = (type) => {
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

  const getStatusBadge = (status) => {
    return status === "active" ? <Badge variant="default">Activo</Badge> : <Badge variant="secondary">Inactivo</Badge>
  }

  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === "active").length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const averageSpent = totalRevenue / totalCustomers

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
                <h2 className="text-3xl font-serif font-bold text-foreground">Gestión de Clientes</h2>
                <p className="text-muted-foreground">Administra tu base de clientes y programas de fidelización</p>
              </div>
              <div className="flex gap-2">
                <Dialog open={isLoyaltyProgramOpen} onOpenChange={setIsLoyaltyProgramOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Gift className="h-4 w-4 mr-2" />
                      Programa de Fidelización
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Programa de Fidelización</DialogTitle>
                      <DialogDescription>Gestiona puntos y recompensas para clientes</DialogDescription>
                    </DialogHeader>
                    <LoyaltyProgram />
                  </DialogContent>
                </Dialog>

                <Dialog open={isCustomerFormOpen} onOpenChange={setIsCustomerFormOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingCustomer ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
                      <DialogDescription>
                        {editingCustomer ? "Modifica los datos del cliente" : "Registra un nuevo cliente"}
                      </DialogDescription>
                    </DialogHeader>
                    <CustomerForm
                      customer={editingCustomer}
                      onClose={() => {
                        setIsCustomerFormOpen(false)
                        setEditingCustomer(null)
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
                  <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">{activeCustomers} activos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">De todos los clientes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gasto Promedio</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${averageSpent.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Por cliente</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Puntos Activos</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {customers.reduce((sum, c) => sum + c.loyaltyPoints, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">En programa de fidelización</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="customers" className="space-y-4">
              <TabsList>
                <TabsTrigger value="customers">Clientes</TabsTrigger>
                <TabsTrigger value="segments">Segmentos</TabsTrigger>
                <TabsTrigger value="analytics">Análisis</TabsTrigger>
              </TabsList>

              <TabsContent value="customers" className="space-y-4">
                {/* Filters */}
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
                            placeholder="Buscar clientes..."
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
                            Tipo: {selectedType === "all" ? "Todos" : selectedType}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setSelectedType("all")}>Todos los tipos</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedType("retail")}>Minorista</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedType("wholesale")}>Mayorista</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedType("institutional")}>
                            Institucional
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Estado: {selectedStatus === "all" ? "Todos" : selectedStatus}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setSelectedStatus("all")}>
                            Todos los estados
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedStatus("active")}>Activos</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedStatus("inactive")}>Inactivos</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>

                {/* Customers Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Clientes</CardTitle>
                    <CardDescription>{filteredCustomers.length} clientes encontrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Documento</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Contacto</TableHead>
                          <TableHead>Compras</TableHead>
                          <TableHead>Total Gastado</TableHead>
                          <TableHead>Puntos</TableHead>
                          <TableHead>Descuento</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{customer.name}</div>
                                <div className="text-sm text-muted-foreground">{customer.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>
                                  {customer.documentType}: {customer.document}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getCustomerTypeBadge(customer.type)}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{customer.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <div className="font-semibold">{customer.totalPurchases}</div>
                                <div className="text-xs text-muted-foreground">compras</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold">${customer.totalSpent.toFixed(2)}</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="font-medium">{customer.loyaltyPoints}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {customer.discount > 0 ? (
                                <Badge variant="secondary">{customer.discount}%</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(customer.status)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Detalles
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteCustomer(customer.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="segments" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Clientes Minoristas</CardTitle>
                      <CardDescription>Clientes individuales</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{customers.filter((c) => c.type === "retail").length}</div>
                      <p className="text-xs text-muted-foreground">
                        $
                        {customers
                          .filter((c) => c.type === "retail")
                          .reduce((sum, c) => sum + c.totalSpent, 0)
                          .toFixed(2)}{" "}
                        en ventas
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Clientes Mayoristas</CardTitle>
                      <CardDescription>Revendedores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{customers.filter((c) => c.type === "wholesale").length}</div>
                      <p className="text-xs text-muted-foreground">
                        $
                        {customers
                          .filter((c) => c.type === "wholesale")
                          .reduce((sum, c) => sum + c.totalSpent, 0)
                          .toFixed(2)}{" "}
                        en ventas
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Clientes Institucionales</CardTitle>
                      <CardDescription>Colegios y empresas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {customers.filter((c) => c.type === "institutional").length}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        $
                        {customers
                          .filter((c) => c.type === "institutional")
                          .reduce((sum, c) => sum + c.totalSpent, 0)
                          .toFixed(2)}{" "}
                        en ventas
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top 5 Clientes</CardTitle>
                      <CardDescription>Por valor de compras</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {customers
                          .sort((a, b) => b.totalSpent - a.totalSpent)
                          .slice(0, 5)
                          .map((customer, index) => (
                            <div key={customer.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center">
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-medium">{customer.name}</div>
                                  <div className="text-sm text-muted-foreground">{customer.totalPurchases} compras</div>
                                </div>
                              </div>
                              <div className="font-semibold">${customer.totalSpent.toFixed(2)}</div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Distribución por Tipo</CardTitle>
                      <CardDescription>Porcentaje de clientes por segmento</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {["retail", "wholesale", "institutional"].map((type) => {
                          const count = customers.filter((c) => c.type === type).length
                          const percentage = ((count / totalCustomers) * 100).toFixed(1)
                          const typeName =
                            type === "retail" ? "Minorista" : type === "wholesale" ? "Mayorista" : "Institucional"

                          return (
                            <div key={type} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>{typeName}</span>
                                <span>
                                  {count} ({percentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div className="bg-accent h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Customer Details Dialog */}
      {viewingCustomer && (
        <Dialog open={!!viewingCustomer} onOpenChange={() => setViewingCustomer(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalles del Cliente</DialogTitle>
              <DialogDescription>Información completa y historial de compras</DialogDescription>
            </DialogHeader>
            <CustomerDetails customer={viewingCustomer} onClose={() => setViewingCustomer(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
