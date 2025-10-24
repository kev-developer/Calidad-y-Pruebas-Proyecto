"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { productosService } from "@/lib/services/productos"
import { authService } from "@/lib/services/auth"
import { ArrowLeft, Package, User, Home, Star, LogOut } from "lucide-react"

type Product = {
  id: number
  name: string
  category: string
  price: number | string
  imageUrl: string
  blurDataURL?: string
  author?: string
  brand?: string
  description?: string
  stock?: number
}

export default function ProductoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  const productId = params.id as string

  useEffect(() => {
    let mounted = true
    
    const loadProduct = async () => {
      try {
        const response = await productosService.getProductos()
        if (response.success && response.data) {
          // Buscar el producto específico por ID
          const productoEncontrado = response.data.find((p: any) => 
            p.idProducto.toString() === productId
          )
          
          if (productoEncontrado && mounted) {
            const mappedProduct: Product = {
              id: productoEncontrado.idProducto,
              name: productoEncontrado.nombre,
              category: `Categoría ${productoEncontrado.idCategoria}`,
              price: productoEncontrado.precio,
              imageUrl: productoEncontrado.imagen || "/placeholder.jpg",
              author: productoEncontrado.descripcion || "Sin descripción",
              description: productoEncontrado.descripcion || "Este producto no tiene una descripción detallada disponible.",
              stock: Math.floor(Math.random() * 50) + 10
            }
            setProduct(mappedProduct)
            
            // Cargar productos relacionados (misma categoría)
            const related = response.data
              .filter((p: any) => 
                p.idCategoria === productoEncontrado.idCategoria && 
                p.idProducto !== productoEncontrado.idProducto
              )
              .slice(0, 4)
              .map((p: any) => ({
                id: p.idProducto,
                name: p.nombre,
                category: `Categoría ${p.idCategoria}`,
                price: p.precio,
                imageUrl: p.imagen || "/placeholder.jpg",
                author: p.descripcion || "Sin descripción"
              }))
            
            if (mounted) setRelatedProducts(related)
          } else if (mounted) {
            // Producto no encontrado
            setProduct(null)
          }
        } else {
          console.error('Error al cargar productos:', response.message)
        }
      } catch (error) {
        console.error('Error fetching producto:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
    
    return () => {
      mounted = false
    }
  }, [productId])

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


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfd]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#415444] mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando producto...</p>
      </div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfd]">
      <div className="text-center">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">Producto no encontrado</h2>
        <p className="text-gray-500 mb-6">El producto que buscas no existe o ha sido removido.</p>
        <Link href="/catalogo">
          <Button className="bg-[#415444] hover:bg-[#415444]/90">
            Volver al Catálogo
          </Button>
        </Link>
      </div>
    </div>
  )

  const handleLogout = () => {
    authService.logout()
    router.push('/catalogo')
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#fcfdfd]">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <button
          onClick={() => document.querySelector('aside')?.classList.toggle('hidden')}
          className="flex items-center gap-2"
        >
          <Package className="h-6 w-6 text-[#415444]" />
          <h1 className="text-lg font-bold text-[#415444]">Papelería Pro</h1>
        </button>
        <Link href="/catalogo">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver</span>
          </Button>
        </Link>
      </header>

      {/* Sidebar */}
      <aside className="hidden lg:block w-64 border-r px-6 py-8 bg-white fixed lg:relative inset-0 z-50 lg:z-auto">
        {/* Mobile Close Button */}
        <button
          onClick={() => document.querySelector('aside')?.classList.add('hidden')}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-[#415444]" />
            <h1 className="text-xl font-bold text-[#415444]">Papelería Pro</h1>
          </div>
        </div>
        <nav className="space-y-4">
          <Link
            href="/catalogo"
            className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver al Catálogo
          </Link>
          <Link
            href="/catalogo"
            className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
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
        {/* Breadcrumb */}
        <nav className="mb-4 sm:mb-6 flex items-center text-xs sm:text-sm text-gray-500">
          <Link href="/catalogo" className="hover:text-[#415444] transition-colors">
            Catálogo
          </Link>
          <span className="mx-2">/</span>
          <Link href="/catalogo/completo" className="hover:text-[#415444] transition-colors">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#415444] font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-[16px] sm:rounded-[24px] flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <Package className="h-32 w-32 text-gray-400" />
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg sm:text-xl text-[#338838] font-semibold mb-3 sm:mb-4">$ {product.price}</p>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 sm:h-5 w-4 sm:w-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600">(4.8 • 128 reseñas)</span>
              </div>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Descripción</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Information */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <div className={`w-2 h-2 rounded-full ${(product.stock || 0) > 10 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-gray-600">
                {(product.stock || 0) > 10 ? 'En stock' : 'Últimas unidades'} • {product.stock} disponibles
              </span>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-8 sm:pt-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="group border-0 bg-white rounded-[16px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100"
                >
                  <Link href={`/catalogo/producto/${relatedProduct.id}`}>
                    <CardContent className="p-0">
                      <div className="relative w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
                        {relatedProduct.imageUrl ? (
                          <Image
                            src={relatedProduct.imageUrl}
                            alt={relatedProduct.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            style={{ objectFit: "cover" }}
                            className="transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <Package className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        <h4 className="text-lg font-semibold line-clamp-1">{relatedProduct.name}</h4>
                        <p className="text-sm text-gray-600">{relatedProduct.category}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-[#338838] text-xl font-semibold">$ {relatedProduct.price}</p>
                          <Link href={`/catalogo/producto/${relatedProduct.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full hover:bg-[#415444] hover:text-white transition-colors"
                            >
                              Ver Detalles
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}