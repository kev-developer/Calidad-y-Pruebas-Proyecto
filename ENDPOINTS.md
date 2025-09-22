# Endpoints Backend

## URL Base: `http://127.0.0.1:8000`

## 1. Clientes

- **GET** `/clientes/` - Listar todos los clientes
- **GET** `/clientes/{id}` - Obtener cliente por ID
- **POST** `/clientes/` - Crear nuevo cliente
- **PUT** `/clientes/{id}` - Actualizar cliente
- **DELETE** `/clientes/{id}` - Eliminar cliente

**Ejemplo POST Cliente:**

```json
{
  "nombre": "Juan Pérez",
  "dni": "12345678",
  "tipoCliente": "Minorista",
  "puntos": 0,
  "email": "juan@email.com",
  "idPrograma": null
}
```

## 2. Productos

- **GET** `/productos/` - Listar todos los productos
- **GET** `/productos/{id}` - Obtener producto por ID
- **POST** `/productos/` - Crear nuevo producto
- **PUT** `/productos/{id}` - Actualizar producto
- **DELETE** `/productos/{id}` - Eliminar producto

- **GET** `/productos/categorias/` - Listar categorías
- **GET** `/productos/categorias/{id}` - Obtener categoría por ID
- **POST** `/productos/categorias/` - Crear categoría
- **PUT** `/productos/categorias/{id}` - Actualizar categoría
- **DELETE** `/productos/categorias/{id}` - Eliminar categoría

**Ejemplo POST Producto:**

```json
{
  "nombre": "Cuaderno A4",
  "descripcion": "Cuaderno de 100 hojas",
  "precio": 15.5,
  "idCategoria": 1
}
```

## 3. Ventas

- **GET** `/ventas/` - Listar todas las ventas
- **GET** `/ventas/{id}` - Obtener venta por ID
- **POST** `/ventas/` - Crear nueva venta
- **PUT** `/ventas/{id}` - Actualizar venta
- **DELETE** `/ventas/{id}` - Eliminar venta
- **GET** `/ventas/{id}/detalles` - Obtener detalles de venta
- **POST** `/ventas/{id}/detalles` - Agregar detalle a venta

**Ejemplo POST Venta:**

```json
{
  "idCliente": 1,
  "idUsuario": 1,
  "total": 155.0
}
```

## 4. Compras

- **GET** `/compras/` - Listar todas las compras
- **GET** `/compras/{id}` - Obtener compra por ID
- **POST** `/compras/` - Crear nueva compra
- **PUT** `/compras/{id}` - Actualizar compra
- **DELETE** `/compras/{id}` - Eliminar compra
- **GET** `/compras/{id}/detalles` - Obtener detalles de compra
- **POST** `/compras/{id}/detalles` - Agregar detalle a compra

## 5. Proveedores

- **GET** `/proveedores/` - Listar todos los proveedores
- **GET** `/proveedores/{id}` - Obtener proveedor por ID
- **POST** `/proveedores/` - Crear nuevo proveedor
- **PUT** `/proveedores/{id}` - Actualizar proveedor
- **DELETE** `/proveedores/{id}` - Eliminar proveedor

## 6. Roles y Usuarios

- **GET** `/roles/roles/` - Listar roles
- **POST** `/roles/roles/` - Crear rol
- **GET** `/roles/usuarios/` - Listar usuarios
- **POST** `/roles/usuarios/` - Crear usuario
- **GET** `/roles/menus/` - Listar menús
- **POST** `/roles/menus/` - Crear menú
- **GET** `/roles/rol-menus/` - Listar permisos rol-menú
- **POST** `/roles/rol-menus/` - Asignar permiso

**Ejemplo POST Usuario:**

```json
{
  "nombre": "admin",
  "email": "admin@papeleria.com",
  "contraseña": "password123",
  "idRol": 1
}
```

## 7. Fidelización

- **GET** `/fidelizacion/programas/` - Listar programas de fidelización
- **POST** `/fidelizacion/programas/` - Crear programa
- **GET** `/fidelizacion/recompensas/` - Listar recompensas
- **POST** `/fidelizacion/recompensas/` - Crear recompensa
- **GET** `/fidelizacion/cliente-recompensas/` - Listar canjes
- **POST** `/fidelizacion/cliente-recompensas/` - Canjear recompensa

## 8. Inventario

- **GET** `/inventario/sucursales/` - Listar sucursales
- **POST** `/inventario/sucursales/` - Crear sucursal
- **GET** `/inventario/inventarios/` - Listar inventarios
- **POST** `/inventario/inventarios/` - Crear registro de inventario
- **GET** `/inventario/movimientos/` - Listar movimientos de inventario
- **POST** `/inventario/movimientos/` - Registrar movimiento
- **GET** `/inventario/descuentos/` - Listar descuentos
- **POST** `/inventario/descuentos/` - Crear descuento

## Para probar tenemos que crear en la bd en este orden:

1. **Primero crear roles y usuarios:**

   - POST `/roles/roles/` - Crear rol (ej: Administrador)
   - POST `/roles/usuarios/` - Crear usuario admin

2. **Luego categorías y productos:**

   - POST `/productos/categorias/` - Crear categoría
   - POST `/productos/` - Crear productos

3. **Clientes y fidelización:**

   - POST `/fidelizacion/programas/` - Crear programa
   - POST `/clientes/` - Crear clientes

4. **Proveedores y compras:**

   - POST `/proveedores/` - Crear proveedor
   - POST `/compras/` - Registrar compra

5. **Finalmente ventas:**
   - POST `/ventas/` - Registrar venta

## Documentación Automática >:) :

- **Swagger UI:** http://127.0.0.1:8000/docs
- **ReDoc:** http://127.0.0.1:8000/redoc

## Notas:

- Todos los endpoints soportan parámetros `skip` y `limit` para paginación
- Los campos de fecha se generan automáticamente en el servidor
- Las relaciones se validan automáticamente (IDs deben existir)
