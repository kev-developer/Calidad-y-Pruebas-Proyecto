import { ApiResponse, Inventario, Sucursal, MovimientoInventario, Descuento, InventarioCreate, Producto } from '@/lib/models';
import { productosService } from './productos';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export const inventarioService = {
    // Listar todas las sucursales
    async getSucursales(): Promise<ApiResponse<Sucursal[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/inventario/sucursales/`);
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
            const response = await fetch(`${API_BASE_URL}/inventario/sucursales/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            const response = await fetch(`${API_BASE_URL}/inventario/inventarios/`);
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
                            const sucursalResponse = await fetch(`${API_BASE_URL}/inventario/sucursales/${inventarioItem.idSucursal}`);
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
            const response = await fetch(`${API_BASE_URL}/inventario/inventarios/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            const response = await fetch(`${API_BASE_URL}/inventario/inventarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            const response = await fetch(`${API_BASE_URL}/inventario/inventarios/${id}`, {
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

    // Listar movimientos de inventario
    async getMovimientosInventario(): Promise<ApiResponse<MovimientoInventario[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/inventario/movimientos/`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching movimientos:', error);
            return { success: false, message: 'Error al obtener movimientos de inventario' };
        }
    },

    // Registrar movimiento de inventario
    async createMovimientoInventario(movimientoData: Omit<MovimientoInventario, 'idMovimiento'>): Promise<ApiResponse<MovimientoInventario>> {
        try {
            const response = await fetch(`${API_BASE_URL}/inventario/movimientos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            const response = await fetch(`${API_BASE_URL}/inventario/descuentos/`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching descuentos:', error);
            return { success: false, message: 'Error al obtener descuentos' };
        }
    },

    // Crear descuento
    async createDescuento(descuentoData: Omit<Descuento, 'idDescuento'>): Promise<ApiResponse<Descuento>> {
        try {
            const response = await fetch(`${API_BASE_URL}/inventario/descuentos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(descuentoData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating descuento:', error);
            return { success: false, message: 'Error al crear descuento' };
        }
    },
};