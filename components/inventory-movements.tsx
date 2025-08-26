"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, TrendingUp, TrendingDown, Package, Search } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const mockMovements = [
  {
    id: 1,
    date: "2024-01-16",
    time: "14:30",
    product: "Cuaderno Universitario 100 hojas",
    sku: "CU-100-001",
    type: "sale",
    quantity: -5,
    reason: "Venta #001234",
    user: "María García",
    previousStock: 20,
    newStock: 15,
  },
  {
    id: 2,
    date: "2024-01-16",
    time: "10:15",
    product: "Bolígrafo BIC Azul",
    sku: "BOL-BIC-001",
    type: "purchase",
    quantity: 100,
    reason: "Compra a proveedor BIC",
    user: "Carlos López",
    previousStock: 200,
    newStock: 300,
  },
  {
    id: 3,
    date: "2024-01-15",
    time: "16:45",
    product: "Cien Años de Soledad",
    sku: "LIB-CAS-001",
    type: "adjustment",
    quantity: -2,
    reason: "Libros dañados",
    user: "Ana Martínez",
    previousStock: 7,
    newStock: 5,
  },
  {
    id: 4,
    date: "2024-01-15",
    time: "09:20",
    product: "Kit Escolar Básico",
    sku: "KIT-ESC-001",
    type: "sale",
    quantity: -3,
    reason: "Venta #001230",
    user: "María García",
    previousStock: 48,
    newStock: 45,
  },
  {
    id: 5,
    date: "2024-01-14",
    time: "11:30",
    product: "Cuaderno Universitario 100 hojas",
    sku: "CU-100-001",
    type: "return",
    quantity: 2,
    reason: "Devolución cliente",
    user: "Carlos López",
    previousStock: 18,
    newStock: 20,
  },
]

export function InventoryMovements() {
  const [movements, setMovements] = useState(mockMovements)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch =
      movement.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reason.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || movement.type === filterType

    const matchesDate =
      (!dateFrom || new Date(movement.date) >= dateFrom) && (!dateTo || new Date(movement.date) <= dateTo)

    return matchesSearch && matchesType && matchesDate
  })

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "sale":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "purchase":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "adjustment":
        return <Package className="h-4 w-4 text-orange-500" />
      case "return":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getMovementBadge = (type: string) => {
    switch (type) {
      case "sale":
        return <Badge variant="destructive">Venta</Badge>
      case "purchase":
        return <Badge variant="default">Compra</Badge>
      case "adjustment":
        return <Badge variant="secondary">Ajuste</Badge>
      case "return":
        return <Badge variant="outline">Devolución</Badge>
      default:
        return <Badge variant="outline">Otro</Badge>
    }
  }

  return (
    <div className="space-y-4">
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
                <SelectItem value="sale">Ventas</SelectItem>
                <SelectItem value="purchase">Compras</SelectItem>
                <SelectItem value="adjustment">Ajustes</SelectItem>
                <SelectItem value="return">Devoluciones</SelectItem>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Historial de Movimientos</CardTitle>
            <CardDescription>{filteredMovements.length} movimientos encontrados</CardDescription>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Stock Anterior</TableHead>
                <TableHead>Stock Nuevo</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Usuario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{movement.date}</div>
                      <div className="text-muted-foreground">{movement.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{movement.product}</div>
                      <div className="text-muted-foreground">{movement.sku}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMovementIcon(movement.type)}
                      {getMovementBadge(movement.type)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${movement.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                      {movement.quantity > 0 ? "+" : ""}
                      {movement.quantity}
                    </span>
                  </TableCell>
                  <TableCell>{movement.previousStock}</TableCell>
                  <TableCell className="font-semibold">{movement.newStock}</TableCell>
                  <TableCell className="text-sm">{movement.reason}</TableCell>
                  <TableCell className="text-sm">{movement.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
