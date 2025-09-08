// Tipos base comunes
export type Decimal = number;
export type DateString = string; // Formato: YYYY-MM-DD
export type DateTimeString = string; // Formato: YYYY-MM-DDTHH:MM:SSZ

// Comprobante
export interface ComprobantePost {
  Id_venta: number;
  tipo_comprobante: string;
  fecha_emision: DateString;
  total: Decimal;
}

export interface ComprobanteGet extends ComprobantePost {
  Id_comprobante: number;
}

// Venta
export interface VentaPost {
  Id_cliente: number;
  fecha_venta: DateString;
  total: Decimal;
  estado: string;
}

export interface VentaGet extends VentaPost {
  Id_venta: number;
}

// VentaCredito
export interface VentaCreditoPost {
  Id_venta: number;
  monto_pendiente: Decimal;
  fecha_vencimiento: DateString;
  intereses: Decimal;
}

export interface VentaCreditoGet extends VentaCreditoPost {
  Id_venta_credito: number;
}

// Cliente
export interface ClientePost {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  Id_tipo_cliente: number;
}

export interface ClienteGet extends ClientePost {
  Id_cliente: number;
}

// DetalleVenta
export interface DetalleVentaPost {
  Id_venta: number;
  Id_producto: number;
  cantidad: number;
  precio_unitario: Decimal;
}

export interface DetalleVentaGet extends DetalleVentaPost {
  Id_detalle_venta: number;
}

// PuntosFidelizacion
export interface PuntosFidelizacionPost {
  Id_cliente: number;
  puntos_acumulados: number;
  fecha_actualizacion: DateString;
}

export interface PuntosFidelizacionGet extends PuntosFidelizacionPost {
  Id_punto_fidelizacion: number;
}

// TipoCliente
export interface TipoClientePost {
  nombre_tipo: string;
  descripcion: string;
}

export interface TipoClienteGet extends TipoClientePost {
  Id_tipo_cliente: number;
}

// Producto
export interface ProductoPost {
  nombre: string;
  descripcion: string;
  precio: Decimal;
  stock: number;
  id_marca: number;
  fecha_creacion: DateString;
  activo: boolean;
}

export interface ProductoGet extends ProductoPost {
  Id_producto: number;
}

// Marca
export interface MarcaPost {
  nombre: string;
}

export interface MarcaGet extends MarcaPost {
  Id_marca: number;
}

// ProductoControlPaquete
export interface ProductoControlPaquetePost {
  Id_producto: number;
  Id_control_paquete: number;
  cantidad: number;
}

export interface ProductoControlPaqueteGet extends ProductoControlPaquetePost {
  Id_producto_control_paquete: number;
}

// DetalleCompra
export interface DetalleCompraPost {
  Id_compra: number;
  Id_producto: number;
  cantidad: number;
  precio_unitario: Decimal;
}

export interface DetalleCompraGet extends DetalleCompraPost {
  Id_detalle_compra: number;
}

// RecepcionParcial
export interface RecepcionParcialPost {
  Id_compra: number;
  fecha_recepcion: DateString;
  cantidad_recibida: number;
}

export interface RecepcionParcialGet extends RecepcionParcialPost {
  Id_recepcion_parcial: number;
}

// Compra
export interface CompraPost {
  Id_proveedor: number;
  fecha_compra: DateString;
  total: Decimal;
  estado: boolean;
}

export interface CompraGet extends CompraPost {
  Id_compra: number;
}

// DocumentoCompra
export interface DocumentoCompraPost {
  Id_compra: number;
  tipo_documento: string;
  numero_documento: string;
  fecha_emision: DateString;
}

export interface DocumentoCompraGet extends DocumentoCompraPost {
  Id_documento_compra: number;
}

// Proveedor
export interface ProveedorPost {
  nombre_empresa: string;
  contacto: string;
  telefono: string;
  email: string;
}

export interface ProveedorGet extends ProveedorPost {
  Id_proveedor: number;
}

// EvaluacionProveedor
export interface EvaluacionProveedorPost {
  Id_proveedor: number;
  fecha_evaluacion: DateString;
  puntuacion: number;
  comentarios: string;
}

export interface EvaluacionProveedorGet extends EvaluacionProveedorPost {
  Id_evaluacion: number;
}

// Auditoria
export interface AuditoriaPost {
  Id_usuario: number;
  fecha_hora: DateTimeString;
  accion: string;
  detalle: string;
}

export interface AuditoriaGet extends AuditoriaPost {
  Id_auditoria: number;
}

// PedidoReposicion
export interface PedidoReposicionPost {
  Id_proveedor: number;
  fecha_pedido: DateString;
  fecha_entrega: DateString;
  estado: string;
}

export interface PedidoReposicionGet extends PedidoReposicionPost {
  Id_pedido_reposicion: number;
}

// Usuario
export interface UsuarioPost {
  Id_rol: number;
  nombre_usuario: string;
  password: string;
  email: string;
  activo: boolean;
}

export interface UsuarioGet extends UsuarioPost {
  Id_usuario: number;
}

// Rol
export interface RolPost {
  nombre_rol: string;
  descripcion: string;
}

export interface RolGet extends RolPost {
  Id_rol: number;
}

// Funciones de utilidad para hacer peticiones
export const apiClient = {
  // Ejemplo para productos
  productos: {
    crear: async (producto: ProductoPost): Promise<ProductoGet> => {
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }
      
      return response.json();
    },
    
    obtenerTodos: async (): Promise<ProductoGet[]> => {
      const response = await fetch('/api/productos');
      
      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }
      
      return response.json();
    },
    
    obtenerPorId: async (id: number): Promise<ProductoGet> => {
      const response = await fetch(`/api/productos/${id}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener el producto');
      }
      
      return response.json();
    },
    
    actualizar: async (id: number, producto: ProductoPost): Promise<ProductoGet> => {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(producto),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
      }
      
      return response.json();
    },
    
    eliminar: async (id: number): Promise<void> => {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }
    }
  },
  
  // Puedes agregar métodos similares para las demás entidades
  // clientes: { ... },
  // ventas: { ... },
  // etc.
};