"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  CalendarIcon,
  Download,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { reportesService } from "@/lib/services/reportes"

export default function ReportesPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("month")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [salesData, setSalesData] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [topCustomers, setTopCustomers] = useState<any[]>([])
  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all necessary data in parallel
        const [statsResponse, alertsResponse, customersResponse, ventasResponse, clientesResponse, categoryResponse] = await Promise.all([
          reportesService.getDashboardStats(),
          reportesService.getInventoryAlerts(),
          reportesService.getTopCustomers(),
          reportesService.getVentas(),
          reportesService.getClientes(),
          reportesService.getSalesByCategory()
        ]);

        if (statsResponse.success && statsResponse.data) {
          setDashboardStats(statsResponse.data)
          // Use monthly sales data for charts
          setSalesData(statsResponse.data.ventasMes.map((item: any) => ({
            name: item.mes,
            ventas: item.total,
            costos: item.total * 0.7 // Assuming 70% cost for demonstration
          })))
          setTopProducts(statsResponse.data.topProductos.slice(0, 5))
        } else {
          throw new Error(statsResponse.message || 'Error al cargar estadísticas')
        }

        if (alertsResponse.success && alertsResponse.data) {
          setInventoryAlerts(alertsResponse.data)
        }

        if (customersResponse.success && customersResponse.data) {
          setTopCustomers(customersResponse.data.slice(0, 5))
        }

        // Use real category data instead of placeholders
        if (categoryResponse.success && categoryResponse.data) {
          
          setCategoryData(categoryResponse.data);
        } else {
          console.error('Error al obtener datos de categoría:', categoryResponse.message);
          setCategoryData([]); // Set empty array on error to prevent chart issues
        }

        // Calculate financial metrics from real data
        const ventas = ventasResponse.success && ventasResponse.data ? ventasResponse.data : [];
        const clientes = clientesResponse.success && clientesResponse.data ? clientesResponse.data : [];
        
        const financialMetrics = reportesService.calculateFinancialMetrics(ventas);
        const customerMetrics = reportesService.calculateCustomerMetrics(clientes, ventas);

        // Store these metrics in state for use in the component
        setDashboardStats((prev: any) => ({
          ...prev,
          financialMetrics,
          customerMetrics
        }));

      } catch (err) {
        console.error('Error fetching report data:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar datos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "low":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando reportes...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Error al cargar reportes</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Reportes y Análisis</h1>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {format(selectedDate, "PPP", { locale: es })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Ventas del Mes</p>
                    <p className="text-2xl font-bold text-slate-800">
                      ${dashboardStats?.totalVentas ? (dashboardStats.totalVentas / 1000).toFixed(1) + 'K' : '0'}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">+12.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Órdenes</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {dashboardStats?.ventasMes?.reduce((acc: number, item: any) => acc + (item.cantidad || 0), 0) || 0}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">+8.2%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Clientes Activos</p>
                    <p className="text-2xl font-bold text-slate-800">{dashboardStats?.totalClientes || 0}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">+5.1%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Productos</p>
                    <p className="text-2xl font-bold text-slate-800">{dashboardStats?.productosStock || 0}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-red-600">-2.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ventas vs Costos (Últimos 6 meses)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ventas" fill="#3b82f6" />
                    <Bar dataKey="costos" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ventas por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Products and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-slate-600">{product.sales} unidades</p>
                        </div>
                      </div>
                      <p className="font-semibold text-emerald-600">${product.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertas de Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{alert.product}</p>
                        <p className="text-sm text-slate-600">
                          Stock: {alert.stock} / Mínimo: {alert.minStock}
                        </p>
                      </div>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status === "critical" ? "Crítico" : "Bajo"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tendencia de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Ventas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-700">Venta Promedio</p>
                  <p className="text-2xl font-bold text-emerald-800">
                    ${dashboardStats?.financialMetrics?.ventaPromedio ? Math.round(dashboardStats.financialMetrics.ventaPromedio).toLocaleString() : '0'}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">Transacciones/Día</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {dashboardStats?.financialMetrics?.transaccionesPorDia ? Math.round(dashboardStats.financialMetrics.transaccionesPorDia) : '0'}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">Margen Promedio</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {dashboardStats?.financialMetrics?.margenPromedio ? Math.round(dashboardStats.financialMetrics.margenPromedio) + '%' : '0%'}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">Crecimiento</p>
                  <p className="text-2xl font-bold text-orange-800">
                    {dashboardStats?.financialMetrics?.crecimiento ? '+' + dashboardStats.financialMetrics.crecimiento.toFixed(1) + '%' : '0%'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rotación de Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-slate-600">Vendidos: {product.sales}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Rotación: 8.5x</p>
                        <p className="text-sm text-slate-600">Stock: 45 días</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Valoración de Inventario</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Valor Total</p>
                  <p className="text-2xl font-bold text-slate-800">
                    ${dashboardStats?.financialMetrics?.ingresosTotales ? (dashboardStats.financialMetrics.ingresosTotales / 1000000).toFixed(1) + 'M' : '0'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-700">Escolares</p>
                    <p className="text-lg font-bold text-emerald-800">
                      ${dashboardStats?.financialMetrics?.ingresosTotales ? (dashboardStats.financialMetrics.ingresosTotales * 0.35 / 1000000).toFixed(1) + 'M' : '0'}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">Útiles</p>
                    <p className="text-lg font-bold text-blue-800">
                      ${dashboardStats?.financialMetrics?.ingresosTotales ? (dashboardStats.financialMetrics.ingresosTotales * 0.30 / 1000000).toFixed(1) + 'M' : '0'}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-700">Arte</p>
                    <p className="text-lg font-bold text-orange-800">
                      ${dashboardStats?.financialMetrics?.ingresosTotales ? (dashboardStats.financialMetrics.ingresosTotales * 0.20 / 1000000).toFixed(1) + 'M' : '0'}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700">Oficina</p>
                    <p className="text-lg font-bold text-purple-800">
                      ${dashboardStats?.financialMetrics?.ingresosTotales ? (dashboardStats.financialMetrics.ingresosTotales * 0.15 / 1000000).toFixed(1) + 'M' : '0'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mejores Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-slate-600">{customer.purchases} compras</p>
                        </div>
                      </div>
                      <p className="font-semibold text-emerald-600">${customer.total.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Clientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">Nuevos Clientes</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {dashboardStats?.customerMetrics?.nuevosClientes || '0'}
                    </p>
                    <p className="text-xs text-blue-600">Este mes</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-700">Retención</p>
                    <p className="text-2xl font-bold text-emerald-800">
                      {dashboardStats?.customerMetrics?.retencion ? dashboardStats.customerMetrics.retencion + '%' : '0%'}
                    </p>
                    <p className="text-xs text-emerald-600">Tasa mensual</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Valor Promedio por Cliente</p>
                  <p className="text-2xl font-bold text-slate-800">
                    ${dashboardStats?.customerMetrics?.valorPromedioCliente ? Math.round(dashboardStats.customerMetrics.valorPromedioCliente).toLocaleString() : '0'}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">Frecuencia de Compra</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {dashboardStats?.customerMetrics?.frecuenciaCompra ? dashboardStats.customerMetrics.frecuenciaCompra.toFixed(1) + 'x' : '0x'}
                  </p>
                  <p className="text-xs text-purple-600">Por mes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-700">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-emerald-800">
                    ${dashboardStats?.financialMetrics?.ingresosTotales ? (dashboardStats.financialMetrics.ingresosTotales / 1000000).toFixed(1) + 'M' : '0'}
                  </p>
                  <p className="text-xs text-emerald-600">
                    {dashboardStats?.financialMetrics?.crecimiento ? '+' + dashboardStats.financialMetrics.crecimiento.toFixed(1) + '% vs mes anterior' : 'Sin datos'}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">Costos Totales</p>
                  <p className="text-2xl font-bold text-red-800">
                    ${dashboardStats?.financialMetrics?.costosTotales ? (dashboardStats.financialMetrics.costosTotales / 1000000).toFixed(1) + 'M' : '0'}
                  </p>
                  <p className="text-xs text-red-600">
                    {dashboardStats?.financialMetrics?.crecimiento ? '+' + (dashboardStats.financialMetrics.crecimiento * 0.65).toFixed(1) + '% vs mes anterior' : 'Sin datos'}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">Utilidad Bruta</p>
                  <p className="text-2xl font-bold text-blue-800">
                    ${dashboardStats?.financialMetrics?.utilidadBruta ? (dashboardStats.financialMetrics.utilidadBruta / 1000).toFixed(1) + 'K' : '0'}
                  </p>
                  <p className="text-xs text-blue-600">
                    Margen: {dashboardStats?.financialMetrics?.margenUtilidad ? dashboardStats.financialMetrics.margenUtilidad.toFixed(1) + '%' : '0%'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Flujo de Caja</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="ventas" stroke="#10b981" strokeWidth={2} name="Ingresos" />
                    <Line type="monotone" dataKey="costos" stroke="#ef4444" strokeWidth={2} name="Egresos" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  )
}
