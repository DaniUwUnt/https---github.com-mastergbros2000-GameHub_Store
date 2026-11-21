import { useMemo } from 'react';
import { useCarrito } from '../integracion/context/useCarrito.js';
import { CartContext } from './cartContext.js';

// Los componentes de catálogo de la EP2 conservan su interfaz; todas las vistas usan el mismo carrito.
export function CartProvider({ children }) {
    const { agregar } = useCarrito();
    const value = useMemo(
        () => ({
            agregarAlCarrito(producto, cantidad) {
                return agregar(
                    {
                        ...producto,
                        sku: producto.codigo,
                        precio: producto.precioVigente ?? producto.precio,
                        precioNormal: producto.precioNormal ?? null,
                    },
                    cantidad,
                );
            },
        }),
        [agregar],
    );
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
