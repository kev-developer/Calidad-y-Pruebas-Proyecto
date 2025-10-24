"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { productosService } from "@/lib/services/productos"
import { authService } from "@/lib/services/auth"
import { Search, User, Home, Package, LogOut, Star, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

type Product = {
  id: number
  name: string
  category: string
  price: number | string
  imageUrl: string
  blurDataURL?: string
  author?: string
  brand?: string
  rating?: number
  stock?: number
}

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    
    const loadProducts = async () => {
      try {
        const response = await productosService.getProductos()
        if (response.success && response.data) {
          // Mapear los productos del backend al formato esperado por el frontend
          const mappedProducts = response.data.map((producto: any) => ({
            id: producto.idProducto,
            name: producto.nombre,
            category: `Categoría ${producto.idCategoria}`,
            price: producto.precio,
            imageUrl: producto.imagen || "/placeholder.jpg",
            author: producto.descripcion || "Sin descripción",
            rating: 4.5 + Math.random() * 0.5, // Rating aleatorio entre 4.5 y 5.0
            stock: producto.stock || Math.floor(Math.random() * 50) + 10
          }))
          if (mounted) setProducts(mappedProducts)
        } else {
          console.error('Error al cargar productos:', response.message)
        }
      } catch (error) {
        console.error('Error fetching productos:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProducts()
    
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = authService.isAuthenticated()
      setIsAuthenticated(authenticated)
      if (authenticated) {
        let storedUser = authService.getStoredUser()
        // Si no hay usuario almacenado, intentar obtenerlo del servidor
        if (!storedUser) {
          try {
            const userResult = await authService.getCurrentUser()
            if (userResult.success && userResult.data) {
              storedUser = userResult.data
              setUser(storedUser)
            }
          } catch (error) {
            console.error('Error obteniendo usuario:', error)
          }
        } else {
          setUser(storedUser)
        }
      } else {
        setUser(null)
      }
    }

    // Verificar al montar
    checkAuth()

    // Escuchar cambios en el localStorage (para otras pestañas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth()
      }
    }

    // Escuchar cuando la pestaña recibe foco
    const handleFocus = () => {
      checkAuth()
    }

    // Escuchar evento personalizado de cambio de autenticación
    const handleAuthStateChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('authStateChange', handleAuthStateChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('authStateChange', handleAuthStateChange)
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
    router.push('/catalogo')
  }

  // Obtener solo los 4 productos más recientes
  const recentProducts = products.slice(0, 4)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfd]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#415444] mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando productos...</p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#fcfdfd]">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <button
          className="flex items-center gap-2"
          onClick={() => {
            const sidebar = document.querySelector('aside');
            if (sidebar) {
              sidebar.classList.toggle('hidden');
            }
          }}
        >
          <Package className="h-6 w-6 text-[#415444]" />
          <h1 className="text-lg font-bold text-[#415444]">Papelería Pro</h1>
        </button>
        {isAuthenticated ? (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </Button>
        ) : (
          <Link href="/auth/login">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </Button>
          </Link>
        )}
      </header>

      {/* Sidebar */}
      <aside className="hidden lg:block lg:static fixed inset-0 z-50 bg-white w-64 border-r px-6 py-8">
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-[#415444]" />
            <h1 className="text-xl font-bold text-[#415444]">Papelería Pro</h1>
          </div>
          <button
            className="lg:hidden p-2"
            onClick={() => {
              const sidebar = document.querySelector('aside');
              if (sidebar) {
                sidebar.classList.add('hidden');
              }
            }}
          >
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-[#415444]" />
            <h1 className="text-xl font-bold text-[#415444]">Papelería Pro</h1>
          </div>
        </div>
        <nav className="space-y-4">
          <Link
            href="/catalogo"
            className="flex items-center gap-3 rounded-lg bg-[#e0e5ce] px-3 py-2 text-[#415444] transition-colors"
          >
            <Home className="h-5 w-5" />
            Inicio
          </Link>
          <Link
            href="/catalogo/completo"
            className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
          >
            <Package className="h-5 w-5" />
            Catálogo Completo
          </Link>
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 text-gray-500">
                <User className="h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{user?.nombre || 'Usuario'}</p>
                  <p className="text-xs text-gray-400">
                    {user?.idRol === 2 ? 'Cliente' : user?.idRol === 1 ? 'Administrador' : 'Usuario'}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
            >
              <User className="h-5 w-5" />
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <header className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Bienvenido a Papelería Pro <span className="ml-1">👋</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500">Encuentra los mejores productos de papelería</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="w-full sm:w-64 pl-10"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-4">
                <span className="text-sm text-gray-600">Hola, {user?.nombre || 'Usuario'}</span>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden lg:block">
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Hero Cards */}
        <div className="mb-8 lg:mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Card className="bg-[#e0e5ce] border-0 rounded-[24px]">
            <CardContent className="p-6">
              <p className="mb-2 text-sm font-medium uppercase text-[#338838]">OFERTAS ESPECIALES</p>
              <h3 className="mb-4 text-2xl font-semibold">Colección de Papelería</h3>
              <p className="mb-6 text-gray-600">Descubre los mejores productos para tu oficina, escuela o proyectos creativos</p>
              <Link href="/catalogo/completo">
                <Button className="bg-[#415444] hover:bg-[#415444]/90">Ver Catálogo</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#e7ddd1] to-[#d4c9b8] border-0 rounded-[24px]">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="mb-4 text-3xl font-semibold">Gestiona la Papelería</h3>
                <p className="mb-6 text-5xl font-bold">Admin</p>
                <Link href="https://papeleriaaa.netlify.app/">
                  <Button className="bg-[#415444] hover:bg-[#415444]/90">Acceder al Sistema</Button>
                </Link>
              </div>
              <div className="w-32 h-32 bg-[#415444] rounded-full flex items-center justify-center shadow-lg">
                <TrendingUp className="h-16 w-16 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Products Section */}
        <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl font-semibold">Productos Recientes</h3>
            <span className="bg-[#e0e5ce] text-[#415444] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              Nuevo
            </span>
          </div>
          <Link href="/catalogo/completo">
            <Button className="bg-[#415444] hover:bg-[#415444]/90 text-white rounded-full px-4 sm:px-6 text-sm sm:text-base">
              Ver Todo el Catálogo
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-12">
          {recentProducts.map((product) => (
            <Card
              key={product.id}
              className="group border-0 bg-white rounded-[20px] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100"
            >
              <Link href={`/catalogo/producto/${product.id}`}>
                <CardHeader className="p-0 relative cursor-pointer">
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100 z-10 rounded-t-[20px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 transform scale-95 transition-all group-hover:opacity-100 group-hover:scale-100">
                    <Button className="bg-white text-black hover:bg-white/90 shadow-lg rounded-full">
                      Ver Detalles
                    </Button>
                  </div>
                  <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <Package className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
              </Link>
              <CardContent className="p-5 space-y-4">
                <Link href={`/catalogo/producto/${product.id}`} className="cursor-pointer">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 line-clamp-1 hover:text-[#415444] transition-colors">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating || 4.5)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({(product.rating || 4.5).toFixed(1)})</span>
                    </div>

                    {product.author && (
                      <p className="text-xs text-gray-500 line-clamp-2">{product.author}</p>
                    )}
                  </div>
                </Link>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#338838] text-xl font-bold">$ {product.price}</p>
                    <p className="text-xs text-gray-500">En stock: {product.stock}</p>
                  </div>
                  <Link href={`/catalogo/producto/${product.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full hover:bg-[#415444] hover:text-white transition-colors border-2"
                    >
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-[#415444] to-[#338838] border-0 rounded-2xl lg:rounded-[24px] text-white overflow-hidden">
          <CardContent className="p-6 lg:p-8 text-center relative">
            <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full -translate-y-12 lg:-translate-y-16 translate-x-12 lg:translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 lg:w-24 lg:h-24 bg-white/10 rounded-full translate-y-8 lg:translate-y-12 -translate-x-8 lg:-translate-x-12"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl lg:text-2xl font-semibold mb-4">¿No encuentras lo que buscas?</h3>
              <p className="mb-6 text-white/90 max-w-2xl mx-auto text-sm lg:text-lg">
                Explora nuestro catálogo completo con cientos de productos de papelería,
                materiales de oficina y suministros escolares.
              </p>
              <Link href="/catalogo/completo">
                <Button className="bg-white text-[#415444] hover:bg-white/90 text-sm lg:text-base font-semibold px-6 lg:px-8 py-2 lg:py-3 rounded-full shadow-lg">
                  Ver Catálogo Completo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}