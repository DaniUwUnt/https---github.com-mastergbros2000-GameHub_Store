import { ErrorApi } from '../integracion/services/api.js';
import {
    listarCategorias,
    listarProductos,
    listarResenas,
    obtenerProducto,
} from '../integracion/services/catalogo.js';

function adaptar(p) {
    return {
        ...p,
        codigo: p.sku,
        precioVigente: p.precio,
        precio: p.precioNormal ?? p.precio,
        descuento: p.precioNormal ? Math.round(100 * (1 - p.precio / p.precioNormal)) : 0,
    };
}

export async function cargarCatalogo(nombre) {
    const categorias = await listarCategorias();
    const slug = nombre ? categorias.find((c) => c.nombre === nombre)?.slug : undefined;
    if (nombre && !slug) throw new ErrorApi(404, 'Esta categoría ya no está disponible.');
    const productos = await listarProductos(slug);
    return { categorias, productos: productos.map(adaptar) };
}

export async function cargarDetalle(id) {
    if (!/^\d+$/.test(id)) throw new ErrorApi(404, 'El producto no existe.');
    const [producto, opiniones] = await Promise.allSettled([
        obtenerProducto(id),
        listarResenas(id),
    ]);
    if (producto.status === 'rejected') throw producto.reason;
    return {
        producto: adaptar(producto.value),
        resenas: opiniones.status === 'fulfilled' ? opiniones.value : [],
        errorResenas: opiniones.status === 'rejected' ? 'No se pudieron cargar las reseñas.' : '',
    };
}
