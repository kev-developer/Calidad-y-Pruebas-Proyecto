"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, TrendingUp, TrendingDown, Package, Search, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { inventarioService } from "@/lib/services/inventario"
import Swal from "sweetalert2"

interface MovimientoEnriquecido {
  idMovimiento: number
  idInventario: number
  tipoMovimiento: string
  cantidad: number
  fecha: string
  fechaHora: string
  observacion: string | null
  motivo: string
  inventario?: any
  producto?: any
  sucursal?: any
  stockAnterior: number
  stockNuevo: number
  tipoMovimientoOriginal?: string
}

interface InventoryMovementsProps {
  maxItems?: number
  showFilters?: boolean
}

export function InventoryMovements({ maxItems, showFilters = true }: InventoryMovementsProps) {
  const [movimientos, setMovimientos] = useState<MovimientoEnriquecido[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  useEffect(() => {
    fetchMovimientos()
  }, [])

  const fetchMovimientos = async () => {
    try {
      setLoading(true)
      const result = await inventarioService.getMovimientosInventario()
      
      if (result.success && result.data) {
        setMovimientos(result.data)
      } else {
        console.error("Error fetching movimientos:", result.message)
        await Swal.fire({
          title: "Error",
          text: result.message || "Error al cargar los movimientos de inventario",
          icon: "error",
          confirmButtonText: "Aceptar"
        })
      }
    } catch (error) {
      console.error("Error fetching movimientos:", error)
      await Swal.fire({
        title: "Error",
        text: "Error inesperado al cargar los movimientos de inventario",
        icon: "error",
        confirmButtonText: "Aceptar"
      })
    } finally {
      setLoading(false)
    }
  }

  const normalizarTipoMovimiento = (tipo: string) => {
    return tipo.toLowerCase().trim()
  }

  const filteredMovimientos = movimientos.filter((movimiento) => {
    const matchesSearch =
      movimiento.producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movimiento.producto?.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movimiento.motivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movimiento.sucursal?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false

    const tipoNormalizado = normalizarTipoMovimiento(movimiento.tipoMovimiento)
    const matchesType = filterType === "all" || tipoNormalizado === filterType

    const movimientoDate = new Date(movimiento.fecha)
    const matchesDate =
      (!dateFrom || movimientoDate >= dateFrom) && (!dateTo || movimientoDate <= dateTo)

    return matchesSearch && matchesType && matchesDate
  })

  // Aplicar límite de items si se especifica
  const displayedMovimientos = maxItems ? filteredMovimientos.slice(0, maxItems) : filteredMovimientos

  const getMovementIcon = (type: string) => {
    const tipoNormalizado = normalizarTipoMovimiento(type)
    switch (tipoNormalizado) {
      case "venta":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "ingreso":
      case "adicion":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "ajuste_stock_minimo":
      case "ajuste_stock_maximo":
      case "disminucion":
        return <Package className="h-4 w-4 text-orange-500" />
      case "devolucion":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "remocion":
        return <TrendingDown className="h-4 w-4 text-purple-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getMovementBadge = (type: string) => {
    const tipoNormalizado = normalizarTipoMovimiento(type)
    switch (tipoNormalizado) {
      case "venta":
        return <Badge variant="destructive">Venta</Badge>
      case "ingreso":
        return <Badge className="bg-green-500 hover:bg-green-600">Ingreso</Badge>
      case "adicion":
        return <Badge className="bg-green-600 hover:bg-green-700">Adición</Badge>
      case "disminucion":
        return <Badge variant="secondary">Disminución</Badge>
      case "devolucion":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Devolución</Badge>
      case "ajuste_stock_minimo":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Ajuste Mínimo</Badge>
      case "ajuste_stock_maximo":
        return <Badge className="bg-orange-600 hover:bg-orange-700">Ajuste Máximo</Badge>
      case "remocion":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Remoción</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const formatFecha = (fechaString: string) => {
    try {
      const fecha = new Date(fechaString)
      return format(fecha, "dd/MM/yyyy", { locale: es })
    } catch {
      return fechaString
    }
  }

  const formatHora = (fechaString: string) => {
    try {
      const fecha = new Date(fechaString)
      return format(fecha, "HH:mm", { locale: es })
    } catch {
      return "00:00"
    }
  }

  const handleExport = async () => {
    await Swal.fire({
      title: "Exportar",
      text: "Función de exportación en desarrollo",
      icon: "info",
      confirmButtonText: "Aceptar"
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Movimientos de Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Cargando movimientos...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar movimientos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de movimiento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="venta">Ventas</SelectItem>
                  <SelectItem value="ingreso">Ingresos</SelectItem>
                  <SelectItem value="adicion">Adiciones</SelectItem>
                  <SelectItem value="disminucion">Disminuciones</SelectItem>
                  <SelectItem value="devolucion">Devoluciones</SelectItem>
                  <SelectItem value="ajuste_stock_minimo">Ajustes Mínimos</SelectItem>
                  <SelectItem value="ajuste_stock_maximo">Ajustes Máximos</SelectItem>
                  <SelectItem value="remocion">Remociones</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP", { locale: es }) : "Fecha desde"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP", { locale: es }) : "Fecha hasta"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpiar Filtros
              </Button>
              <Button variant="outline" size="sm" onClick={fetchMovimientos}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              {maxItems ? `Últimos ${maxItems} Movimientos` : "Historial de Movimientos"}
            </CardTitle>
            <CardDescription>
              {filteredMovimientos.length} movimientos encontrados
              {maxItems && filteredMovimientos.length > maxItems && ` (mostrando ${maxItems})`}
            </CardDescription>
          </div>
          {!maxItems && (
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>Producto</TableHead>
                {!maxItems && <TableHead>Sucursal</TableHead>}
                <TableHead>Tipo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Stock Anterior</TableHead>
                <TableHead>Stock Nuevo</TableHead>
                <TableHead>Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedMovimientos.length > 0 ? (
                displayedMovimientos.map((movimiento) => (
                  <TableRow key={movimiento.idMovimiento}>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{formatFecha(movimiento.fecha)}</div>
                        <div className="text-muted-foreground">{formatHora(movimiento.fecha)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{movimiento.producto?.nombre || "Producto no encontrado"}</div>
                        <div className="text-muted-foreground">{movimiento.producto?.descripcion || "Sin descripción"}</div>
                      </div>
                    </TableCell>
                    {!maxItems && (
                      <TableCell className="text-sm">
                        {movimiento.sucursal?.nombre || "Sucursal no encontrada"}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMovementIcon(movimiento.tipoMovimiento)}
                        {getMovementBadge(movimiento.tipoMovimiento)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const tipoNormalizado = normalizarTipoMovimiento(movimiento.tipoMovimiento)
                        const esSalida = tipoNormalizado === "venta" || tipoNormalizado === "disminucion"
                        const cantidadMostrar = esSalida ? -Math.abs(movimiento.cantidad) : Math.abs(movimiento.cantidad)
                        const esPositiva = cantidadMostrar > 0
                        
                        return (
                          <span className={`font-semibold ${esPositiva ? "text-green-600" : "text-red-600"}`}>
                            {esPositiva ? "+" : ""}
                            {cantidadMostrar}
                          </span>
                        )
                      })()}
                    </TableCell>
                    <TableCell>{movimiento.stockAnterior}</TableCell>
                    <TableCell className="font-semibold">{movimiento.stockNuevo}</TableCell>
                    <TableCell className="text-sm max-w-xs truncate" title={movimiento.motivo}>
                      {movimiento.motivo}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={maxItems ? 7 : 8} 
                    className="text-center py-8"
                  >
                    <div className="text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No se encontraron movimientos</h3>
                      <p className="text-muted-foreground mt-2">
                        {movimientos.length === 0 
                          ? "No hay movimientos registrados en el sistema." 
                          : "No se encontraron movimientos con los filtros aplicados."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
