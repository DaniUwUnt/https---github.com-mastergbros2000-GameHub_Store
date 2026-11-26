import { useCarga } from '../../hooks/useCarga.js';
import { listarMensajes } from '../../services/contacto.js';
import { Cargando, MensajeError } from '../Estado.jsx';

export default function AdminMensajes() {
    const { datos, cargando, error, recargar } = useCarga(listarMensajes);
    if (cargando) return <Cargando texto="Cargando consultas…" />;
    if (error) return <MensajeError error={error} alReintentar={recargar} />;
    return (
        <>
            <button className="btn btn-outline-secondary align-self-start" onClick={recargar}>
                Actualizar consultas
            </button>
            {datos?.length ? (
                datos.map((m) => (
                    <article key={m.id} className="tarjeta p-3">
                        <h3 className="h6">
                            Consulta {m.id} · {m.nombre}
                        </h3>
                        <p>{m.comentario}</p>
                        {m.correo && <small>{m.correo}</small>}
                    </article>
                ))
            ) : (
                <p>Aún no se han recibido consultas.</p>
            )}
        </>
    );
}
