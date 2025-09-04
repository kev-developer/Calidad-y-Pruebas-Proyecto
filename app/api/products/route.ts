// app/api/products/route.ts
import { NextResponse } from "next/server"

const products = [
  {
    id: 1,
    name: "Cuaderno Universitario 100 hojas",
    category: "Escolares",
    price: 4.0,
    brand: "Norma",
    imageUrl: "/images/cuaderno.jpg",
    author: "",
  },
  {
    id: 2,
    name: "Bolígrafo BIC Azul",
    category: "Útiles",
    price: 1.5,
    brand: "BIC",
    imageUrl: "/images/boligrafo.jpg",
    author: "",
  },
  {
    id: 3,
    name: "Cien Años de Soledad",
    category: "Libros",
    price: 25.0,
    author: "Gabriel García Márquez",
    imageUrl: "/images/cien-anos.jpg",
    brand: "",
  },
  {
    id: 4,
    name: "Kit Escolar Básico",
    category: "Combos",
    price: 20.0,
    brand: "Varios",
    imageUrl: "/images/kit.jpg",
    author: "",
  },
]

export async function GET() {
  return NextResponse.json(products)
}
