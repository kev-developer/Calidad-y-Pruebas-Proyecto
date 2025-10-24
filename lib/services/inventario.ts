import { ApiResponse, Inventario, Sucursal, MovimientoInventario, Descuento, InventarioCreate, Producto } from '@/lib/models';
import { productosService } from './productos';
import { fetchWithAuth } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export const inventarioService = {
    // Listar todas las sucursales
    async getSucursales(): Promise<ApiResponse<Sucursal[]>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/inventario/sucursales/`);
            const data = await response.json();

            // Si la respuesta es un array, asumimos que es exitosa
            if (Array.isArray(data)) {
                return { success: true, data };
            }
            // De lo contrario, retornamos la data tal cual (debe tener propiedad success)
            return data;
        } catch (error) {
            console.error('Error fetching sucursales:', error);
            return { success: false, message: 'Error al obtener sucursales' };
        }
    },

    // Crear nueva sucursal
    async createSucursal(sucursalData: Omit<Sucursal, 'idSucursal'>): Promise<ApiResponse<Sucursal>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/inventario/sucursales/`, {
                method: 'POST',
                body: JSON.stringify(sucursalData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating sucursal:', error);
            return { success: false, message: 'Error al crear sucursal' };
        }
    },

    // Listar todos los inventarios con datos enriquecidos
    async getInventarios(): Promise<ApiResponse<Inventario[]>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/inventario/inventarios/`);
            const data = await response.json();

            let inventariosData: any[] = [];

            // Si la respuesta es un array, asumimos que es exitosa
            if (Array.isArray(data)) {
                inventariosData = data;
            } else if (data.success && data.data) {
                // ApiResponse format
                inventariosData = data.data;
            } else {
                return { success: false, message: 'Error al obtener inventarios' };
            }

            // Enriquecer datos con información de productos y sucursales
            const enrichedInventarios = await Promise.all(
                inventariosData.map(async (inventarioItem) => {
                    try {
                        // Obtener información del producto usando el servicio
                        const productoResult = await productosService.getProducto(inventarioItem.idProducto);
                        let productoData: Producto | undefined;

                        if (productoResult.success && productoResult.data) {
                            productoData = productoResult.data;
                        }

                        // Obtener información de la sucursal
                        let sucursalData = { nombre: 'Sucursal desconocida' };

                        try {
                            const sucursalResponse = await fetchWithAuth(`${API_BASE_URL}/inventario/sucursales/${inventarioItem.idSucursal}`);
                            const sucursalResult = await sucursalResponse.json();

                            if (sucursalResult && typeof sucursalResult === 'object') {
                                if (sucursalResult.success && sucursalResult.data) {
                                    sucursalData = sucursalResult.data;
                                } else if (sucursalResult.nombre) {
                                    // Si el backend devuelve el objeto sucursal directamente
                                    sucursalData = sucursalResult;
                                }
                            }
                        } catch (sucursalError) {
                            console.error('Error fetching sucursal:', sucursalError);
                        }

                        return {
                            ...inventarioItem,
                            producto: productoData,
                            sucursal: sucursalData
                        };
                    } catch (error) {
                        console.error('Error enriching inventory data:', error);
                        return inventarioItem; // Retornar datos básicos si hay error
                    }
                })
            );

            return { success: true, data: enrichedInventarios };
        } catch (error) {
            console.error('Error fetching inventarios:', error);
            return { success: false, message: 'Error al obtener inventarios' };
        }
    },

    // Crear registro de inventario
    async createInventario(inventarioData: InventarioCreate): Promise<ApiResponse<Inventario>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/inventario/inventarios/`, {
                method: 'POST',
                body: JSON.stringify(inventarioData),
            });
            const data = await response.json();
            // Si la respuesta es un objeto de inventario, asumimos que es exitosa
            if (data && typeof data === 'object' && data.idInventario) {
                return { success: true, data };
            }
            // De lo contrario, retornamos la data tal cual (debe tener propiedad success)
            return data;
        } catch (error) {
            console.error('Error creating inventario:', error);
            return { success: false, message: 'Error al crear registro de inventario' };
        }
    },

    // Actualizar registro de inventario
    async updateInventario(id: number, inventarioData: InventarioCreate): Promise<ApiResponse<Inventario>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/inventario/inventarios/${id}`, {
                method: 'PUT',
                body: JSON.stringify(inventarioData),
            });
            const data = await response.json();
            // Si la respuesta es un objeto de inventario, asumimos que es exitosa
            if (data && typeof data === 'object' && data.idInventario) {
                return { success: true, data };
            }
            // De lo contrario, retornamos la data tal cual (debe tener propiedad success)
            return data;
        } catch (error) {
            console.error('Error updating inventario:', error);
            return { success: false, message: 'Error al actualizar registro de inventario' };
        }
    },

    // Eliminar registro de inventario
    async deleteInventario(id: number): Promise<ApiResponse<void>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/inventario/inventarios/${id}`, {
                method: 'DELETE',
            });
            // Para DELETE, el backend podría no retornar contenido
            if (response.status === 204 || response.status === 200) {
                return { success: true, message: 'Inventario eliminado correctamente' };
            }
            const data = await response.json();
            // Si hay data, retornamos con éxito
            if (data) {
                return { success: true, ...data };
            }
            return { success: true, message: 'Inventario eliminado correctamente' };
        } catch (error) {
            console.error('Error deleting inventario:', error);
            return { success: false, message: 'Error al eliminar registro de inventario' };
        }
    },

    // Listar movimientos de inventario con datos enriquecidos
    async getMovimientosInventario(): Promise<ApiResponse<any[]>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/inventario/movimientos/`);
            const data = await response.json();

            let movimientosData: any[] = [];

            // Si la respuesta es un array, asumimos que es exitosa
            if (Array.isArray(data)) {
                movimientosData = data;
            } else if (data.success && data.data) {
                // ApiResponse format
                movimientosData = data.data;
            } else {
                return { success: false, message: 'Error al obtener movimientos de inventario' };
            }

            // Enriquecer datos con información de inventario, productos y sucursales
            const enrichedMovimientos = await Promise.all(
                movimientosData.map(async (movimiento) => {
                    try {
                        // Obtener información del inventario
                        let inventarioData: Inventario | undefined;
                        try {
                            const inventarioResponse = await fetchWithAuth(`${API_BASE_URL}/inventario/inventarios/${movimiento.idInventario}`);
                            const inventarioResult = await inventarioResponse.json();

                            if (inventarioResult && typeof inventarioResult === 'object') {
                                if (inventarioResult.success && inventarioResult.data) {
                                    inventarioData = inventarioResult.data;
                                } else if (inventarioResult.idInventario) {
                                    // Si el backend devuelve el objeto inventario directamente
                                    inventarioData = inventarioResult;
                                }
                            }
                        } catch (inventarioError) {
                            console.error('Error fetching inventario:', inventarioError);
                        }

                        // Obtener información del producto si está disponible en el inventario
                        let productoData: Producto | undefined;
                        if (inventarioData?.idProducto) {
                            try {
                                const productoResult = await productosService.getProducto(inventarioData.idProducto);
                                if (productoResult.success && productoResult.data) {
                                    productoData = productoResult.data;
                                }
                            } catch (productoError) {
                                console.error('Error fetching producto:', productoError);
                            }
                        }

                        // Obtener información de la sucursal si está disponible en el inventario
                        let sucursalData: Sucursal | undefined;
                        if (inventarioData?.idSucursal) {
                            try {
                                const sucursalResponse = await fetchWithAuth(`${API_BASE_URL}/inventario/sucursales/${inventarioData.idSucursal}`);
                                const sucursalResult = await sucursalResponse.json();

                                if (sucursalResult && typeof sucursalResult === 'object') {
                                    if (sucursalResult.success && sucursalResult.data) {
                                        sucursalData = sucursalResult.data;
                                    } else if (sucursalResult.nombre) {
                                        // Si el backend devuelve el objeto sucursal directamente
                                        sucursalData = sucursalResult;
                                    }
                                }
                            } catch (sucursalError) {
                                console.error('Error fetching sucursal:', sucursalError);
                            }
                        }

                        // Calcular stock anterior y nuevo
                        const stockAnterior = (inventarioData?.stock || 0) - movimiento.cantidad;
                        const stockNuevo = inventarioData?.stock || 0;

                        // Mapear tipos de movimiento del backend al frontend
                        const tipoMovimientoMapeado = this.mapearTipoMovimiento(movimiento.tipoMovimiento);

                        return {
                            ...movimiento,
                            inventario: inventarioData,
                            producto: productoData,
                            sucursal: sucursalData,
                            stockAnterior,
                            stockNuevo,
                            fechaHora: movimiento.fecha,
                            motivo: movimiento.observacion || 'Sin observaciones',
                            tipoMovimiento: tipoMovimientoMapeado,
                            tipoMovimientoOriginal: movimiento.tipoMovimiento // Guardar original para referencia
                        };
                    } catch (error) {
                        console.error('Error enriching movimiento data:', error);
                        return movimiento; // Retornar datos básicos si hay error
                    }
                })
            );

            return { success: true, data: enrichedMovimientos };
        } catch (error) {
            console.error('Error fetching movimientos:', error);
            return { success: false, message: 'Error al obtener movimientos de inventario' };
        }
    },

    // Mapear tipos de movimiento del backend al frontend
    mapearTipoMovimiento(tipoBackend: string): string {
        // Normalizar el tipo: convertir a minúsculas y quitar espacios extras
        const tipoNormalizado = tipoBackend.toLowerCase().trim();

        // Mapear tipos específicos del backend a los nombres esperados en el frontend
        const mapeo: { [key: string]: string } = {
            'venta': 'venta',
            'ingreso': 'ingreso',
            'adicion': 'adicion',
            'disminucion': 'disminucion',
            'devolucion': 'devolucion',
            'ajuste_stock_minimo': 'ajuste_stock_minimo',
            'ajuste_stock_maximo': 'ajuste_stock_maximo',
            'remocion': 'remocion',
            'otro': 'otro'
        };

        return mapeo[tipoNormalizado] || tipoNormalizado;
    },

    // Registrar movimiento de inventario
    async createMovimientoInventario(movimientoData: Omit<MovimientoInventario, 'idMovimiento'>): Promise<ApiResponse<MovimientoInventario>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/inventario/movimientos/`, {
                method: 'POST',
                body: JSON.stringify(movimientoData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating movimiento:', error);
            return { success: false, message: 'Error al registrar movimiento de inventario' };
        }
    },

    // Listar descuentos
    async getDescuentos(): Promise<ApiResponse<Descuento[]>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/inventario/descuentos/`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching descuentos:', error);
            return { success: false, message: 'Error al obtener descuentos' };
        }
    },

    // Crear descuento
    async createDescuento(descuentoData: Omit<Descuento, 'idDescuento'>): Promise<ApiResponse<Descuento>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/inventario/descuentos/`, {
                method: 'POST',
                body: JSON.stringify(descuentoData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating descuento:', error);
            return { success: false, message: 'Error al crear descuento' };
        }
    },
};