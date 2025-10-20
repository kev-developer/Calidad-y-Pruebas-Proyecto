"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Plus, ShoppingCart, Edit, Trash2, Search, Filter, Gift } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Tipos temporales (ajustar cuando tengas el backend)
type Combo = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOriginal: number;
  estado: "activo" | "inactivo";
  productos: string[];
  descuento: number;
};

export default function CombosPage() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo
  useEffect(() => {
    const fetchCombos = async () => {
      setLoading(true);
      // Simular carga de datos
      setTimeout(() => {
        const combosEjemplo: Combo[] = [
          {
            id: 1,
            nombre: "Combo Escolar",
            descripcion: "Paquete completo para estudiantes",
            precio: 45000,
            precioOriginal: 52000,
            estado: "activo",
            productos: ["Cuaderno profesional", "Bolígrafos (5 unidades)", "Lápices (3 unidades)", "Sacapuntas"],
            descuento: 13
          },
          {
            id: 2,
            nombre: "Combo Oficina",
            descripcion: "Esenciales para la oficina",
            precio: 38000,
            precioOriginal: 44000,
            estado: "activo",
            productos: ["Block de notas", "Resaltadores (4 colores)", "Clip metálicos", "Post-it"],
            descuento: 14
          },
          {
            id: 3,
            nombre: "Combo Creativo",
            descripcion: "Materiales para arte y diseño",
            precio: 62000,
            precioOriginal: 75000,
            estado: "inactivo",
            productos: ["Lápices de colores (12)", "Block de dibujo", "Goma de borrar", "Sacapuntas doble"],
            descuento: 17
          }
        ];
        setCombos(combosEjemplo);
        setLoading(false);
      }, 1000);
    };

    fetchCombos();
  }, []);

  const filteredCombos = combos.filter((combo) => {
    const matchesSearch = combo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         combo.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = selectedEstado === "all" || combo.estado === selectedEstado;
    
    return matchesSearch && matchesEstado;
  });

  const handleDeleteCombo = (comboId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este combo?")) {
      setCombos(combos.filter(combo => combo.id !== comboId));
    }
  };

  const stats = {
    totalCombos: combos.length,
    combosActivos: combos.filter(combo => combo.estado === "activo").length,
    combosInactivos: combos.filter(combo => combo.estado === "inactivo").length,
    descuentoPromedio: combos.length > 0 ? 
      Math.round(combos.reduce((acc, combo) => acc + combo.descuento, 0) / combos.length) : 0
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando combos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground">Gestión de Combos</h2>
            <p className="text-muted-foreground">Crea y administra combos de productos para promociones</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Nuevo Combo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Combo</DialogTitle>
                <DialogDescription>
                  Completa la información para crear un nuevo combo promocional
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre del Combo</label>
                    <Input placeholder="Ej: Combo Escolar Premium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Precio Promocional</label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción</label>
                  <Input placeholder="Descripción del combo..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Productos del Combo</label>
                  <div className="border rounded-md p-4">
                    <p className="text-sm text-muted-foreground">Selecciona los productos que formarán parte del combo</p>
                    <Button variant="outline" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Productos
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button>
                    Crear Combo
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Combos</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCombos}</div>
              <p className="text-xs text-muted-foreground">Combos creados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Combos Activos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.combosActivos}</div>
              <p className="text-xs text-muted-foreground">Disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Descuento Promedio</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.descuentoPromedio}%</div>
              <p className="text-xs text-muted-foreground">Ahorro promedio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gestión</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Combos promocionales</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
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
                    placeholder="Buscar combos..."
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
                    Estado: {selectedEstado === "all" ? "Todos" : selectedEstado === "activo" ? "Activos" : "Inactivos"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedEstado("all")}>
                    Todos los estados
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedEstado("activo")}>
                    Activos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedEstado("inactivo")}>
                    Inactivos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Combos Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Combos</CardTitle>
            <CardDescription>{filteredCombos.length} combos encontrados</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Combo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Precio Original</TableHead>
                  <TableHead>Precio Promo</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCombos.map((combo) => (
                  <TableRow key={combo.id}>
                    <TableCell className="font-medium">{combo.nombre}</TableCell>
                    <TableCell>{combo.descripcion}</TableCell>
                    <TableCell>${combo.precioOriginal.toLocaleString()}</TableCell>
                    <TableCell className="font-bold text-green-600">${combo.precio.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {combo.descuento}% OFF
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={combo.estado === "activo" ? "default" : "secondary"}>
                        {combo.estado === "activo" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCombo(combo.id)}>
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

        {/* Empty State */}
        {combos.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Crea tu primer combo</h3>
                <p className="text-muted-foreground mb-4">
                  Los combos te permiten agrupar productos y ofrecer descuentos especiales a tus clientes.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Combo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}