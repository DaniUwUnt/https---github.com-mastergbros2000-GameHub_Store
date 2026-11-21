export function rutaPublica(ruta) {
    return `${import.meta.env.BASE_URL}${ruta.replace(/^\/+/, '')}`;
}

export function imagenProducto({ imagen }) {
    if (/^\/imagenes\/[a-z0-9_. -]+$/i.test(imagen ?? '')) return rutaPublica(imagen);
    if (/^https:\/\//i.test(imagen ?? '')) return imagen;
    return rutaPublica('/producto-sin-foto.svg');
}
