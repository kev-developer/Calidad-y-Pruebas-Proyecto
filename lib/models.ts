// User and Role Models
export interface RolUsuario {
  idRol: number
  nombreRol: string
}

export interface Usuario {
  idUsuario: number
  nombre: string
  email: string
  contraseña: string
  idRol: number | null
  foto_perfil?: string | null
}

// Client Models
export interface Cliente {
  idCliente: number
  nombre: string | null
  dni: string | null
  tipoCliente: "Minorista" | "Mayorista" | "Institucional"
  puntos: number
  email: string | null
  idPrograma: number | null
}

export interface ClienteCreate {
  nombre?: string
  dni?: string
  tipoCliente: "Minorista" | "Mayorista" | "Institucional"
  email?: string
  idPrograma?: number
}

export interface ClienteUpdate {
  nombre?: string
  dni?: string
  tipoCliente?: "Minorista" | "Mayorista" | "Institucional"
  email?: string
  puntos?: number
  idPrograma?: number
}

// Supplier Models
export interface Proveedor {
  idProveedor: number
  nombre: string
  contacto: string | null
  telefono: string | null
  email: string | null
}

export interface ProveedorCreate {
  nombre: string
  contacto?: string
  telefono?: string
  email?: string
}

export interface ProveedorUpdate {
  nombre?: string
  contacto?: string
  telefono?: string
  email?: string
}

// Product and Category Models
export interface Categoria {
  idCategoria: number
  nombre: string
}

export interface Producto {
  idProducto: number
  nombre: string
  descripcion: string | null
  precio: number
  idCategoria: number | null
  categoria?: Categoria
  imagen?: string
}

export interface ProductoCreate {
  nombre: string
  descripcion?: string
  precio: number
  idCategoria?: number
  imagen?: string
}

export interface ProductoUpdate {
  nombre?: string
  descripcion?: string
  precio?: number
  idCategoria?: number
  imagen?: string
}

// Inventory Models
export interface Sucursal {
  idSucursal: number
  nombre: string
  direccion: string
}

export interface Inventario {
  idInventario: number
  idSucursal: number
  idProducto: number
  stock: number
  stockMinimo: number
  producto?: Producto
  sucursal?: Sucursal
}

export interface InventarioCreate {
  idSucursal: number
  idProducto: number
  stock: number
  stockMinimo?: number
}

export interface InventarioUpdate {
  stock?: number
  stockMinimo?: number
}

export interface MovimientoInventario {
  idMovimiento: number
  idInventario: number
  tipoMovimiento: "Venta" | "Compra" | "Ajuste" | "Devolución"
  cantidad: number
  fecha: string
  observacion: string | null
}

// Sales Models
export interface Venta {
  idVenta: number
  idCliente: number
  idUsuario: number
  fecha: string
  total: number
  cliente?: Cliente
  usuario?: Usuario
  detalles?: DetalleVenta[]
}

export interface VentaCreate {
  idCliente: number
  idUsuario: number
  detalles: DetalleVentaCreate[]
}

export interface DetalleVenta {
  idDetalleVenta: number
  idVenta: number
  idProducto: number
  cantidad: number
  precioUnitario: number
  descuentoAplicado: number
  producto?: Producto
}

export interface DetalleVentaCreate {
  idProducto: number
  cantidad: number
  precioUnitario: number
  descuentoAplicado?: number
}

// Purchase Models
export interface Compra {
  idCompra: number
  idProveedor: number
  idUsuario: number
  fecha: string
  total: number
  proveedor?: Proveedor
  usuario?: Usuario
  detalles?: DetalleCompra[]
}

export interface CompraCreate {
  idProveedor: number
  idUsuario: number
  detalles: DetalleCompraCreate[]
}

export interface DetalleCompra {
  idDetalleCompra: number
  idCompra: number
  idProducto: number
  cantidad: number
  precioUnitario: number
  producto?: Producto
}

export interface DetalleCompraCreate {
  idProducto: number
  cantidad: number
  precioUnitario: number
}

// Discount Models
export interface Descuento {
  idDescuento: number
  idProducto: number
  porcentaje: number
  fechaInicio: string
  fechaFin: string
  estado: boolean
  producto?: Producto
}

// Loyalty Program Models
export interface ProgramaFidelizacion {
  idPrograma: number
  puntosPorSol: number
  mesesDuracion: number
}

export interface Recompensa {
  idRecompensa: number
  titulo: string
  puntosRequeridos: number
  descripcion: string | null
  estado: boolean
  idPrograma: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalVentas: number
  ventasHoy: number
  totalClientes: number
  productosStock: number
  productosStockBajo: number
  ventasMes: VentaMensual[]
  topProductos: ProductoVendido[]
  clientesRecientes: Cliente[]
}

export interface VentaMensual {
  mes: string
  total: number
  cantidad: number
}

export interface ProductoVendido {
  producto: Producto
  cantidadVendida: number
  totalVentas: number
}





