import { ApiResponse, Producto, Categoria, ProductoCreate, ProductoUpdate } from '@/lib/models';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export const productosService = {
    // Listar todos los productos
    async getProductos(): Promise<ApiResponse<Producto[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/`);
            const data = await response.json();

            // Si la respuesta es un array, asumimos que es exitosa
            if (Array.isArray(data)) {
                return { success: true, data };
            }
            // De lo contrario, retornamos la data tal cual (debe tener propiedad success)
            return data;
        } catch (error) {
            console.error('Error fetching productos:', error);
            return { success: false, message: 'Error al obtener productos' };
        }
    },

    // Obtener producto por ID
    async getProducto(id: number): Promise<ApiResponse<Producto>> {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/${id}`);
            const data = await response.json();


            // Si la respuesta es un objeto con propiedades de producto, asumimos que es exitosa
            if (data && typeof data === 'object' && data.hasOwnProperty('idProducto')) {
                return { success: true, data };
            }
            // Si tiene formato ApiResponse, retornamos tal cual
            if (data.success && data.data) {
                return data;
            }
            // De lo contrario, error
            return { success: false, message: 'Formato de respuesta inválido' };
        } catch (error) {
            console.error('Error fetching producto:', error);
            return { success: false, message: 'Error al obtener producto' };
        }
    },

    // Crear nuevo producto
    async createProducto(productoData: ProductoCreate): Promise<ApiResponse<Producto>> {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productoData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating producto:', error);
            return { success: false, message: 'Error al crear producto' };
        }
    },

    // Actualizar producto
    async updateProducto(id: number, productoData: ProductoUpdate): Promise<ApiResponse<Producto>> {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productoData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating producto:', error);
            return { success: false, message: 'Error al actualizar producto' };
        }
    },

    // Eliminar producto
    async deleteProducto(id: number): Promise<ApiResponse<void>> {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting producto:', error);
            return { success: false, message: 'Error al eliminar producto' };
        }
    },

    // Listar todas las categorías
    async getCategorias(): Promise<ApiResponse<Categoria[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/categorias/`);
            const data = await response.json();
            // Si la respuesta es un array, asumimos que es exitosa
            if (Array.isArray(data)) {
                return { success: true, data };
            }
            // De lo contrario, retornamos la data tal cual (debe tener propiedad success)
            return data;
        } catch (error) {
            console.error('Error fetching categorias:', error);
            return { success: false, message: 'Error al obtener categorías' };
        }
    },

    // Obtener categoría por ID
    async getCategoria(id: number): Promise<ApiResponse<Categoria>> {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/categorias/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching categoria:', error);
            return { success: false, message: 'Error al obtener categoría' };
        }
    },

    // Crear nueva categoría
    async createCategoria(categoriaData: Omit<Categoria, 'idCategoria'>): Promise<ApiResponse<Categoria>> {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/categorias/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoriaData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating categoria:', error);
            return { success: false, message: 'Error al crear categoría' };
        }
    },

    // Actualizar categoría
    async updateCategoria(id: number, categoriaData: Partial<Categoria>): Promise<ApiResponse<Categoria>> {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/categorias/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoriaData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating categoria:', error);
            return { success: false, message: 'Error al actualizar categoría' };
        }
    },

    // Eliminar categoría
    async deleteCategoria(id: number): Promise<ApiResponse<void>> {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/categorias/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting categoria:', error);
            return { success: false, message: 'Error al eliminar categoría' };
        }
    },
};