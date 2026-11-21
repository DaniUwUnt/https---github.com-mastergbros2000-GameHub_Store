import { conPostventa } from '../logica/postventa.js';
import { solicitar } from './api.js';

export const crearOrden = (datos) =>
    solicitar('/api/v1/ordenes', { metodo: 'POST', cuerpo: datos });

export const listarMisOrdenes = () => solicitar('/api/v1/ordenes/mias');

// El detalle junta la orden (order-service, con su pago y su despacho) con las reseñas (review-service)
// y las garantías (warranty-service) del cliente, para saber qué puede hacer con cada producto
export async function obtenerOrden(id) {
    const [orden, resenas, garantias] = await Promise.all([
        solicitar(`/api/v1/ordenes/${id}`),
        solicitar('/api/v1/resenas/mias'),
        solicitar('/api/v1/garantias/mias'),
    ]);
    return conPostventa(orden, resenas, garantias);
}

export const crearResena = (datos) =>
    solicitar('/api/v1/resenas', { metodo: 'POST', cuerpo: datos });

export const solicitarGarantia = (datos) =>
    solicitar('/api/v1/garantias', { metodo: 'POST', cuerpo: datos });
