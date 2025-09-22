import { ApiResponse, Venta, Cliente, Inventario, Producto, Compra, DashboardStats } from '@/lib/models';
import { ventasService } from './ventas';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export const reportesService = {
    // Obtener estadísticas del dashboard
    async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
        try {

            const [ventasResponse, clientesResponse, inventarioResponse, productosResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/ventas/`),
                fetch(`${API_BASE_URL}/clientes/`),
                fetch(`${API_BASE_URL}/inventario/inventarios/`),
                fetch(`${API_BASE_URL}/productos/`)
            ]);

            const ventasData = await ventasResponse.json();
            const clientesData = await clientesResponse.json();
            const inventarioData = await inventarioResponse.json();
            const productosData = await productosResponse.json();


            const ventas = Array.isArray(ventasData) ? ventasData : ventasData.data || [];
            const clientes = Array.isArray(clientesData) ? clientesData : clientesData.data || [];
            const inventarios = Array.isArray(inventarioData) ? inventarioData : inventarioData.data || [];
            const productos = Array.isArray(productosData) ? productosData : productosData.data || [];


            const totalVentas = ventas.reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);


            const hoy = new Date().toISOString().split('T')[0];
            const ventasHoy = ventas.filter((venta: any) => venta.fecha?.startsWith(hoy))
                .reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);


            const productosStockBajo = inventarios.filter((inv: any) =>
                inv.stock !== undefined && inv.stockMinimo !== undefined && inv.stock < inv.stockMinimo
            ).length;


            const ventasMes = this.calculateMonthlySales(ventas);


            const topProductos = this.calculateTopProducts(ventas, productos);


            const clientesRecientes = clientes.slice(-5);

            const stats: DashboardStats = {
                totalVentas,
                ventasHoy,
                totalClientes: clientes.length,
                productosStock: productos.length,
                productosStockBajo,
                ventasMes,
                topProductos,
                clientesRecientes
            };

            return { success: true, data: stats };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return { success: false, message: 'Error al obtener estadísticas del dashboard' };
        }
    },

    // Obtener todas las ventas
    async getVentas(): Promise<ApiResponse<Venta[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/ventas/`);
            const data = await response.json();

            if (Array.isArray(data)) {
                return { success: true, data };
            }
            return data;
        } catch (error) {
            console.error('Error fetching ventas:', error);
            return { success: false, message: 'Error al obtener ventas' };
        }
    },

    // Obtener todos los clientes
    async getClientes(): Promise<ApiResponse<Cliente[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/`);
            const data = await response.json();

            if (Array.isArray(data)) {
                return { success: true, data };
            }
            return data;
        } catch (error) {
            console.error('Error fetching clientes:', error);
            return { success: false, message: 'Error al obtener clientes' };
        }
    },

    // Obtener todo el inventario
    async getInventario(): Promise<ApiResponse<Inventario[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/inventario/inventarios/`);
            const data = await response.json();

            if (Array.isArray(data)) {
                return { success: true, data };
            }
            return data;
        } catch (error) {
            console.error('Error fetching inventario:', error);
            return { success: false, message: 'Error al obtener inventario' };
        }
    },

    // Obtener todos los productos
    async getProductos(): Promise<ApiResponse<Producto[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/`);
            const data = await response.json();

            if (Array.isArray(data)) {
                return { success: true, data };
            }
            return data;
        } catch (error) {
            console.error('Error fetching productos:', error);
            return { success: false, message: 'Error al obtener productos' };
        }
    },

    // Obtener todas las compras
    async getCompras(): Promise<ApiResponse<Compra[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/compras/`);
            const data = await response.json();

            if (Array.isArray(data)) {
                return { success: true, data };
            }
            return data;
        } catch (error) {
            console.error('Error fetching compras:', error);
            return { success: false, message: 'Error al obtener compras' };
        }
    },

    // Calcular ventas mensuales
    calculateMonthlySales(ventas: any[]): any[] {
        const monthlySales: { [key: string]: { total: number, cantidad: number } } = {};

        ventas.forEach(venta => {
            if (venta.fecha) {
                const date = new Date(venta.fecha);
                const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

                if (!monthlySales[monthKey]) {
                    monthlySales[monthKey] = { total: 0, cantidad: 0 };
                }

                monthlySales[monthKey].total += venta.total || 0;
                monthlySales[monthKey].cantidad += 1;
            }
        });

        // Convert to array and format
        return Object.entries(monthlySales).map(([mes, data]) => ({
            mes,
            total: data.total,
            cantidad: data.cantidad
        })).sort((a, b) => a.mes.localeCompare(b.mes));
    },

    // Calcular productos más vendidos
    calculateTopProducts(ventas: any[], productos: any[]): any[] {
        const productSales: { [key: number]: { cantidadVendida: number, totalVentas: number } } = {};

        // Initialize product sales
        productos.forEach(producto => {
            productSales[producto.idProducto] = { cantidadVendida: 0, totalVentas: 0 };
        });

        // Sum sales from ventas detalles
        ventas.forEach(venta => {
            if (venta.detalles && Array.isArray(venta.detalles)) {
                venta.detalles.forEach((detalle: any) => {
                    if (detalle.idProducto && productSales[detalle.idProducto]) {
                        productSales[detalle.idProducto].cantidadVendida += detalle.cantidad || 0;
                        productSales[detalle.idProducto].totalVentas += (detalle.precioUnitario || 0) * (detalle.cantidad || 0);
                    }
                });
            }
        });

        // Convert to array and sort by quantity sold
        return Object.entries(productSales)
            .map(([idProducto, sales]) => ({
                producto: productos.find(p => p.idProducto === parseInt(idProducto)),
                cantidadVendida: sales.cantidadVendida,
                totalVentas: sales.totalVentas
            }))
            .filter(item => item.producto && item.cantidadVendida > 0)
            .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
            .slice(0, 10); // Top 10 products
    },

    // Obtener alertas de inventario
    async getInventoryAlerts(): Promise<ApiResponse<any[]>> {
        try {
            const response = await fetch(`${API_BASE_URL}/inventario/inventarios/`);
            const data = await response.json();

            const inventarios = Array.isArray(data) ? data : data.data || [];

            const alerts = inventarios
                .filter((inv: any) => inv.stock !== undefined && inv.stockMinimo !== undefined && inv.stock < inv.stockMinimo)
                .map((inv: any) => ({
                    product: inv.producto?.nombre || `Producto ${inv.idProducto}`,
                    stock: inv.stock,
                    minStock: inv.stockMinimo,
                    status: inv.stock < inv.stockMinimo * 0.3 ? 'critical' : 'low'
                }));

            return { success: true, data: alerts };
        } catch (error) {
            console.error('Error fetching inventory alerts:', error);
            return { success: false, message: 'Error al obtener alertas de inventario' };
        }
    },

    // Obtener mejores clientes
    async getTopCustomers(): Promise<ApiResponse<any[]>> {
        try {
            const [ventasResponse, clientesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/ventas/`),
                fetch(`${API_BASE_URL}/clientes/`)
            ]);

            const ventasData = await ventasResponse.json();
            const clientesData = await clientesResponse.json();

            const ventas = Array.isArray(ventasData) ? ventasData : ventasData.data || [];
            const clientes = Array.isArray(clientesData) ? clientesData : clientesData.data || [];

            const customerSales: { [key: number]: { purchases: number, total: number } } = {};

            clientes.forEach((cliente: Cliente) => {
                customerSales[cliente.idCliente] = { purchases: 0, total: 0 };
            });

            ventas.forEach((venta: Venta) => {
                if (venta.idCliente && customerSales[venta.idCliente]) {
                    customerSales[venta.idCliente].purchases += 1;
                    customerSales[venta.idCliente].total += venta.total || 0;
                }
            });

            const topCustomers = Object.entries(customerSales)
                .map(([idCliente, sales]) => ({
                    id: parseInt(idCliente),
                    name: clientes.find((c: Cliente) => c.idCliente === parseInt(idCliente))?.nombre || `Cliente ${idCliente}`,
                    purchases: sales.purchases,
                    total: sales.total
                }))
                .filter(customer => customer.purchases > 0)
                .sort((a, b) => b.total - a.total)
                .slice(0, 10);

            return { success: true, data: topCustomers };
        } catch (error) {
            console.error('Error fetching top customers:', error);
            return { success: false, message: 'Error al obtener mejores clientes' };
        }
    },

    // Calcular métricas financieras
    calculateFinancialMetrics(ventas: any[]): any {
        if (!ventas.length) {
            return {
                ventaPromedio: 0,
                transaccionesPorDia: 0,
                margenPromedio: 0,
                crecimiento: 0,
                ingresosTotales: 0,
                costosTotales: 0,
                utilidadBruta: 0,
                margenUtilidad: 0
            };
        }

        const ingresosTotales = ventas.reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);
        const costosTotales = ingresosTotales * 0.7; // Asumiendo 70% de costos
        const utilidadBruta = ingresosTotales - costosTotales;
        const margenUtilidad = ingresosTotales > 0 ? (utilidadBruta / ingresosTotales) * 100 : 0;
        const ventaPromedio = ingresosTotales / ventas.length;

        // Calcular transacciones por día (promedio de últimos 30 días)
        const hoy = new Date();
        const ultimos30Dias = ventas.filter((venta: any) => {
            if (!venta.fecha) return false;
            const fechaVenta = new Date(venta.fecha);
            const diffTime = Math.abs(hoy.getTime() - fechaVenta.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 30;
        });

        const transaccionesPorDia = ultimos30Dias.length > 0 ? ultimos30Dias.length / 30 : 0;

        return {
            ventaPromedio,
            transaccionesPorDia,
            margenPromedio: margenUtilidad,
            crecimiento: 12.5, // Placeholder - se necesitarían datos históricos para calcular crecimiento real
            ingresosTotales,
            costosTotales,
            utilidadBruta,
            margenUtilidad
        };
    },

    // Calcular métricas de clientes
    calculateCustomerMetrics(clientes: any[], ventas: any[]): any {
        if (!clientes.length) {
            return {
                nuevosClientes: 0,
                retencion: 0,
                valorPromedioCliente: 0,
                frecuenciaCompra: 0
            };
        }

        const hoy = new Date();
        const mesActual = hoy.getMonth();
        const añoActual = hoy.getFullYear();

        // Nuevos clientes este mes (clientes creados en el mes actual)
        const nuevosClientes = clientes.filter((cliente: any) => {
            if (!cliente.fechaCreacion) return false;
            const fechaCreacion = new Date(cliente.fechaCreacion);
            return fechaCreacion.getMonth() === mesActual && fechaCreacion.getFullYear() === añoActual;
        }).length;

        // Valor promedio por cliente
        const totalVentas = ventas.reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);
        const valorPromedioCliente = clientes.length > 0 ? totalVentas / clientes.length : 0;

        // Frecuencia de compra (promedio de compras por cliente activo)
        const clientesConCompras = new Set(ventas.map((venta: any) => venta.idCliente));
        const frecuenciaCompra = clientesConCompras.size > 0 ? ventas.length / clientesConCompras.size : 0;

        return {
            nuevosClientes,
            retencion: 78, // Placeholder - se necesitarían datos históricos para calcular retención real
            valorPromedioCliente,
            frecuenciaCompra
        };
    },

    // Calcular ventas por categoría
    async getSalesByCategory(): Promise<ApiResponse<any[]>> {
        try {


            // Obtener ventas, productos y categorías
            const [ventasResponse, productosResponse, categoriasResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/ventas/`),
                fetch(`${API_BASE_URL}/productos/`),
                fetch(`${API_BASE_URL}/productos/categorias/`)
            ]);

            const ventasData = await ventasResponse.json();
            const productosData = await productosResponse.json();
            const categoriasData = await categoriasResponse.json();

            const ventas = Array.isArray(ventasData) ? ventasData : ventasData.data || [];
            const productos = Array.isArray(productosData) ? productosData : productosData.data || [];
            const categorias = Array.isArray(categoriasData) ? categoriasData : categoriasData.data || [];



            // Crear mapa de ID de producto a categoría
            const productCategoryMap = new Map<number, string>();
            productos.forEach((producto: any) => {
                if (producto.idCategoria) {
                    const categoria = categorias.find((cat: any) => cat.idCategoria === producto.idCategoria);
                    productCategoryMap.set(producto.idProducto, categoria?.nombre || 'Sin Categoría');
                } else {
                    productCategoryMap.set(producto.idProducto, 'Sin Categoría');
                }
            });

            // Inicializar ventas por categoría
            const categorySales: { [key: string]: number } = {};
            categorias.forEach((cat: any) => {
                categorySales[cat.nombre] = 0;
            });
            categorySales['Sin Categoría'] = 0;


            for (const venta of ventas) {
                try {
                    const detallesResponse = await ventasService.getVentaDetalles(venta.idVenta);


                    if (detallesResponse.success && detallesResponse.data) {
                        const detalles = detallesResponse.data;

                        detalles.forEach((detalle: any) => {
                            const categoryName = productCategoryMap.get(detalle.idProducto) || 'Sin Categoría';
                            const saleAmount = (detalle.precioUnitario || 0) * (detalle.cantidad || 0);
                            categorySales[categoryName] = (categorySales[categoryName] || 0) + saleAmount;
                        });
                    } else {
                        console.warn(`No se pudieron obtener detalles para la venta ID: ${venta.idVenta}, razón:`, detallesResponse.message);
                    }
                } catch (error) {
                    console.error(`Error al obtener detalles de venta ID: ${venta.idVenta}`, error);
                }
            }

            // Convertir a array y calcular porcentajes
            const totalSales = Object.values(categorySales).reduce((sum: number, amount: number) => sum + amount, 0);


            const categoryData = Object.entries(categorySales)
                .map(([name, value]) => ({
                    name,
                    value: totalSales > 0 ? Math.round((value / totalSales) * 100) : 0,
                    color: this.getCategoryColor(name)
                }))
                .filter(item => item.value > 0); // Solo mostrar categorías con ventas



            // Si no hay datos de ventas pero hay categorías, mostrar placeholder
            if (categoryData.length === 0 && categorias.length > 0) {

                const placeholderData = categorias.map((cat: any, index: number) => ({
                    name: cat.nombre,
                    value: 100 / categorias.length,
                    color: this.getCategoryColor(cat.nombre)
                }));
                return { success: true, data: placeholderData };
            }

            return { success: true, data: categoryData };
        } catch (error) {
            console.error('Error calculando ventas por categoría:', error);
            return {
                success: false,
                message: 'Error al calcular ventas por categoría. Verifique que los endpoints /ventas/, /productos/ y /productos/categorias/ estén disponibles.'
            };
        }
    },

    // Helper function to assign colors to categories
    getCategoryColor(categoryName: string): string {
        const colorMap: { [key: string]: string } = {
            'Escolares': '#3b82f6',
            'Útiles': '#10b981',
            'Arte': '#f59e0b',
            'Oficina': '#ef4444',
            'Tecnologia': '#8b5cf6', // Color púrpura para Tecnología
            'Sin Categoría': '#9ca3af'
        };
        return colorMap[categoryName] || '#6b7280'; // Default color
    }
};