import { useState } from 'react';
import { rutaPublica } from '../services/imagenesService.js';
const publicaciones = [
    {
        id: 1,
        titulo: 'Cómo elegir un notebook gamer',
        resumen: 'Revisa qué componentes debes comparar antes de escoger un equipo portátil.',
        contenido:
            'Antes de comprar un notebook gamer conviene revisar el procesador, la tarjeta gráfica, la memoria RAM, el almacenamiento y la pantalla. También es importante comprobar su refrigeración y autonomía. La mejor alternativa depende de los juegos y programas que utilizará cada persona.',
        imagen: '/imagenes/notebook_asus_tuf.png',
    },
    {
        id: 2,
        titulo: 'Periféricos para mejorar tu espacio',
        resumen:
            'Conoce la función del teclado, mouse y audífonos dentro de una configuración gamer.',
        contenido:
            'Los periféricos permiten controlar los juegos y comunicarse con otras personas. Un teclado cómodo, un mouse preciso y audífonos con micrófono pueden mejorar la experiencia. No siempre es necesario comprar el producto más costoso: primero se deben considerar la comodidad y el uso real.',
        imagen: '/imagenes/teclado_rgb.png',
    },
];

export default function Blog() {
    const [activo, seleccionar] = useState(null);
    return (
        <section className="contenedor py-5">
            <p className="eyebrow">Guías de compra</p>
            <h1>Blog gamer</h1>
            <div className="row g-4">
                {(activo ? [activo] : publicaciones).map((a) => (
                    <article key={a.id} className={activo ? 'col-12' : 'col-12 col-md-6'}>
                        <div className="tarjeta p-4 h-100">
                            <img
                                className="foto-editorial"
                                src={rutaPublica(a.imagen)}
                                alt={a.titulo}
                            />
                            <h2 className="h4">{a.titulo}</h2>
                            <p>{activo ? a.contenido : a.resumen}</p>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => seleccionar(activo ? null : a)}
                            >
                                {activo ? 'Volver al blog' : 'Leer artículo'}
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
