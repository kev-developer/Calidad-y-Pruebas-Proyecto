import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Demo en memoria — sustituir por DB real en producción
const fakeUsers = [
  { id: 1, email: "admin@demo.com", password_hash: bcrypt.hashSync("123456", 10), role: "empleado" },
  { id: 2, email: "cliente@demo.com", password_hash: bcrypt.hashSync("123456", 10), role: "cliente" },
]

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const user = fakeUsers.find((u) => u.email === email)
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET ?? "secret", {
    expiresIn: "8h",
  })

  return NextResponse.json({ token, role: user.role })
}
