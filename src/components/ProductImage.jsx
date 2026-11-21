import { imagenProducto, rutaPublica } from '../services/imagenesService.js';

export default function ProductImage({ producto, className }) {
    return (
        <img
            className={className}
            src={imagenProducto(producto)}
            alt={producto.nombre}
            loading="lazy"
            onError={(e) => {
                const respaldo = rutaPublica('/producto-sin-foto.svg');
                if (e.currentTarget.getAttribute('src') !== respaldo)
                    e.currentTarget.src = respaldo;
            }}
        />
    );
}
