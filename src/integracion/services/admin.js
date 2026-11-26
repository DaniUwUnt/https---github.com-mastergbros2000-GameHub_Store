import { solicitar } from './api.js';

// La tabla de productos junta el catálogo (product-service) con el stock (inventory-service)
export async function listarProductosAdmin() {
    const [productos, stock] = await Promise.all([
        solicitar('/api/v1/admin/productos'),
        solicitar('/api/v1/operador/inventario'),
    ]);
    const stockPorId = new Map(stock.map((s) => [s.id, s.stock]));
    return productos.map((p) => ({ ...p, stock: stockPorId.get(p.id) ?? 0 }));
}
export const crearProducto = (datos) =>
    solicitar('/api/v1/admin/productos', { metodo: 'POST', cuerpo: datos });
export const actualizarProducto = (id, datos) =>
    solicitar(`/api/v1/admin/productos/${id}`, { metodo: 'PUT', cuerpo: datos });
export const cambiarActivoProducto = (id, activo) =>
    solicitar(`/api/v1/admin/productos/${id}/activo`, { metodo: 'PATCH', cuerpo: { activo } });

export const listarCategoriasAdmin = () => solicitar('/api/v1/admin/categorias');
export const crearCategoria = (nombre) =>
    solicitar('/api/v1/admin/categorias', { metodo: 'POST', cuerpo: { nombre } });
export const renombrarCategoria = (id, nombre) =>
    solicitar(`/api/v1/admin/categorias/${id}`, { metodo: 'PUT', cuerpo: { nombre } });
export const eliminarCategoria = (id) =>
    solicitar(`/api/v1/admin/categorias/${id}`, { metodo: 'DELETE' });

export const listarPromociones = () => solicitar('/api/v1/admin/promociones');
export const crearPromocion = (datos) =>
    solicitar('/api/v1/admin/promociones', { metodo: 'POST', cuerpo: datos });
export const cambiarActivoPromocion = (id, activo) =>
    solicitar(`/api/v1/admin/promociones/${id}/activo`, { metodo: 'PATCH', cuerpo: { activo } });

export const listarResenasAdmin = (estado) =>
    solicitar(estado ? `/api/v1/admin/resenas?estado=${estado}` : '/api/v1/admin/resenas');
export const moderarResena = (id, estado) =>
    solicitar(`/api/v1/admin/resenas/${id}`, { metodo: 'PUT', cuerpo: { estado } });

export const listarUsuarios = () => solicitar('/api/v1/admin/usuarios');
export const cambiarActivoUsuario = (id, activo) =>
    solicitar(`/api/v1/admin/usuarios/${id}/activo`, { metodo: 'PATCH', cuerpo: { activo } });
export const cambiarRolUsuario = (id, rol) =>
    solicitar(`/api/v1/admin/usuarios/${id}/rol`, { metodo: 'PATCH', cuerpo: { rol } });
