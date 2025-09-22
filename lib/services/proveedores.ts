import { ApiResponse, Proveedor } from '@/lib/models';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export const proveedoresService = {
    // Listar todos los proveedores
    async getProveedores(): Promise<ApiResponse<Proveedor[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/proveedores/`);
            const data = await response.json();

            // Si la respuesta es un array, asumimos que es exitosa
            if (Array.isArray(data)) {
                return { success: true, data };
            }
            // De lo contrario, retornamos la data tal cual (debe tener propiedad success)
            return data;
        } catch (error) {
            console.error('Error fetching proveedores:', error);
            return { success: false, message: 'Error al obtener proveedores' };
        }
    },

    // Obtener proveedor por ID
    async getProveedorById(id: number): Promise<ApiResponse<Proveedor>> {
        try {
            const response = await fetch(`${API_BASE_URL}/proveedores/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching proveedor:', error);
            return { success: false, message: 'Error al obtener proveedor' };
        }
    },

    // Crear nuevo proveedor
    async createProveedor(proveedorData: Omit<Proveedor, 'idProveedor'>): Promise<ApiResponse<Proveedor>> {
        try {
            const response = await fetch(`${API_BASE_URL}/proveedores/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(proveedorData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating proveedor:', error);
            return { success: false, message: 'Error al crear proveedor' };
        }
    },

    // Actualizar proveedor
    async updateProveedor(id: number, proveedorData: Partial<Proveedor>): Promise<ApiResponse<Proveedor>> {
        try {
            const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(proveedorData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating proveedor:', error);
            return { success: false, message: 'Error al actualizar proveedor' };
        }
    },

    // Eliminar proveedor
    async deleteProveedor(id: number): Promise<ApiResponse<null>> {
        try {
            const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting proveedor:', error);
            return { success: false, message: 'Error al eliminar proveedor' };
        }
    },
};