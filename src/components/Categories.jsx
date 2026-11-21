import { Link } from 'react-router-dom';

export default function Categories({ categorias, productos }) {
    return (
        <section className="seccion">
            <h2>Categorías</h2>
            {categorias.length === 0 && <p>No hay categorías disponibles.</p>}
            <div className="grilla-categorias">
                {categorias.map(({ id, nombre }) => (
                    <Link
                        className="tarjeta categoria"
                        key={id}
                        to={`/categorias/${encodeURIComponent(nombre)}`}
                    >
                        <h3>{nombre}</h3>
                        <p>
                            {productos.filter((producto) => producto.categoria === nombre).length}{' '}
                            producto(s)
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
