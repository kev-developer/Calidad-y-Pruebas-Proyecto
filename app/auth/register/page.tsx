"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Eye, EyeOff, Package, User, Lock, UserPlus } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "cliente", // 🔑 por defecto cliente, puedes cambiarlo a empleado en otra UI
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    try {
      setLoading(true)
      
      // Importar el servicio de autenticación dinámicamente
      const { authService } = await import('@/lib/services/auth')
      
      const result = await authService.register({
        nombre: formData.name,
        email: formData.email,
        contraseña: formData.password,
        idRol: formData.role === "cliente" ? 2 : 1 // 1 = admin, 2 = cliente
      })

      if (result.success) {
        alert("Registro exitoso, ahora puedes iniciar sesión")
        router.push("/auth/login")
      } else {
        alert(result.message || "Error en el registro")
      }
    } catch (err) {
      console.error("Error en registro:", err)
      alert("Error en el servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
                  <UserPlus className="h-8 w-8 text-[#415444]" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-[#415444]">Crear cuenta</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Regístrate para acceder a ofertas exclusivas
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-6 pb-6">
                {/* Name Field */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nombre completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Juan Pérez"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="pl-10 border-gray-300 focus:border-[#415444] focus:ring-[#415444] rounded-[12px] h-12"
                    />
                  </div>
                </div>

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
                      placeholder="juan@papeleria.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
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
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
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

                {/* Confirm Password Field */}
                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="pl-10 pr-10 border-gray-300 focus:border-[#415444] focus:ring-[#415444] rounded-[12px] h-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
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
                      Creando cuenta...
                    </div>
                  ) : (
                    "Crear cuenta"
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link 
                      href="/auth/login" 
                      className="text-[#415444] hover:text-[#338838] font-medium transition-colors"
                    >
                      Inicia sesión aquí
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
            <Store className="h-16 w-16 text-[#415444]" />
          </div>
          <h3 className="text-2xl font-bold text-[#415444] mb-4">
            Únete a nuestra comunidad
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
             Accede a tu cuenta proporcionada por la papeleria para empezar gestionar.
          </p>
        </div>
      </aside>
    </div>
  )
}
