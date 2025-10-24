"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Search, ShoppingCart, User, Building } from "lucide-react"
import { ventasService } from "@/lib/services/ventas"
import { inventarioService } from "@/lib/services/inventario"
import { clientesService } from "@/lib/services/clientes"
import { productosService } from "@/lib/services/productos"
import { authService } from "@/lib/services/auth"
import type { Producto, Cliente, Sucursal, Inventario, Usuario } from "@/lib/models"

interface DetalleVenta {
  idProducto: number
  cantidad: number
  precioUnitario: number
  descuentoAplicado: number
  producto?: Producto
}

interface VentaFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function VentaForm({ onSuccess, onCancel }: VentaFormProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [inventario, setInventario] = useState<Inventario[]>([])
  const [loading, setLoading] = useState(false)
  const [searchProduct, setSearchProduct] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)
  const [cantidad, setCantidad] = useState(1)

  const [ventaData, setVentaData] = useState({
    idCliente: 0,
    idSucursal: 0,
    idUsuario: 0, // Se actualizará con el usuario autenticado
  })
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)

  const [detalles, setDetalles] = useState<DetalleVenta[]>([])

  useEffect(() => {
    fetchInitialData()
    // Obtener usuario autenticado
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const storedUser = authService.getStoredUser()
        if (storedUser) {
          setCurrentUser(storedUser)
          setVentaData(prev => ({ ...prev, idUsuario: storedUser.idUsuario }))
        } else {
          try {
            const userResult = await authService.getCurrentUser()
            if (userResult.success && userResult.data) {
              const userData = userResult.data
              setCurrentUser(userData)
              setVentaData(prev => ({ ...prev, idUsuario: userData.idUsuario }))
            }
          } catch (error) {
            console.error('Error obteniendo usuario:', error)
          }
        }
      }
    }
    checkAuth()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [clientesRes, sucursalesRes, productosRes, inventarioRes] = await Promise.all([
        clientesService.getClientes(),
        inventarioService.getSucursales(),
        productosService.getProductos(),
        inventarioService.getInventarios(),
      ])

      if (clientesRes.success && clientesRes.data) setClientes(clientesRes.data)
      if (sucursalesRes.success && sucursalesRes.data) setSucursales(sucursalesRes.data)
      if (productosRes.success && productosRes.data) setProductos(productosRes.data)
      if (inventarioRes.success && inventarioRes.data) setInventario(inventarioRes.data)
    } catch (error) {
      console.error("Error fetching initial data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchProduct.toLowerCase())
  )

  const getStockDisponible = (idProducto: number, idSucursal: number) => {
    const inventarioItem = inventario.find(
      (inv) => inv.idProducto === idProducto && inv.idSucursal === idSucursal
    )
    return inventarioItem?.stock || 0
  }

  const agregarProducto = () => {
    if (!selectedProduct || !ventaData.idSucursal) return

    const stockDisponible = getStockDisponible(selectedProduct.idProducto, ventaData.idSucursal)
    if (cantidad > stockDisponible) {
      alert(`Stock insuficiente. Solo hay ${stockDisponible} unidades disponibles.`)
      return
    }

    const detalleExistente = detalles.find(
      (det) => det.idProducto === selectedProduct.idProducto
    )

    if (detalleExistente) {
      setDetalles(
        detalles.map((det) =>
          det.idProducto === selectedProduct.idProducto
            ? { ...det, cantidad: det.cantidad + cantidad }
            : det
        )
      )
    } else {
      setDetalles([
        ...detalles,
        {
          idProducto: selectedProduct.idProducto,
          cantidad,
          precioUnitario: selectedProduct.precio,
          descuentoAplicado: 0,
          producto: selectedProduct,
        },
      ])
    }

    setSelectedProduct(null)
    setCantidad(1)
    setSearchProduct("")
  }

  const eliminarProducto = (idProducto: number) => {
    setDetalles(detalles.filter((det) => det.idProducto !== idProducto))
  }

  const actualizarCantidad = (idProducto: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return

    const stockDisponible = getStockDisponible(idProducto, ventaData.idSucursal)
    if (nuevaCantidad > stockDisponible) {
      alert(`Stock insuficiente. Solo hay ${stockDisponible} unidades disponibles.`)
      return
    }

    setDetalles(
      detalles.map((det) =>
        det.idProducto === idProducto ? { ...det, cantidad: nuevaCantidad } : det
      )
    )
  }

  const actualizarPrecio = (idProducto: number, nuevoPrecio: number) => {
    setDetalles(
      detalles.map((det) =>
        det.idProducto === idProducto ? { ...det, precioUnitario: nuevoPrecio } : det
      )
    )
  }

  const calcularTotal = () => {
    return detalles.reduce((total, det) => {
      const subtotal = det.precioUnitario * det.cantidad
      const descuento = subtotal * (det.descuentoAplicado / 100)
      return total + (subtotal - descuento)
    }, 0)
  }

  const procesarVenta = async () => {
    if (!ventaData.idCliente || !ventaData.idSucursal || detalles.length === 0) {
      alert("Por favor complete todos los campos y agregue al menos un producto")
      return
    }

    // Verificar stock disponible para todos los productos
    for (const detalle of detalles) {
      const stockDisponible = getStockDisponible(detalle.idProducto, ventaData.idSucursal)
      if (detalle.cantidad > stockDisponible) {
        alert(`Stock insuficiente para ${detalle.producto?.nombre}. Solo hay ${stockDisponible} unidades disponibles.`)
        return
      }
    }

    try {
      setLoading(true)
      
      // Verificar que tenemos un usuario válido
      if (!ventaData.idUsuario || ventaData.idUsuario === 0) {
        alert("Error: No se pudo obtener la información del usuario. Por favor, inicie sesión nuevamente.")
        return
      }

      // Asegurar que todos los valores sean números
      const ventaCompleta = {
        venta_data: {
          idCliente: Number(ventaData.idCliente),
          idUsuario: Number(ventaData.idUsuario),
          idSucursal: Number(ventaData.idSucursal),
          total: Number(calcularTotal().toFixed(2)),
        },
        detalles: detalles.map((det) => ({
          idProducto: Number(det.idProducto),
          cantidad: Number(det.cantidad),
          precioUnitario: Number(det.precioUnitario),
          descuentoAplicado: Number(det.descuentoAplicado || 0),
        })),
      }

      console.log("Datos de venta a enviar:", JSON.stringify(ventaCompleta, null, 2))

      const result = await ventasService.createVentaCompleta(ventaCompleta)

      if (result.success) {
        alert("Venta registrada exitosamente")
        if (onSuccess) onSuccess()
        // Reset form
        setVentaData({ idCliente: 0, idSucursal: 0, idUsuario: currentUser?.idUsuario || 0 })
        setDetalles([])
      } else {
        // Mostrar el mensaje de error del backend de forma legible
        const errorMessage = result.message || "Error al procesar la venta"
        alert(`Error al procesar la venta: ${errorMessage}`)
      }
    } catch (error) {
      console.error("Error procesando venta:", error)
      alert("Error de conexión al procesar la venta")
    } finally {
      setLoading(false)
    }
  }

  if (loading && clientes.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Información de la Venta */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Venta</CardTitle>
          <CardDescription>Seleccione el cliente y la sucursal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Select
                value={ventaData.idCliente.toString()}
                onValueChange={(value) => setVentaData({ ...ventaData, idCliente: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.idCliente} value={cliente.idCliente.toString()}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {cliente.nombre || "Cliente sin nombre"}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sucursal">Sucursal</Label>
              <Select
                value={ventaData.idSucursal.toString()}
                onValueChange={(value) => setVentaData({ ...ventaData, idSucursal: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {sucursales.map((sucursal) => (
                    <SelectItem key={sucursal.idSucursal} value={sucursal.idSucursal.toString()}>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {sucursal.nombre}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agregar Productos */}
      <Card>
        <CardHeader>
          <CardTitle>Agregar Productos</CardTitle>
          <CardDescription>Busque y agregue productos a la venta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar producto..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="pl-8"
                />
              </div>
              {searchProduct && (
                <div className="mt-2 border rounded-md max-h-32 overflow-y-auto">
                  {filteredProductos.map((producto) => (
                    <div
                      key={producto.idProducto}
                      className="p-2 hover:bg-muted cursor-pointer"
                      onClick={() => setSelectedProduct(producto)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{producto.nombre}</span>
                        <span className="text-sm text-muted-foreground">
                          S/ {producto.precio.toFixed(2)}
                        </span>
                      </div>
                      {ventaData.idSucursal > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Stock: {getStockDisponible(producto.idProducto, ventaData.idSucursal)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-24">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={agregarProducto} disabled={!selectedProduct || !ventaData.idSucursal}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>

          {detalles.length > 0 && (
            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detalles.map((detalle) => (
                    <TableRow key={detalle.idProducto}>
                      <TableCell className="font-medium">
                        {detalle.producto?.nombre}
                        {ventaData.idSucursal > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Stock: {getStockDisponible(detalle.idProducto, ventaData.idSucursal)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={detalle.precioUnitario}
                          onChange={(e) => actualizarPrecio(detalle.idProducto, parseFloat(e.target.value) || 0)}
                          className="w-24 ml-auto"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="1"
                          value={detalle.cantidad}
                          onChange={(e) => actualizarCantidad(detalle.idProducto, parseInt(e.target.value) || 1)}
                          className="w-20 ml-auto"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        S/ {(detalle.precioUnitario * detalle.cantidad).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarProducto(detalle.idProducto)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Total de la Venta</h4>
                    <p className="text-sm text-muted-foreground">
                      {detalles.length} producto(s) en la venta
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      S/ {calcularTotal().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <div className="space-y-2">
          {!ventaData.idUsuario && (
            <p className="text-sm text-red-600 text-right">
              Error: Usuario no autenticado
            </p>
          )}
          <Button
            onClick={procesarVenta}
            disabled={detalles.length === 0 || loading || !ventaData.idUsuario}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {loading ? "Procesando..." : "Procesar Venta"}
          </Button>
        </div>
      </div>
    </div>
  )
}