"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ShoppingCart, Trash2, Plus, Minus, User, Receipt, CreditCard, Banknote, QrCode } from "lucide-react"

interface Product {
  id: string
  name: string
  code: string
  price: number
  stock: number
  category: string
  brand: string
}

interface CartItem extends Product {
  quantity: number
  discount: number
}

interface Customer {
  id: string
  name: string
  type: "minorista" | "mayorista" | "institucional"
  discount: number
  loyaltyPoints: number
}

export default function VentasPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "tarjeta" | "transferencia">("efectivo")
  const [receivedAmount, setReceivedAmount] = useState<number>(0)
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  // Mock data
  const products: Product[] = [
    {
      id: "1",
      name: "Cuaderno Universitario",
      code: "CU001",
      price: 2500,
      stock: 50,
      category: "Escolares",
      brand: "Norma",
    },
    { id: "2", name: "Bolígrafo Azul", code: "BA001", price: 800, stock: 100, category: "Útiles", brand: "Bic" },
    { id: "3", name: "Lápiz HB", code: "LH001", price: 500, stock: 200, category: "Útiles", brand: "Faber-Castell" },
    { id: "4", name: "Borrador Blanco", code: "BB001", price: 300, stock: 150, category: "Útiles", brand: "Pelikan" },
    { id: "5", name: "Regla 30cm", code: "R30001", price: 1200, stock: 75, category: "Útiles", brand: "Maped" },
  ]

  const customers: Customer[] = [
    { id: "1", name: "Juan Pérez", type: "minorista", discount: 0, loyaltyPoints: 150 },
    { id: "2", name: "Colegio San José", type: "institucional", discount: 15, loyaltyPoints: 0 },
    { id: "3", name: "Librería Central", type: "mayorista", discount: 10, loyaltyPoints: 0 },
  ]

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1, discount: 0 }])
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.id !== id))
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const updateDiscount = (id: string, discount: number) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, discount } : item)))
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity
    const discountAmount = (itemTotal * item.discount) / 100
    return sum + (itemTotal - discountAmount)
  }, 0)

  const customerDiscount = selectedCustomer ? (subtotal * selectedCustomer.discount) / 100 : 0
  const total = subtotal - customerDiscount

  const change = receivedAmount - total

  const handleSale = () => {
    // Here you would process the sale, update inventory, generate invoice
    console.log("Processing sale:", {
      cart,
      customer: selectedCustomer,
      paymentMethod,
      total,
      receivedAmount,
      change,
    })

    // Reset after sale
    setCart([])
    setSelectedCustomer(null)
    setReceivedAmount(0)
    setShowPaymentDialog(false)

    alert("Venta procesada exitosamente!")
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Sistema de Ventas (POS)</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCustomerDialog(true)}>
            <User className="w-4 h-4 mr-2" />
            {selectedCustomer ? selectedCustomer.name : "Seleccionar Cliente"}
          </Button>
          <Button
            onClick={() => setShowPaymentDialog(true)}
            disabled={cart.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Procesar Venta
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Search and List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Buscar Productos
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-800">{product.name}</h3>
                          <p className="text-sm text-slate-600">{product.code}</p>
                          <p className="text-sm text-slate-500">
                            {product.brand} • {product.category}
                          </p>
                        </div>
                        <Badge variant={product.stock > 10 ? "default" : "destructive"}>Stock: {product.stock}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-emerald-600">${product.price.toLocaleString()}</span>
                        <Button size="sm" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shopping Cart */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Carrito de Compras
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Carrito vacío</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-slate-500">{item.code}</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          type="number"
                          placeholder="Desc %"
                          value={item.discount}
                          onChange={(e) => updateDiscount(item.id, Number(e.target.value))}
                          className="w-20 h-8 text-xs"
                          min="0"
                          max="100"
                        />
                        <span className="text-xs text-slate-500">% desc</span>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-600">
                          ${item.price.toLocaleString()} x {item.quantity}
                        </p>
                        {item.discount > 0 && <p className="text-xs text-red-600">-{item.discount}% descuento</p>}
                        <p className="font-semibold text-emerald-600">
                          ${(item.price * item.quantity * (1 - item.discount / 100)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    {selectedCustomer && selectedCustomer.discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Desc. Cliente ({selectedCustomer.discount}%):</span>
                        <span>-${customerDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-emerald-600">${total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Selection Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seleccionar Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => {
                setSelectedCustomer(null)
                setShowCustomerDialog(false)
              }}
            >
              Venta sin cliente registrado
            </Button>
            {customers.map((customer) => (
              <Button
                key={customer.id}
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => {
                  setSelectedCustomer(customer)
                  setShowCustomerDialog(false)
                }}
              >
                <div className="text-left">
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-slate-500">
                    {customer.type} • {customer.discount}% descuento
                    {customer.loyaltyPoints > 0 && ` • ${customer.loyaltyPoints} puntos`}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Procesar Pago</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">Total: ${total.toLocaleString()}</p>
            </div>

            <Tabs value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="efectivo">
                  <Banknote className="w-4 h-4 mr-1" />
                  Efectivo
                </TabsTrigger>
                <TabsTrigger value="tarjeta">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Tarjeta
                </TabsTrigger>
                <TabsTrigger value="transferencia">
                  <QrCode className="w-4 h-4 mr-1" />
                  Transfer.
                </TabsTrigger>
              </TabsList>

              <TabsContent value="efectivo" className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Monto recibido:</label>
                  <Input
                    type="number"
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                {receivedAmount > 0 && (
                  <div className="text-center">
                    <p className="text-lg">
                      Cambio: <span className="font-bold text-blue-600">${change.toLocaleString()}</span>
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tarjeta">
                <p className="text-center text-slate-600">Procesar pago con tarjeta de crédito/débito</p>
              </TabsContent>

              <TabsContent value="transferencia">
                <p className="text-center text-slate-600">Mostrar código QR para transferencia</p>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleSale}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={paymentMethod === "efectivo" && receivedAmount < total}
            >
              Confirmar Venta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
