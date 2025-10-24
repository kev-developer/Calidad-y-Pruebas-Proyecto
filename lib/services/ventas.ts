import { ApiResponse, Venta, DetalleVenta, DetalleVentaCreate } from '@/lib/models';
import { fetchWithAuth } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export const ventasService = {
    // Listar todas las ventas
    async getVentas(): Promise<ApiResponse<Venta[]>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/ventas/`);
            const data = await response.json();

            // Si la respuesta es un array, asumimos que es exitosa
            if (Array.isArray(data)) {
                return { success: true, data };
            }
            // De lo contrario, retornamos la data tal cual (debe tener propiedad success)
            return data;
        } catch (error) {
            console.error('Error fetching ventas:', error);
            return { success: false, message: 'Error al obtener ventas' };
        }
    },

    // Obtener venta por ID
    async getVentaById(id: number): Promise<ApiResponse<Venta>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/ventas/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching venta:', error);
            return { success: false, message: 'Error al obtener venta' };
        }
    },

    // Crear nueva venta
    async createVenta(ventaData: Omit<Venta, 'idVenta'>): Promise<ApiResponse<Venta>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/ventas/`, {
                method: 'POST',
                body: JSON.stringify(ventaData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating venta:', error);
            return { success: false, message: 'Error al crear venta' };
        }
    },

    // Crear venta completa con manejo de inventario
    async createVentaCompleta(ventaData: {
        venta_data: {
            idCliente: number;
            idUsuario: number;
            idSucursal: number;
            total: number;
        };
        detalles: Array<{
            idProducto: number;
            cantidad: number;
            precioUnitario: number;
            descuentoAplicado?: number;
        }>;
    }): Promise<ApiResponse<{
        venta: Venta;
        detalles: DetalleVenta[];
        message: string;
    }>> {
        try {
            console.log('Enviando datos de venta:', JSON.stringify(ventaData, null, 2));

            const response = await fetchWithAuth(`${API_BASE_URL}/ventas/completa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ventaData),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Error del backend - Status:', response.status, 'Data:', data);
                return {
                    success: false,
                    message: data.detail || `Error HTTP ${response.status} al procesar la venta`
                };
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error creating venta completa:', error);
            return {
                success: false,
                message: 'Error de conexión al procesar la venta'
            };
        }
    },

    // Actualizar venta
    async updateVenta(id: number, ventaData: Partial<Venta>): Promise<ApiResponse<Venta>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/ventas/${id}`, {
                method: 'PUT',
                body: JSON.stringify(ventaData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating venta:', error);
            return { success: false, message: 'Error al actualizar venta' };
        }
    },

    // Eliminar venta
    async deleteVenta(id: number): Promise<ApiResponse<null>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/ventas/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting venta:', error);
            return { success: false, message: 'Error al eliminar venta' };
        }
    },

    // Obtener detalles de venta
    async getVentaDetalles(id: number): Promise<ApiResponse<DetalleVenta[]>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/ventas/${id}/detalles`);

            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status} for venta ID: ${id}`);
                return { success: false, message: `Error HTTP ${response.status} al obtener detalles de venta` };
            }

            const data = await response.json();

            // Si la respuesta es un array, asumimos que es exitosa (formato directo del backend)
            if (Array.isArray(data)) {
                return { success: true, data };
            }

            // Si es un objeto con propiedad success, retornamos tal cual
            if (data && typeof data === 'object' && 'success' in data) {
                return data;
            }

            console.error('Formato de respuesta inesperado para detalles de venta:', data);
            return { success: false, message: 'Formato de respuesta inesperado al obtener detalles de venta' };
        } catch (error) {
            console.error('Error fetching venta detalles:', error);
            return { success: false, message: 'Error al obtener detalles de venta' };
        }
    },

    // Agregar detalle a venta
    async addVentaDetalle(id: number, detalleData: DetalleVentaCreate): Promise<ApiResponse<DetalleVenta>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/ventas/${id}/detalles`, {
                method: 'POST',
                body: JSON.stringify(detalleData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding venta detalle:', error);
            return { success: false, message: 'Error al agregar detalle a venta' };
        }
    },
};