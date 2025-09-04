import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// ⚠️ Solo de prueba: en producción deberías usar tu base de datos real
const users: any[] = []

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, role } = body // role puede ser "cliente" o "empleado"

    if (!email || !password || !role) {
      return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const userExists = users.find((u) => u.email === email)
    if (userExists) {
      return NextResponse.json({ message: "El usuario ya está registrado" }, { status: 400 })
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Guardar nuevo usuario (simulación en memoria)
    const newUser = { id: Date.now(), email, password: hashedPassword, role }
    users.push(newUser)

    return NextResponse.json(
      { message: "Usuario registrado correctamente", user: { id: newUser.id, email: newUser.email, role: newUser.role } },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json({ message: "Error interno en el registro" }, { status: 500 })
  }
}
