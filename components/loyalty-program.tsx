"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Gift, Users, TrendingUp, Plus, Edit } from "lucide-react"

const mockRewards = [
  { id: 1, name: "Descuento $5", points: 100, description: "Descuento de $5 en tu próxima compra", active: true },
  { id: 2, name: "Descuento $10", points: 200, description: "Descuento de $10 en tu próxima compra", active: true },
  { id: 3, name: "Descuento $25", points: 500, description: "Descuento de $25 en tu próxima compra", active: true },
  { id: 4, name: "Producto Gratis", points: 300, description: "Cuaderno universitario gratis", active: false },
]

const mockLoyaltyStats = {
  totalMembers: 156,
  activeMembers: 142,
  totalPointsIssued: 45230,
  totalPointsRedeemed: 12450,
  averagePointsPerMember: 290,
}

export function LoyaltyProgram() {
  const [rewards, setRewards] = useState(mockRewards)
  const [newReward, setNewReward] = useState({ name: "", points: "", description: "" })

  const handleAddReward = () => {
    if (newReward.name && newReward.points && newReward.description) {
      setRewards([
        ...rewards,
        {
          id: Date.now(),
          name: newReward.name,
          points: Number.parseInt(newReward.points),
          description: newReward.description,
          active: true,
        },
      ])
      setNewReward({ name: "", points: "", description: "" })
    }
  }

  const toggleRewardStatus = (rewardId: number) => {
    setRewards(rewards.map((reward) => (reward.id === rewardId ? { ...reward, active: !reward.active } : reward)))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="rewards">Recompensas</TabsTrigger>
          <TabsTrigger value="members">Miembros</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Miembros Totales</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockLoyaltyStats.totalMembers}</div>
                <p className="text-xs text-muted-foreground">{mockLoyaltyStats.activeMembers} activos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Puntos Emitidos</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockLoyaltyStats.totalPointsIssued.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total histórico</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Puntos Canjeados</CardTitle>
                <Gift className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockLoyaltyStats.totalPointsRedeemed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {((mockLoyaltyStats.totalPointsRedeemed / mockLoyaltyStats.totalPointsIssued) * 100).toFixed(1)}% del
                  total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promedio por Miembro</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockLoyaltyStats.averagePointsPerMember}</div>
                <p className="text-xs text-muted-foreground">Puntos por miembro</p>
              </CardContent>
            </Card>
          </div>

          {/* Program Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Reglas del Programa</CardTitle>
              <CardDescription>Configuración actual del programa de fidelización</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Acumulación de Puntos</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 1 punto por cada $1 gastado</li>
                    <li>• Puntos dobles en cumpleaños</li>
                    <li>• Bonificación del 10% en compras mayores a $100</li>
                    <li>• Los puntos vencen después de 12 meses</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Beneficios por Nivel</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Bronce (0-499 puntos): Descuentos básicos</li>
                    <li>• Plata (500-999 puntos): 5% descuento adicional</li>
                    <li>• Oro (1000+ puntos): 10% descuento adicional</li>
                    <li>• Acceso prioritario a ofertas especiales</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          {/* Add New Reward */}
          <Card>
            <CardHeader>
              <CardTitle>Agregar Nueva Recompensa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rewardName">Nombre</Label>
                  <Input
                    id="rewardName"
                    value={newReward.name}
                    onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                    placeholder="Ej: Descuento $15"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rewardPoints">Puntos Requeridos</Label>
                  <Input
                    id="rewardPoints"
                    type="number"
                    value={newReward.points}
                    onChange={(e) => setNewReward({ ...newReward, points: e.target.value })}
                    placeholder="300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rewardDescription">Descripción</Label>
                  <Input
                    id="rewardDescription"
                    value={newReward.description}
                    onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                    placeholder="Descripción de la recompensa"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddReward} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards List */}
          <Card>
            <CardHeader>
              <CardTitle>Recompensas Disponibles</CardTitle>
              <CardDescription>Gestiona las recompensas del programa de fidelización</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recompensa</TableHead>
                    <TableHead>Puntos Requeridos</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell className="font-medium">{reward.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{reward.points}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{reward.description}</TableCell>
                      <TableCell>
                        <Badge variant={reward.active ? "default" : "secondary"}>
                          {reward.active ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant={reward.active ? "secondary" : "default"}
                            onClick={() => toggleRewardStatus(reward.id)}
                          >
                            {reward.active ? "Desactivar" : "Activar"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Miembros del Programa</CardTitle>
              <CardDescription>Clientes con más puntos acumulados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Carlos Rodríguez", points: 625, level: "Oro", totalSpent: 1250.5 },
                  { name: "María González", points: 225, level: "Bronce", totalSpent: 450.75 },
                  { name: "Ana Martínez", points: 44, level: "Bronce", totalSpent: 89.25 },
                ].map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">Total gastado: ${member.totalSpent}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{member.points}</span>
                      </div>
                      <Badge variant={member.level === "Oro" ? "default" : "secondary"}>{member.level}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Programa</CardTitle>
              <CardDescription>Ajusta las reglas y parámetros del programa de fidelización</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pointsPerDollar">Puntos por Dólar Gastado</Label>
                  <Input id="pointsPerDollar" type="number" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pointsExpiry">Vencimiento de Puntos (meses)</Label>
                  <Input id="pointsExpiry" type="number" defaultValue="12" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bronzeThreshold">Umbral Bronce</Label>
                  <Input id="bronzeThreshold" type="number" defaultValue="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="silverThreshold">Umbral Plata</Label>
                  <Input id="silverThreshold" type="number" defaultValue="500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goldThreshold">Umbral Oro</Label>
                  <Input id="goldThreshold" type="number" defaultValue="1000" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Guardar Configuración</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
