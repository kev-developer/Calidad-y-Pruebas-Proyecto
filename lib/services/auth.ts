import { ApiResponse, Usuario } from '@/lib/models';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// Interceptor para agregar token JWT a las solicitudes
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Si el token es inválido o expiró, redirigir al login
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
        throw new Error('Token expirado o inválido');
    }

    return response;
};

export const authService = {
    // Login con JWT - CORREGIDO
    async login(username: string, password: string): Promise<ApiResponse<{ access_token: string; token_type: string }>> {
        try {
            // Usar FormData en lugar de JSON
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.detail || 'Error al iniciar sesión'
                };
            }

            // Guardar token en localStorage
            localStorage.setItem('token', data.access_token);

            // Obtener y guardar información del usuario inmediatamente después del login
            try {
                const userResponse = await authService.getCurrentUser();
                if (userResponse.success && userResponse.data) {
                    // Disparar evento personalizado para notificar el cambio de autenticación
                    window.dispatchEvent(new CustomEvent('authStateChange', {
                        detail: { authenticated: true, user: userResponse.data }
                    }));
                }
            } catch (error) {
                console.error('Error obteniendo usuario después del login:', error);
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error en login:', error);
            return {
                success: false,
                message: 'Error de conexión al servidor'
            };
        }
    },

    // Registro con JWT
    async register(userData: {
        nombre: string;
        email: string;
        contraseña: string;
        idRol: number;
    }): Promise<ApiResponse<Usuario>> {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.detail || 'Error al registrar usuario'
                };
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error en registro:', error);
            return {
                success: false,
                message: 'Error de conexión al servidor'
            };
        }
    },

    // Obtener información del usuario actual
    async getCurrentUser(): Promise<ApiResponse<Usuario>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.detail || 'Error al obtener información del usuario'
                };
            }

            // Guardar información del usuario en localStorage
            localStorage.setItem('user', JSON.stringify(data));

            return { success: true, data };
        } catch (error) {
            console.error('Error obteniendo usuario actual:', error);
            return {
                success: false,
                message: 'Error de conexión al servidor'
            };
        }
    },

    // Actualizar perfil del usuario (incluyendo foto de perfil)
    async updateProfile(userData: {
        nombre?: string;
        email?: string;
        contraseña?: string;
        idRol?: number;
        foto_perfil?: string; // Base64 string
    }): Promise<ApiResponse<Usuario>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`, {
                method: 'PUT',
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.detail || 'Error al actualizar perfil'
                };
            }

            // Actualizar información del usuario en localStorage
            localStorage.setItem('user', JSON.stringify(data));

            return { success: true, data };
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            return {
                success: false,
                message: 'Error de conexión al servidor'
            };
        }
    },

    // Cambiar contraseña
    async changePassword(passwordData: {
        old_password: string;
        new_password: string;
    }): Promise<ApiResponse<void>> {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/auth/change-password`, {
                method: 'POST',
                body: JSON.stringify(passwordData),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.detail || 'Error al cambiar contraseña'
                };
            }

            return { success: true, message: 'Contraseña cambiada exitosamente' };
        } catch (error) {
            console.error('Error cambiando contraseña:', error);
            return {
                success: false,
                message: 'Error de conexión al servidor'
            };
        }
    },

    // Cerrar sesión
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/catalogo';
    },

    // Verificar si el usuario está autenticado
    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    },

    // Obtener información del usuario desde localStorage
    getStoredUser(): Usuario | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                return null;
            }
        }
        return null;
    },

    // Obtener token desde localStorage
    getToken(): string | null {
        return localStorage.getItem('token');
    },
};

// Exportar fetchWithAuth para usar en otros servicios
export { fetchWithAuth };