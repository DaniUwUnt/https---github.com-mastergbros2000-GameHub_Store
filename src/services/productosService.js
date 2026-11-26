export function crearProducto(productos, producto) {
    const id = Math.max(Date.now(), ...productos.map((item) => item.id + 1));
    return [...productos, { ...producto, id }];
}

export function actualizarProducto(productos, editado) {
    return productos.map((producto) => (producto.id === editado.id ? { ...editado } : producto));
}

export function eliminarProducto(productos, id) {
    return productos.filter((producto) => producto.id !== id);
}

export function precioFinal(producto) {
    if (Number.isFinite(producto.precioVigente)) return producto.precioVigente;
    return Math.round(producto.precio * (1 - (producto.descuento || 0) / 100));
}

export function filtrarProductos(productos, categoria, marca, orden, busqueda = '') {
    const texto = busqueda.trim().toLowerCase();
    const filtrados = productos.filter(
        (producto) =>
            (categoria === 'Todas' || producto.categoria === categoria) &&
            (marca === 'Todas' || producto.marca === marca) &&
            producto.nombre.toLowerCase().includes(texto),
    );

    return [...filtrados].sort((a, b) => {
        if (orden === 'Menor precio') return precioFinal(a) - precioFinal(b);
        if (orden === 'Mayor precio') return precioFinal(b) - precioFinal(a);
        if (orden === 'Alfabético') return a.nombre.localeCompare(b.nombre);
        return 0;
    });
}
