"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Plus, Search, Truck, Phone, Mail, User, Edit, Trash2 } from "lucide-react"
import type { Proveedor, ApiResponse } from "@/lib/models"
import { proveedoresService } from "@/lib/services/proveedores"
import Swal from "sweetalert2"

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Proveedor | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
    telefono: "",
    email: "",
  })

  useEffect(() => {
    fetchProveedores()
  }, [])

  const fetchProveedores = async () => {
    try {
      const data = await proveedoresService.getProveedores()
      if (data.success && data.data) {
        setProveedores(data.data)
      }
    } catch (error) {
      console.error("Error fetching proveedores:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProveedores = proveedores.filter((proveedor) => {
    const matchesSearch =
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.contacto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.telefono?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false

    return matchesSearch
  })

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // Cerrar cualquier alerta previa antes de comenzar
  Swal.close()
  
  try {
    let data: ApiResponse<Proveedor>
    if (editingSupplier) {
      data = await proveedoresService.updateProveedor(editingSupplier.idProveedor, formData)
    } else {
      data = await proveedoresService.createProveedor(formData)
    }

    if (data.success) {
      // Cerrar diálogos primero
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
      resetForm()
      
      // Esperar un momento para asegurar que los diálogos se cerraron
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Mostrar alerta de éxito
      await Swal.fire({
        title: "¡Éxito!",
        text: editingSupplier ? "Proveedor actualizado correctamente" : "Proveedor creado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        allowEscapeKey: false,
        focusConfirm: true
      })
      
      await fetchProveedores()
    } else {
      // Cerrar diálogos primero
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Mostrar alerta de error
      await Swal.fire({
        title: "Error",
        text: data.message || "Ha ocurrido un error al guardar el proveedor.",
        icon: "error",
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        allowEscapeKey: false,
        focusConfirm: true
      })
    }
  } catch (error) {
    console.error("Error saving proveedor:", error)
    
    // Cerrar diálogos primero
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Mostrar alerta de error
    await Swal.fire({
      title: "Error",
      text: "Ha ocurrido un error inesperado al guardar el proveedor.",
      icon: "error",
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      focusConfirm: true
    })
  }
}

const handleDelete = async (id: number) => {
  // Cerrar cualquier alerta previa antes de comenzar
  Swal.close()
  
  // Cerrar diálogos de formulario si están abiertos
  setIsAddDialogOpen(false)
  setIsEditDialogOpen(false)
  
  // Pequeña pausa para asegurar que los diálogos se cerraron
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "¿Estás seguro de que deseas eliminar este proveedor?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    allowOutsideClick: false,
    allowEscapeKey: false,
    focusConfirm: true
  })
  
  if (result.isConfirmed) {
    try {
      const data = await proveedoresService.deleteProveedor(id)
      if (data.success) {
        // Mostrar alerta de éxito
        await Swal.fire({
          title: "¡Eliminado!",
          text: "El proveedor ha sido eliminado correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
          allowOutsideClick: false,
          allowEscapeKey: false,
          focusConfirm: true
        })
        await fetchProveedores()
      } else {
        // Mostrar alerta de error
        await Swal.fire({
          title: "Error",
          text: data.message || "Ha ocurrido un error al eliminar el proveedor.",
          icon: "error",
          confirmButtonText: "Aceptar",
          allowOutsideClick: false,
          allowEscapeKey: false,
          focusConfirm: true
        })
      }
    } catch (error) {
      console.error("Error deleting proveedor:", error)
      // Mostrar alerta de error
      await Swal.fire({
        title: "Error",
        text: "Ha ocurrido un error inesperado al eliminar el proveedor.",
        icon: "error",
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        allowEscapeKey: false,
        focusConfirm: true
      })
    }
  }
}

  const resetForm = () => {
    setFormData({
      nombre: "",
      contacto: "",
      telefono: "",
      email: "",
    })
    setEditingSupplier(null)
  }

  const handleEdit = (proveedor: Proveedor) => {
    setEditingSupplier(proveedor)
    setFormData({
      nombre: proveedor.nombre,
      contacto: proveedor.contacto || "",
      telefono: proveedor.telefono || "",
      email: proveedor.email || "",
    })
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando proveedores...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const totalProveedores = proveedores.length
  const proveedoresConEmail = proveedores.filter((p) => p.email).length
  const proveedoresConTelefono = proveedores.filter((p) => p.telefono).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-balance">Gestión de Proveedores</h2>
            <p className="text-muted-foreground">Administra tus proveedores y contactos</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proveedor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
                <DialogDescription>Registra un nuevo proveedor en el sistema.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre">Nombre de la Empresa</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Nombre del proveedor"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contacto">Persona de Contacto</Label>
                    <Input
                      id="contacto"
                      value={formData.contacto}
                      onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                      placeholder="Nombre del contacto principal"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="Número de teléfono"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="correo@proveedor.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Agregar Proveedor</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProveedores}</div>
              <p className="text-xs text-muted-foreground">Proveedores registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Con Email</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proveedoresConEmail}</div>
              <p className="text-xs text-muted-foreground">Proveedores con email</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Con Teléfono</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proveedoresConTelefono}</div>
              <p className="text-xs text-muted-foreground">Proveedores con teléfono</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Proveedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, contacto, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Proveedores</CardTitle>
            <CardDescription>Todos los proveedores registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProveedores.map((proveedor) => (
                  <TableRow key={proveedor.idProveedor}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Truck className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{proveedor.nombre}</p>
                          <p className="text-sm text-muted-foreground">ID: {proveedor.idProveedor}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {proveedor.contacto || "No especificado"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {proveedor.telefono || "No registrado"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {proveedor.email || "No registrado"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(proveedor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(proveedor.idProveedor)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Proveedor</DialogTitle>
              <DialogDescription>Actualiza la información del proveedor.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-nombre">Nombre de la Empresa</Label>
                  <Input
                    id="edit-nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Nombre del proveedor"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-contacto">Persona de Contacto</Label>
                  <Input
                    id="edit-contacto"
                    value={formData.contacto}
                    onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                    placeholder="Nombre del contacto principal"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-telefono">Teléfono</Label>
                  <Input
                    id="edit-telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Número de teléfono"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@proveedor.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Actualizar Proveedor</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
