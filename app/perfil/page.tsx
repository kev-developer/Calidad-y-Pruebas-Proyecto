"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Save, Camera } from "lucide-react"
import { authService } from "@/lib/services/auth"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/ui/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { bytesToImageUrl } from "@/lib/utils"

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await authService.getCurrentUser()
        if (result.success && result.data) {
          setProfileData({
            name: result.data.nombre || "",
            email: result.data.email || "",
          })
          // Convertir bytes de la foto de perfil a URL si existe
          if (result.data.foto_perfil) {
            const imageUrl = bytesToImageUrl(result.data.foto_perfil)
            setAvatarUrl(imageUrl)
          }
        } else {
          alert("Error al cargar los datos del usuario")
          router.push('/')
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        alert("Error al cargar los datos del usuario")
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida')
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB')
        return
      }

      // Crear URL temporal para previsualización
      const objectUrl = URL.createObjectURL(file)
      setAvatarUrl(objectUrl)

      // Convertir archivo a base64 y actualizar perfil
      const reader = new FileReader()
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64String = event.target.result as string
          try {
            setSaving(true)
            const result = await authService.updateProfile({
              foto_perfil: base64String
            })
            if (result.success) {
              alert('Foto de perfil actualizada correctamente')
            } else {
              alert(result.message || 'Error al actualizar la foto de perfil')
              // Revertir la previsualización si falla
              setAvatarUrl(null)
            }
          } catch (error) {
            console.error("Error updating profile picture:", error)
            alert('Error al actualizar la foto de perfil')
            setAvatarUrl(null)
          } finally {
            setSaving(false)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const result = await authService.updateProfile({
        nombre: profileData.name,
        email: profileData.email
      })
      
      if (result.success) {
        alert("Perfil actualizado correctamente")
        // Actualizar datos locales si es necesario
        if (result.data) {
          setProfileData({
            name: result.data.nombre || "",
            email: result.data.email || "",
          })
        }
      } else {
        alert(result.message || "Error al actualizar el perfil")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Error al actualizar el perfil")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Cargando perfil...</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex items-center gap-4">
            <User className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-serif font-bold">Mi Perfil</h1>
              <p className="text-muted-foreground">Gestiona tu información personal</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-1 max-w-2xl">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>Actualiza tu información personal y foto de perfil</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <Avatar
                        className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleAvatarClick}
                      >
                        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Usuario" />
                        <AvatarFallback className="text-lg">
                          {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer hover:bg-primary/90 transition-colors">
                        <Camera className="h-4 w-4 text-white" />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
