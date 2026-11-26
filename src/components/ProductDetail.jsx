import { Fragment, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/cartContext.js';
import { precioFinal } from '../services/productosService.js';
import ListaResenas from '../integracion/components/ListaResenas.jsx';
import ProductImage from './ProductImage.jsx';

export default function ProductDetail({
    producto,
    resenas = [],
    errorResenas,
    soloLectura = false,
}) {
    const { agregarAlCarrito } = useContext(CartContext);
    const [zoom, setZoom] = useState(false);
    const [cantidad, setCantidad] = useState(1);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    if (!producto) {
        return (
            <section className="seccion centrado">
                <h1>Producto no encontrado</h1>
                <p>Este producto no existe o fue eliminado.</p>
                <Link className="boton" to="/productos">
                    Volver al catálogo
                </Link>
            </section>
        );
    }

    const agregar = () => {
        const numero = Number(cantidad);
        if (!Number.isInteger(numero) || numero < 1 || numero > producto.stock) {
            setError(`Ingresa una cantidad válida entre 1 y ${producto.stock}.`);
            setMensaje('');
            return;
        }
        const resultado = agregarAlCarrito(producto, numero);
        if (resultado?.valido === false) {
            setError(resultado.mensaje);
            setMensaje('');
            return;
        }
        setError('');
        setMensaje('Producto agregado al carrito. La cantidad respeta el stock.');
    };

    return (
        <section className="seccion">
            <Link to="/productos">Volver al catálogo</Link>
            <div className="tarjeta row g-4 detalle-producto-bootstrap mt-3">
                <div className="col-12 col-md-6">
                    <ProductImage
                        className={`imagen-detalle ${zoom ? 'galeria-acercada' : ''}`}
                        producto={producto}
                    />
                    <button
                        type="button"
                        className="boton boton-secundario mt-2"
                        aria-pressed={zoom}
                        onClick={() => setZoom(!zoom)}
                    >
                        {zoom ? 'Ver foto completa' : 'Ampliar detalle de la foto'}
                    </button>
                </div>
                <div className="col-12 col-md-6">
                    <p className="oferta">
                        {producto.categoria} / {producto.marca}
                    </p>
                    <h1>{producto.nombre}</h1>
                    <p>Código: {producto.codigo}</p>
                    <p>{producto.descripcion}</p>
                    {producto.descuento > 0 && (
                        <>
                            <p className="oferta">Oferta -{producto.descuento}%</p>
                            <p className="precio-anterior">
                                Normal: ${producto.precio.toLocaleString('es-CL')}
                            </p>
                        </>
                    )}
                    <p className="precio">${precioFinal(producto).toLocaleString('es-CL')}</p>
                    <p className={producto.stock > 0 ? '' : 'sin-stock'}>
                        {producto.stock > 0
                            ? `Stock disponible: ${producto.stock} unidades`
                            : 'Producto temporalmente agotado'}
                    </p>
                    {!soloLectura && (
                        <>
                            <div className="campo">
                                <label htmlFor="cantidad-detalle">Cantidad</label>
                                <input
                                    id="cantidad-detalle"
                                    type="number"
                                    min="1"
                                    max={producto.stock}
                                    step="1"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                    disabled={producto.stock === 0}
                                />
                            </div>
                            <button
                                className="boton"
                                onClick={agregar}
                                disabled={producto.stock === 0}
                            >
                                {producto.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
                            </button>
                        </>
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
                </div>
            </div>
            {producto.especificaciones?.length > 0 && (
                <section className="tarjeta ficha-tecnica p-4">
                    <h2>Ficha técnica</h2>
                    <dl>
                        {producto.especificaciones.map((e) => (
                            <Fragment key={e.clave}>
                                <dt>{e.clave}</dt>
                                <dd>{e.valor}</dd>
                            </Fragment>
                        ))}
                    </dl>
                </section>
            )}
            <section className="tarjeta mt-4 p-4">
                <h2>Reseñas</h2>
                {errorResenas ? (
                    <p role="status">{errorResenas}</p>
                ) : (
                    <ListaResenas resenas={resenas} />
                )}
            </section>
        </section>
    );
}
