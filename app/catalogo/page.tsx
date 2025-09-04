"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type Product = {
  id: number
  name: string
  category: string
  price: number | string
  imageUrl: string
  blurDataURL?: string
  author?: string   // 👈 lo agregamos
  brand?: string 
}

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (mounted) setProducts(data)
      })
      .catch(console.error)
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div className="p-6 text-center">Cargando...</div>

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Papelería Pro</h1>
          <nav className="flex gap-6">
            <Link href="/catalogo" className="hover:underline">
              Catálogo
            </Link>
            <Link href="/ofertas" className="hover:underline">
              Ofertas
            </Link>
            <Link href="/contacto" className="hover:underline">
              Contacto
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (manteniendo estilo anterior) */}
        <aside className="hidden md:block w-64 bg-gray-100 p-6 border-r">
          <h2 className="text-lg font-semibold mb-4">Categorías</h2>
          <ul className="space-y-2">
            <li><Link href="/catalogo?cat=escolares">Escolares</Link></li>
            <li><Link href="/catalogo?cat=oficina">Oficina</Link></li>
            <li><Link href="/catalogo?cat=arte">Arte</Link></li>
            <li><Link href="/catalogo?cat=libros">Libros</Link></li>
          </ul>

          <div className="mt-8">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <p className="text-sm mt-2 text-muted-foreground">
              📧 info@papeleriapro.com <br />
              📞 +51 999 888 777
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold">Ofertas</h3>
            <p className="text-sm text-muted-foreground">¡Aprovecha descuentos especiales!</p>
          </div>
        </aside>

        {/* Catálogo principal con imágenes */}
        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold mb-6">Catálogo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-lg shadow border flex flex-col">
                {/* Imagen del producto */}
                {p.imageUrl && (
                  <div className="relative w-full h-40 mb-3">
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
                  </div>
                )}
                {/* Info del producto */}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.category}</p>
                {(p.author || p.brand) && (
                  <p className="text-sm text-muted-foreground">
                    Marca/Autor: {p.author || p.brand}
                  </p>
                )}
                <p className="mt-2 font-bold">${p.price}</p>
                <span className="mt-2 inline-block bg-black text-white text-xs px-2 py-1 rounded">
                  Disponible
                </span>
              </div>
            ))}
          </div>

        </main>
      </div>

      {/* Footer con botón de login */}
      <footer className="bg-gray-200 py-4 mt-6">
        <div className="container mx-auto flex justify-center">
          <Link href="/auth/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}
