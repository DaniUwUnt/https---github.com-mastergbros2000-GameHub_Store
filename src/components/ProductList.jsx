import { useContext, useMemo, useState } from 'react';
import { CartContext } from '../context/cartContext.js';
import { filtrarProductos, precioFinal } from '../services/productosService.js';
import ProductCard from './ProductCard.jsx';

export default function ProductList({
    productos,
    mostrarFiltros = true,
    soloDestacados = false,
    soloOfertas = false,
    categoriaInicial = 'Todas',
    categoriasApi = [],
    soloLectura = false,
}) {
    const { agregarAlCarrito } = useContext(CartContext);
    const [categoria, setCategoria] = useState(categoriaInicial);
    const [marca, setMarca] = useState('Todas');
    const [orden, setOrden] = useState('Sin ordenar');
    const [busqueda, setBusqueda] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [min, setMin] = useState('');
    const [max, setMax] = useState('');
    const [limite, setLimite] = useState(6);
    const rangoInvalido =
        (min !== '' && Number(min) < 0) ||
        (max !== '' && Number(max) < 0) ||
        (min !== '' && max !== '' && Number(min) > Number(max));
    const categorias = [
        ...new Set([...categoriasApi.map((c) => c.nombre), ...productos.map((p) => p.categoria)]),
    ];
    const marcas = [...new Set(productos.map((producto) => producto.marca))];

    const visibles = useMemo(() => {
        let base = productos;
        if (soloDestacados) base = base.slice(0, 3);
        if (soloOfertas) base = base.filter((producto) => producto.descuento > 0);
        const filtrados = filtrarProductos(base, categoria, marca, orden, busqueda);
        return rangoInvalido
            ? []
            : filtrados.filter((p) => {
                  const precio = precioFinal(p);
                  return (
                      (min === '' || precio >= Number(min)) && (max === '' || precio <= Number(max))
                  );
              });
    }, [
        productos,
        soloDestacados,
        soloOfertas,
        categoria,
        marca,
        orden,
        busqueda,
        min,
        max,
        rangoInvalido,
    ]);

    const limpiar = () => {
        setBusqueda('');
        setCategoria('Todas');
        setMarca('Todas');
        setOrden('Sin ordenar');
        setMin('');
        setMax('');
        setLimite(6);
    };

    const agregar = (producto, cantidad) => {
        const resultado = agregarAlCarrito(producto, cantidad);
        if (resultado?.valido === false) {
            setError(resultado.mensaje);
            setMensaje('');
            return;
        }
        setError('');
        setMensaje(`${producto.nombre} agregado al carrito. La cantidad respeta el stock.`);
    };

    return (
        <div>
            {mostrarFiltros && (
                <div className="filtros-productos">
                    <label>
                        Buscar
                        <input
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Nombre del producto"
                        />
                    </label>
                    <label>
                        Categoría
                        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                            <option>Todas</option>
                            {categorias.map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Marca
                        <select value={marca} onChange={(e) => setMarca(e.target.value)}>
                            <option>Todas</option>
                            {marcas.map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Orden
                        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                            <option>Sin ordenar</option>
                            <option>Menor precio</option>
                            <option>Mayor precio</option>
                            <option>Alfabético</option>
                        </select>
                    </label>
                    <label>
                        Precio mínimo{' '}
                        <input
                            type="number"
                            min="0"
                            value={min}
                            onChange={(e) => setMin(e.target.value)}
                        />
                    </label>
                    <label>
                        Precio máximo{' '}
                        <input
                            type="number"
                            min="0"
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
                        />
                    </label>
                    <button className="boton" onClick={limpiar}>
                        Limpiar
                    </button>
                </div>
            )}
            {rangoInvalido && (
                <p className="mensaje-error" role="alert">
                    El mínimo debe ser menor o igual al máximo y no puede ser negativo.
                </p>
            )}
            {error && (
                <p className="mensaje-error" role="alert">
                    {error}
                </p>
            )}
            {mensaje && (
                <p className="mensaje-exito" role="status">
                    {mensaje}
                </p>
            )}
            {visibles.length === 0 ? (
                <p className="mensaje-error" role="status">
                    No se encontraron productos.
                </p>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {visibles.slice(0, limite).map((producto) => (
                        <div className="col" key={producto.id}>
                            <ProductCard
                                producto={producto}
                                agregar={agregar}
                                soloLectura={soloLectura}
                            />
                        </div>
                    ))}
                </div>
            )}
            {visibles.length > limite && (
                <button
                    className="boton boton-secundario mt-4"
                    onClick={() => setLimite(limite + 6)}
                >
                    Cargar más
                </button>
            )}
        </div>
    );
}
