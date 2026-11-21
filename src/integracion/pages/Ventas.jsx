import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cargando, MensajeError } from '../components/Estado.jsx';
import { useCarga } from '../hooks/useCarga.js';
import { clp, fechaCorta } from '../logica/formato.js';
import { ESTADO_ORDEN } from '../logica/estados.js';
import { listarOrdenesOperador, obtenerOrdenOperador } from '../services/operador.js';

function DetalleOrden({ id }) {
    const { datos, error, cargando, recargar } = useCarga(() => obtenerOrdenOperador(id), [id]);
    if (cargando) return <Cargando texto="Cargando detalle de la orden…" />;
    if (error) return <MensajeError error={error} alReintentar={recargar} />;
    return (
        <section className="tarjeta p-4 mt-4" aria-labelledby="detalle-venta">
            <h2 id="detalle-venta">Orden {datos.numero}</h2>
            <p>Estado: {ESTADO_ORDEN[datos.estado]?.texto ?? datos.estado}</p>
            <ul>
                {datos.lineas.map((l) => (
                    <li key={l.productoId}>
                        {l.cantidad} × {l.nombre} · {clp(l.subtotal)}
                    </li>
                ))}
            </ul>
            <p>
                Pago: {datos.pago?.estado ?? 'Sin información'} · Despacho:{' '}
                {datos.despacho?.seguimiento ?? 'Sin seguimiento'}
            </p>
            <p className="precio mb-0">Total: {clp(datos.total)}</p>
        </section>
    );
}

export default function Ventas() {
    const [id, setId] = useState(null);
    const { datos, error, cargando, recargar } = useCarga(() => listarOrdenesOperador(), []);
    return (
        <section className="seccion">
            <p className="eyebrow">Consulta de ventas</p>
            <h1>Panel de vendedor</h1>
            <p>Tu perfil puede consultar productos y órdenes sin editarlos.</p>
            <Link to="/productos" className="boton boton-secundario">
                Consultar productos
            </Link>
            <h2 className="mt-4">Órdenes de la tienda</h2>
            {cargando && <Cargando texto="Cargando órdenes…" />}
            {error && <MensajeError error={error} alReintentar={recargar} />}
            {datos?.length === 0 && <p>No hay órdenes para consultar.</p>}
            {datos?.length > 0 && (
                <div className="table-responsive tarjeta p-3">
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Orden</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Total</th>
                                <th>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datos.map((o) => (
                                <tr key={o.id}>
                                    <td>{o.numero}</td>
                                    <td>{fechaCorta(o.creadaEn)}</td>
                                    <td>{ESTADO_ORDEN[o.estado]?.texto ?? o.estado}</td>
                                    <td>{clp(o.total)}</td>
                                    <td>
                                        <button
                                            className="boton boton-secundario"
                                            onClick={() => setId(o.id)}
                                        >
                                            Ver orden
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {id !== null && <DetalleOrden id={id} />}
        </section>
    );
}
