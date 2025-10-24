"use client"

import React, { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { productosService } from "@/lib/services/productos"
import { authService } from "@/lib/services/auth"
import { Search, User, Home, Package, Filter, ArrowLeft, LogOut } from "lucide-react"
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
}

export default function CatalogoCompletoPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [currentPage, setCurrentPage] = useState(1)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const productsPerPage = 8
  const router = useRouter()

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

  useEffect(() => {
    let mounted = true
    
    const loadProducts = async () => {
      try {
        const response = await productosService.getProductos()
        if (response.success && response.data) {
          const mappedProducts = response.data.map((producto: any) => ({
            id: producto.idProducto,
            name: producto.nombre,
            category: `Categoría ${producto.idCategoria}`,
            price: producto.precio,
            imageUrl: producto.imagen || "/placeholder.jpg",
            author: producto.descripcion || "Sin descripción"
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

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price
      const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1]
      
      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [products, searchTerm, selectedCategory, priceRange])

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
    return ["all", ...uniqueCategories]
  }, [products])

  // Calcular paginación
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, priceRange])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfd]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#415444] mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando productos...</p>
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
        <nav className="space-y-4 mb-8">
          <Link
            href="/catalogo"
            className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver al Inicio
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
            className="flex items-center gap-3 rounded-lg bg-[#e0e5ce] px-3 py-2 text-[#415444] transition-colors"
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

        {/* Filtros - Solo en desktop */}
        <div className="hidden lg:block space-y-6">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#415444]" />
            <h3 className="font-semibold text-[#415444]">Filtros</h3>
          </div>

          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "Todas las categorías" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de Precio: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>$1000</span>
            </div>
          </div>

          {/* Estadísticas de filtros */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <header className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold">Catálogo Completo</h2>
            <p className="text-sm sm:text-base text-gray-500">Explora todos nuestros productos de papelería</p>
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
            {!isAuthenticated && (
              <Link href="/auth/login" className="hidden lg:block">
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Mobile Filters Button */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => {
              // Mostrar solo la sección de filtros en móvil
              const filtersSection = document.querySelector('.mobile-filters-section');
              if (filtersSection) {
                filtersSection.classList.toggle('hidden');
              }
            }}
          >
            <Filter className="h-4 w-4" />
            Mostrar Filtros
          </Button>
        </div>

        {/* Mobile Filters Section */}
        <div className="lg:hidden mobile-filters-section hidden mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-4 text-lg">Filtros</h3>
          <div className="space-y-4">
            {/* Categorías */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Categorías
              </label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={`mobile-cat-${category}`}
                      name="mobile-category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="h-4 w-4 text-[#415444] border-gray-300 rounded focus:ring-[#415444]"
                    />
                    <label
                      htmlFor={`mobile-cat-${category}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {category === "all" ? "Todas las categorías" : category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rango de Precios */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Rango de Precio
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="mobile-precio-todos"
                    name="mobile-precio"
                    checked={priceRange[0] === 0 && priceRange[1] === 1000}
                    onChange={() => setPriceRange([0, 1000])}
                    className="h-4 w-4 text-[#415444] border-gray-300 focus:ring-[#415444]"
                  />
                  <label htmlFor="mobile-precio-todos" className="ml-2 text-sm text-gray-700">
                    Todos los precios
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="mobile-precio-bajo"
                    name="mobile-precio"
                    checked={priceRange[0] === 0 && priceRange[1] === 50}
                    onChange={() => setPriceRange([0, 50])}
                    className="h-4 w-4 text-[#415444] border-gray-300 focus:ring-[#415444]"
                  />
                  <label htmlFor="mobile-precio-bajo" className="ml-2 text-sm text-gray-700">
                    S/ 0 - S/ 50
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="mobile-precio-medio"
                    name="mobile-precio"
                    checked={priceRange[0] === 51 && priceRange[1] === 100}
                    onChange={() => setPriceRange([51, 100])}
                    className="h-4 w-4 text-[#415444] border-gray-300 focus:ring-[#415444]"
                  />
                  <label htmlFor="mobile-precio-medio" className="ml-2 text-sm text-gray-700">
                    S/ 51 - S/ 100
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="mobile-precio-alto"
                    name="mobile-precio"
                    checked={priceRange[0] === 101 && priceRange[1] === 1000}
                    onChange={() => setPriceRange([101, 1000])}
                    className="h-4 w-4 text-[#415444] border-gray-300 focus:ring-[#415444]"
                  />
                  <label htmlFor="mobile-precio-alto" className="ml-2 text-sm text-gray-700">
                    S/ 101+
                  </label>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange([0, 1000]);
                }}
              >
                Limpiar
              </Button>
              <Button
                className="flex-1 bg-[#415444] hover:bg-[#415444]/90"
                onClick={() => {
                  const filtersSection = document.querySelector('.mobile-filters-section');
                  if (filtersSection) {
                    filtersSection.classList.add('hidden');
                  }
                }}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {currentProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group border-0 bg-white rounded-[16px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100"
                >
                  <Link href={`/catalogo/producto/${product.id}`}>
                    <CardHeader className="p-0 relative cursor-pointer">
                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 z-10 rounded-t-[16px]" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 transform scale-95 transition-all group-hover:opacity-100 group-hover:scale-100">
                        <Button className="bg-white text-black hover:bg-white/90">
                          Ver Detalles
                        </Button>
                      </div>
                      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            style={{ objectFit: "cover" }}
                            className="transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <Package className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                    </CardHeader>
                  </Link>
                  <CardContent className="p-4 space-y-3">
                    <Link href={`/catalogo/producto/${product.id}`} className="cursor-pointer">
                      <div>
                        <h4 className="text-lg font-semibold mb-1 line-clamp-1 hover:text-[#415444] transition-colors">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                        {product.author && (
                          <p className="text-xs text-gray-500 line-clamp-2">{product.author}</p>
                        )}
                      </div>
                    </Link>
                    <div className="flex items-center justify-between">
                      <p className="text-[#338838] text-xl font-semibold">$ {product.price}</p>
                      <Link href={`/catalogo/producto/${product.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full hover:bg-[#415444] hover:text-white transition-colors"
                        >
                          Ver Detalles
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(prev => Math.max(1, prev - 1))
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(page)
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(prev => Math.min(totalPages, prev + 1))
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500 mb-4">
              Intenta ajustar los filtros o términos de búsqueda
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setPriceRange([0, 1000])
              }}
              className="bg-[#415444] hover:bg-[#415444]/90"
            >
              Limpiar Filtros
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}