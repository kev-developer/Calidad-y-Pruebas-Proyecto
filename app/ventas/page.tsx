"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, ShoppingCart, DollarSign, Users, Calendar, Search, Download, BarChart3 } from "lucide-react"
import type { Venta, Cliente, ApiResponse } from "@/lib/models"
import { ventasService } from "@/lib/services/ventas"
import { clientesService } from "@/lib/services/clientes"

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPeriod, setFilterPeriod] = useState<string>("all")
  const [filterUser, setFilterUser] = useState<string>("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [ventasData, clientesData] = await Promise.all([
        ventasService.getVentas(),
        clientesService.getClientes(),
      ])

      if (ventasData.success && ventasData.data) {
        setVentas(ventasData.data)
      }
      if (clientesData.success && clientesData.data) {
        setClientes(clientesData.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVentas = ventas.filter((venta) => {
    const cliente = clientes.find((c) => c.idCliente === venta.idCliente)
    const matchesSearch =
      cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.idVenta.toString().includes(searchTerm) ||
      false

    return matchesSearch
  })


  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando análisis de ventas...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0)
  const ventasHoy = ventas.filter((v) => new Date(v.fecha).toDateString() === new Date().toDateString()).length
  const promedioVenta = totalVentas / ventas.length || 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-balance">Análisis de Ventas</h2>
            <p className="text-muted-foreground">Reportes y estadísticas de ventas</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              Generar Reporte
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">S/ {totalVentas.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Información en tiempo real
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Número de Ventas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ventas.length}</div>
              <p className="text-xs text-muted-foreground">
                Información en tiempo real
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio por Venta</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">S/ {promedioVenta.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Información en tiempo real
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ventasHoy}</div>
              <p className="text-xs text-muted-foreground">
                Información en tiempo real
              </p>
            </CardContent>
          </Card>
        </div>


        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente o ID de venta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los períodos</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                  <SelectItem value="year">Este año</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Ventas</CardTitle>
            <CardDescription>Lista detallada de todas las ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Venta</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVentas.map((venta) => {
                  const cliente = clientes.find((c) => c.idCliente === venta.idCliente)
                  return (
                    <TableRow key={venta.idVenta}>
                      <TableCell className="font-medium">#{venta.idVenta.toString().padStart(4, "0")}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{cliente?.nombre || "Cliente desconocido"}</p>
                          <Badge variant={cliente?.tipoCliente === "Mayorista" ? "default" : "secondary"}>
                            {cliente?.tipoCliente}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(venta.fecha).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="font-medium">S/ {venta.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="default">Completada</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
