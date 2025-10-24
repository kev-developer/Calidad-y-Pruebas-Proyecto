"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Eye, EyeOff, Package, User, Lock } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Importar el servicio de autenticación dinámicamente para evitar problemas de importación
      const { authService } = await import('@/lib/services/auth')
      
      const result = await authService.login(email, password)

      if (!result.success) {
        setError(result.message || "Error al iniciar sesión")
        return
      }

      // Obtener información del usuario actual
      const userResult = await authService.getCurrentUser()
      
      if (userResult.success && userResult.data) {
        // Disparar evento personalizado para notificar el cambio de autenticación
        window.dispatchEvent(new CustomEvent('authStateChange', {
          detail: { authenticated: true, user: userResult.data }
        }));
        
        // Redirección según el rol del usuario
        if (userResult.data.idRol === 2) { // 2 = cliente
          router.push("/catalogo")
        } else {
          router.push("/") // la ruta principal de empleados/admin
        }
      } else {
        // Si no se puede obtener información del usuario, redirigir al catálogo por defecto
        router.push("/catalogo")
      }
    } catch (err) {
      console.error("Error en login:", err)
      setError("Ocurrió un error inesperado al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#fcfdfd]">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 border-r px-6 py-8 bg-white flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-[#415444]" />
            <h1 className="text-xl font-bold text-[#415444]">Papelería Pro</h1>
          </div>
        </div>
        <nav className="space-y-4 flex-1">
          <Link
            href="/catalogo"
            className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
          >
            <Package className="h-5 w-5" />
            Volver al Catálogo
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg rounded-[24px] overflow-hidden">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-[#e0e5ce]">
                  <Store className="h-8 w-8 text-[#415444]" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-[#415444]">Papelería Pro</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Ingresa a tu cuenta para acceder al sistema
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-6 pb-6">
                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@papeleria.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 border-gray-300 focus:border-[#415444] focus:ring-[#415444] rounded-[12px] h-12"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 border-gray-300 focus:border-[#415444] focus:ring-[#415444] rounded-[12px] h-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-[12px]">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pt-0">
                <Button 
                  type="submit" 
                  className="w-full bg-[#415444] hover:bg-[#415444]/90 text-white rounded-[12px] h-12 text-base font-medium transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Iniciando sesión...
                    </div>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{" "}
                    <Link 
                      href="/auth/register" 
                      className="text-[#415444] hover:text-[#338838] font-medium transition-colors"
                    >
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>

          {/* Additional Links */}
          <div className="text-center mt-6">
            <Link 
              href="/catalogo" 
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Volver al catálogo público
            </Link>
          </div>
        </div>
      </main>

      {/* Right Side - Visual Section */}
      <aside className="hidden lg:flex w-96 bg-gradient-to-br from-[#e0e5ce] to-[#e7ddd1] p-8 flex-col justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Package className="h-16 w-16 text-[#415444]" />
          </div>
          <h3 className="text-2xl font-bold text-[#415444] mb-4">
            Bienvenido de vuelta
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            Accede a tu cuenta proporcionada por la papeleria para empezar gestionar.
          </p>
        </div>
      </aside>
    </div>
  )
}
