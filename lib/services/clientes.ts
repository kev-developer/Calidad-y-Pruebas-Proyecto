import { ApiResponse, Cliente } from '@/lib/models';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export const clientesService = {
    // Listar todos los clientes
    async getClientes(): Promise<ApiResponse<Cliente[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/`);
            const data = await response.json();

            // Si la respuesta es un array, asumimos que es exitosa
            if (Array.isArray(data)) {
                return { success: true, data };
            }
            // De lo contrario, retornamos la data tal cual (debe tener propiedad success)
            return data;
        } catch (error) {
            console.error('Error fetching clientes:', error);
            return { success: false, message: 'Error al obtener clientes' };
        }
    },

    // Obtener cliente por ID
    async getClienteById(id: number): Promise<ApiResponse<Cliente>> {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching cliente:', error);
            return { success: false, message: 'Error al obtener cliente' };
        }
    },

    // Crear nuevo cliente
    async createCliente(clienteData: Omit<Cliente, 'idCliente'>): Promise<ApiResponse<Cliente>> {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteData),
            });
            const data = await response.json();
            // Si la respuesta es un objeto de cliente, asumimos que es exitosa
            if (data && typeof data === 'object' && data.idCliente) {
                return { success: true, data };
            }
            // De lo contrario, retornamos la data tal cual (debe tener propiedad success)
            return data;
        } catch (error) {
            console.error('Error creating cliente:', error);
            return { success: false, message: 'Error al crear cliente' };
        }
    },

    // Actualizar cliente
    async updateCliente(id: number, clienteData: Partial<Cliente>): Promise<ApiResponse<Cliente>> {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteData),
            });
            const data = await response.json();
            // Si la respuesta es un objeto de cliente, asumimos que es exitosa
            if (data && typeof data === 'object' && data.idCliente) {
                return { success: true, data };
            }
            // De lo contrario, retornamos la data tal cual (debe tener propiedad success)
            return data;
        } catch (error) {
            console.error('Error updating cliente:', error);
            return { success: false, message: 'Error al actualizar cliente' };
        }
    },

    // Eliminar cliente
    async deleteCliente(id: number): Promise<ApiResponse<null>> {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
                method: 'DELETE',
            });
            // Para DELETE, el backend podría no retornar contenido
            if (response.status === 204 || response.status === 200) {
                return { success: true, message: 'Cliente eliminado correctamente' };
            }
            const data = await response.json();
            // Si hay data, retornamos con éxito
            if (data) {
                return { success: true, ...data };
            }
            return { success: true, message: 'Cliente eliminado correctamente' };
        } catch (error) {
            console.error('Error deleting cliente:', error);
            return { success: false, message: 'Error al eliminar cliente' };
        }
    },
};