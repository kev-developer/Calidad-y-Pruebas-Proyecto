"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { productosService } from "@/lib/services/productos"

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [isLogin, setIsLogin] = useState(true)

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
            imageUrl: "/placeholder.jpg", // Placeholder hasta que se añadan imágenes
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

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSignupForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí normalmente se conectaría con el backend
    console.log("Datos de inicio de sesión:", loginForm)
    alert("En una implementación real, esto conectaría con el backend. Datos: " + JSON.stringify(loginForm))
    setShowLoginModal(false)
  }

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí normalmente se conectaría con el backend
    console.log("Datos de registro:", signupForm)
    alert("En una implementación real, esto conectaría con el backend. Datos: " + JSON.stringify(signupForm))
    setShowLoginModal(false)
  }

  if (loading) return <div className="p-6 text-center">Cargando...</div>

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Papelería Pro
          </h1>
          <Button 
            onClick={() => setShowLoginModal(true)}
            className="bg-white text-blue-700 hover:bg-gray-100 font-medium"
          >
            Iniciar Sesión
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Todo en material de oficina y escolar</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            En Papelería Pro encontrarás los mejores productos para tu oficina, escuela o proyectos creativos
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">¿Quiénes Somos?</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg mb-4">
                Papelería Pro es una empresa con más de 15 años de experiencia en el sector de suministros de oficina y material escolar.
              </p>
              <p className="text-lg mb-4">
                Nos enorgullece ofrecer productos de alta calidad a precios competitivos, con un servicio al cliente excepcional y entrega rápida.
              </p>
              <p className="text-lg">
                Trabajamos con las mejores marcas del mercado para garantizar la satisfacción total de nuestros clientes.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-full h-64 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0V9m0 12h4m-4 0v-6m4 6v-6h2m-8 6V9h2m0 12v-6m0 6h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Productos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col transition-transform hover:scale-105">
                <div className="relative w-full h-40 mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      style={{ objectFit: "cover", borderRadius: 8 }}
                      placeholder={p.blurDataURL ? "blur" : "empty"}
                      blurDataURL={p.blurDataURL}
                      loading="lazy"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{p.category}</p>
                {(p.author || p.brand) && (
                  <p className="text-sm text-gray-600">
                    Marca/Autor: {p.author || p.brand}
                  </p>
                )}
                <p className="mt-2 font-bold text-blue-700">${p.price}</p>
                <span className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Disponible
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Contacto</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Información de Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>info@papeleriapro.com</span>
                </div>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+51 999 868 777</span>
                </div>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Av. Principal 123, Lima, Perú</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Horario de Atención</h3>
              <div className="space-y-2">
                <p>Lunes a Viernes: 9:00 AM - 7:00 PM</p>
                <p>Sábados: 9:00 AM - 5:00 PM</p>
                <p>Domingos: 10:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Papelería Pro</h3>
              <p>Tu tienda de confianza para todos tus suministros de oficina, escuela y materiales de arte.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><Button variant="link" className="text-white hover:text-blue-300 p-0 h-auto" onClick={() => setShowLoginModal(true)}>Iniciar Sesión</Button></li>
                <li><Button variant="link" className="text-white hover:text-blue-300 p-0 h-auto" onClick={() => {setIsLogin(false); setShowLoginModal(true);}}>Crear Cuenta</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="hover:text-blue-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm5.63 7.026a3.728 3.728 0 0 1-1.052 2.583c.007.087.01.175.01.263 0 2.7-2.055 5.812-5.814 5.812a5.785 5.785 0 0 1-3.138-.917c.162.019.326.029.492.029.966 0 1.855-.329 2.56-.88a2.045 2.045 0 0 1-1.91-1.418c.126.024.255.037.388.037.188 0 .371-.025.545-.073a2.043 2.043 0 0 1-1.64-2.003v-.025c.276.153.593.245.928.256a2.04 2.04 0 0 1-.91-1.705c0-.376.101-.728.277-1.031a5.794 5.794 0 0 0 4.209 2.135 2.041 2.041 0 0 1 3.478-1.86 4.09 4.09 0 0 0 1.295-.493 2.046 2.046 0 0 1-.898 1.128 4.102 4.102 0 0 0 1.174-.321 4.385 4.385 0 0 1-1.024 1.057z"/></svg>
                </a>
                <a href="#" className="hover:text-blue-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p>&copy; 2023 Papelería Pro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Login/Signup Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-xl font-bold text-gray-800">
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </h3>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              {isLogin ? (
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 mb-2">Contraseña</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mb-4">
                    Iniciar Sesión
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <button 
                      type="button" 
                      className="text-blue-600 hover:underline"
                      onClick={() => setIsLogin(false)}
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={signupForm.name}
                      onChange={handleSignupChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="signup-email" className="block text-gray-700 mb-2">Correo Electrónico</label>
                    <input
                      type="email"
                      id="signup-email"
                      name="email"
                      value={signupForm.email}
                      onChange={handleSignupChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="signup-password" className="block text-gray-700 mb-2">Contraseña</label>
                    <input
                      type="password"
                      id="signup-password"
                      name="password"
                      value={signupForm.password}
                      onChange={handleSignupChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="confirm-password" className="block text-gray-700 mb-2">Confirmar Contraseña</label>
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirmPassword"
                      value={signupForm.confirmPassword}
                      onChange={handleSignupChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mb-4">
                    Crear Cuenta
                  </Button>
                  <p className="text-center text-sm text-gray-600">
                    ¿Ya tienes cuenta?{" "}
                    <button 
                      type="button" 
                      className="text-blue-600 hover:underline"
                      onClick={() => setIsLogin(true)}
                    >
                      Inicia sesión aquí
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}