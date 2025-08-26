"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash2, Tag } from "lucide-react"

const mockCategories = [
  { id: 1, name: "Escolares", description: "Productos para estudiantes", productCount: 45 },
  { id: 2, name: "Útiles", description: "Útiles de escritorio", productCount: 32 },
  { id: 3, name: "Libros", description: "Literatura y textos", productCount: 28 },
  { id: 4, name: "Arte", description: "Materiales artísticos", productCount: 15 },
  { id: 5, name: "Oficina", description: "Suministros de oficina", productCount: 22 },
  { id: 6, name: "Combos", description: "Paquetes de productos", productCount: 8 },
]

const mockBrands = [
  { id: 1, name: "Norma", productCount: 25 },
  { id: 2, name: "BIC", productCount: 18 },
  { id: 3, name: "Faber-Castell", productCount: 12 },
  { id: 4, name: "Pilot", productCount: 8 },
]

const mockAuthors = [
  { id: 1, name: "Gabriel García Márquez", productCount: 3 },
  { id: 2, name: "Mario Vargas Llosa", productCount: 2 },
  { id: 3, name: "Isabel Allende", productCount: 4 },
]

const mockPublishers = [
  { id: 1, name: "Editorial Sudamericana", productCount: 8 },
  { id: 2, name: "Planeta", productCount: 6 },
  { id: 3, name: "Alfaguara", productCount: 5 },
]

export function CategoryManager() {
  const [categories, setCategories] = useState(mockCategories)
  const [brands, setBrands] = useState(mockBrands)
  const [authors, setAuthors] = useState(mockAuthors)
  const [publishers, setPublishers] = useState(mockPublishers)

  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [newBrand, setNewBrand] = useState("")
  const [newAuthor, setNewAuthor] = useState("")
  const [newPublisher, setNewPublisher] = useState("")

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      setCategories([
        ...categories,
        {
          id: Date.now(),
          name: newCategory.name,
          description: newCategory.description,
          productCount: 0,
        },
      ])
      setNewCategory({ name: "", description: "" })
    }
  }

  const handleAddBrand = () => {
    if (newBrand.trim()) {
      setBrands([
        ...brands,
        {
          id: Date.now(),
          name: newBrand,
          productCount: 0,
        },
      ])
      setNewBrand("")
    }
  }

  const handleAddAuthor = () => {
    if (newAuthor.trim()) {
      setAuthors([
        ...authors,
        {
          id: Date.now(),
          name: newAuthor,
          productCount: 0,
        },
      ])
      setNewAuthor("")
    }
  }

  const handleAddPublisher = () => {
    if (newPublisher.trim()) {
      setPublishers([
        ...publishers,
        {
          id: Date.now(),
          name: newPublisher,
          productCount: 0,
        },
      ])
      setNewPublisher("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categorías
          </CardTitle>
          <CardDescription>Gestiona las categorías de productos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Nombre de la categoría"
                value={newCategory.name}
                onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Descripción"
                value={newCategory.description}
                onChange={(e) => setNewCategory((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{category.productCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle>Marcas</CardTitle>
          <CardDescription>Gestiona las marcas de productos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Nombre de la marca" value={newBrand} onChange={(e) => setNewBrand(e.target.value)} />
            <Button onClick={handleAddBrand}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between p-2 border rounded">
                <span>{brand.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{brand.productCount}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Authors and Publishers */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Autores</CardTitle>
            <CardDescription>Para libros y publicaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Nombre del autor" value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} />
              <Button onClick={handleAddAuthor}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {authors.map((author) => (
                <div key={author.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{author.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {author.productCount}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Editoriales</CardTitle>
            <CardDescription>Para libros y publicaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nombre de la editorial"
                value={newPublisher}
                onChange={(e) => setNewPublisher(e.target.value)}
              />
              <Button onClick={handleAddPublisher}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {publishers.map((publisher) => (
                <div key={publisher.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{publisher.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {publisher.productCount}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
