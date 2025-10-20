"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Users, Star, Edit, Trash2, Mail, CreditCard } from "lucide-react"
import type { Cliente, ApiResponse } from "@/lib/models"
import { clientesService } from "@/lib/services/clientes"
import Swal from "sweetalert2"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Cliente | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    tipoCliente: "Minorista" as "Minorista" | "Mayorista" | "Institucional",
    email: "",
    puntos: 0,
    idPrograma: null as number | null,
  })

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      const data = await clientesService.getClientes()
      
      if (data.success && data.data) {
        setClientes(data.data)
        
      } else {
        console.error("Error :", data.message)
      }
    } catch (error) {
      console.error("Error al hacer fetching clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.dni?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false

    const matchesType = filterType === "all" || cliente.tipoCliente === filterType

    return matchesSearch && matchesType
  })

  

  const getClientTypeColor = (tipo: string) => {
    switch (tipo) {
      case "Mayorista":
        return "default"
      case "Institucional":
        return "secondary"
      default:
        return "outline"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let data: ApiResponse<Cliente>
      if (editingClient) {
        data = await clientesService.updateCliente(editingClient.idCliente, formData)
      } else {
        data = await clientesService.createCliente(formData)
      }

      if (data.success) {
        // Mostrar alerta de éxito
        await Swal.fire({
          title: "¡Éxito!",
          text: editingClient ? "Cliente actualizado correctamente" : "Cliente creado correctamente",
          icon: "success",
          confirmButtonText: "Aceptar"
        })
        await fetchClientes()
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
        resetForm()
      } else {
        // Mostrar alerta de error
        await Swal.fire({
          title: "Error",
          text: data.message || "Ha ocurrido un error al guardar el cliente.",
          icon: "error",
          confirmButtonText: "Aceptar"
        })
      }
    } catch (error) {
      console.error("Error saving cliente:", error)
      // Mostrar alerta de error
      await Swal.fire({
        title: "Error",
        text: "Ha ocurrido un error inesperado al guardar el cliente.",
        icon: "error",
        confirmButtonText: "Aceptar"
      })
    }
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Estás seguro de que deseas eliminar este cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    })
    
    if (result.isConfirmed) {
      try {
        const data = await clientesService.deleteCliente(id)

        if (data.success) {
          // Mostrar alerta de éxito
          await Swal.fire({
            title: "¡Eliminado!",
            text: "El cliente ha sido eliminado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar"
          })
          await fetchClientes()
        } else {
          // Mostrar alerta de error
          await Swal.fire({
            title: "Error",
            text: data.message || "Ha ocurrido un error al eliminar el cliente.",
            icon: "error",
            confirmButtonText: "Aceptar"
          })
        }
      } catch (error) {
        console.error("Error deleting cliente:", error)
        // Mostrar alerta de error
        await Swal.fire({
          title: "Error",
          text: "Ha ocurrido un error inesperado al eliminar el cliente.",
          icon: "error",
          confirmButtonText: "Aceptar"
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      dni: "",
      tipoCliente: "Minorista",
      email: "",
      puntos: 0,
      idPrograma: null,
    })
    setEditingClient(null)
  }

  const handleEdit = (cliente: Cliente) => {
    setEditingClient(cliente)
    setFormData({
      nombre: cliente.nombre || "",
      dni: cliente.dni || "",
      tipoCliente: cliente.tipoCliente,
      email: cliente.email || "",
      puntos: cliente.puntos,
      idPrograma: cliente.idPrograma,
    })
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando clientes...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const totalClientes = clientes.length
  const clientesMinoristas = clientes.filter((c) => c.tipoCliente === "Minorista").length
  const clientesMayoristas = clientes.filter((c) => c.tipoCliente === "Mayorista").length
  const clientesInstitucionales = clientes.filter((c) => c.tipoCliente === "Institucional").length



  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-balance">Gestión de Clientes</h2>
            <p className="text-muted-foreground">Administra tu base de clientes</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                <DialogDescription>Registra un nuevo cliente en el sistema.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Nombre completo del cliente"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dni">DNI/RUC</Label>
                    <Input
                      id="dni"
                      value={formData.dni}
                      onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                      placeholder="Documento de identidad"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tipoCliente">Tipo de Cliente</Label>
                    <Select
                      value={formData.tipoCliente}
                      onValueChange={(value: "Minorista" | "Mayorista" | "Institucional") =>
                        setFormData({ ...formData, tipoCliente: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Minorista">Minorista</SelectItem>
                        <SelectItem value="Mayorista">Mayorista</SelectItem>
                        <SelectItem value="Institucional">Institucional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Agregar Cliente</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClientes}</div>
              <p className="text-xs text-muted-foreground">Clientes registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Minoristas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientesMinoristas}</div>
              <p className="text-xs text-muted-foreground">Clientes minoristas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mayoristas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientesMayoristas}</div>
              <p className="text-xs text-muted-foreground">Clientes mayoristas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Institucionales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientesInstitucionales}</div>
              <p className="text-xs text-muted-foreground">Clientes institucionales</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, DNI o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Tipo de cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="Minorista">Minorista</SelectItem>
                  <SelectItem value="Mayorista">Mayorista</SelectItem>
                  <SelectItem value="Institucional">Institucional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>Todos los clientes registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>DNI/RUC</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Puntos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.length > 0 ? (
                  filteredClientes.map((cliente) => {
                    
                    return (
                      <TableRow key={cliente.idCliente}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <Users className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{cliente.nombre || "Sin nombre"}</p>
                              <p className="text-sm text-muted-foreground">ID: {cliente.idCliente}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            {cliente.dni || "No registrado"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getClientTypeColor(cliente.tipoCliente)}>{cliente.tipoCliente}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {cliente.email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                {cliente.email}
                              </div>
                            )}
                            {!cliente.email && <span className="text-sm text-muted-foreground">Sin email</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{cliente.puntos}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(cliente.idCliente)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      {clientes.length === 0 ? "No hay clientes registrados" : "No se encontraron clientes con los filtros aplicados"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>Actualiza la información del cliente.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-nombre">Nombre</Label>
                  <Input
                    id="edit-nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Nombre completo del cliente"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-dni">DNI/RUC</Label>
                  <Input
                    id="edit-dni"
                    value={formData.dni}
                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                    placeholder="Documento de identidad"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-tipoCliente">Tipo de Cliente</Label>
                  <Select
                    value={formData.tipoCliente}
                    onValueChange={(value: "Minorista" | "Mayorista" | "Institucional") =>
                      setFormData({ ...formData, tipoCliente: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Minorista">Minorista</SelectItem>
                      <SelectItem value="Mayorista">Mayorista</SelectItem>
                      <SelectItem value="Institucional">Institucional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Actualizar Cliente</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
