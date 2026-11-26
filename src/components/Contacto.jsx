import { useState } from 'react';
import Campo from '../integracion/components/Campo.jsx';
import { MensajeError } from '../integracion/components/Estado.jsx';
import { validarContacto } from '../integracion/logica/identidad.js';
import { enviarContacto } from '../integracion/services/contacto.js';

const VACIO = { nombre: '', correo: '', comentario: '' };
export default function Contacto() {
    const [datos, setDatos] = useState(VACIO);
    const [tocados, tocar] = useState({});
    const [enviando, esperar] = useState(false);
    const [acuse, confirmar] = useState(null);
    const [error, fallar] = useState(null);
    const errores = validarContacto(datos);
    function campo(k) {
        return {
            id: 'contacto-' + k,
            valor: datos[k],
            alCambiar: (v) => {
                setDatos((d) => ({ ...d, [k]: v }));
                confirmar(null);
            },
            onBlur: () => tocar((t) => ({ ...t, [k]: true })),
            error: tocados[k] && errores[k],
        };
    }
    async function enviar(e) {
        e.preventDefault();
        tocar({ nombre: true, correo: true, comentario: true });
        confirmar(null);
        fallar(null);
        if (Object.keys(errores).length || enviando) return;
        esperar(true);
        try {
            const resp = await enviarContacto({
                nombre: datos.nombre.trim(),
                correo: datos.correo.trim() || null,
                comentario: datos.comentario.trim(),
            });
            confirmar(resp.id);
            setDatos(VACIO);
            tocar({});
        } catch (e) {
            fallar(e);
        } finally {
            esperar(false);
        }
    }
    return (
        <section className="contenedor py-5 ep3-max-width-560px">
            <p className="eyebrow">Ayuda de la tienda</p>
            <h1>Contacto</h1>
            <p>Cuéntanos tu consulta. Si quieres que podamos responderte, incluye tu correo.</p>
            <form className="tarjeta p-4 d-flex flex-column gap-3" onSubmit={enviar} noValidate>
                <Campo
                    {...campo('nombre')}
                    etiqueta="Nombre"
                    requerido
                    autoComplete="name"
                    ayuda="Hasta 100 caracteres."
                />
                <Campo
                    {...campo('correo')}
                    etiqueta="Correo"
                    opcional
                    tipo="email"
                    autoComplete="email"
                    ayuda="Aceptamos @duoc.cl, @profesor.duoc.cl y @gmail.com."
                />
                <Campo
                    {...campo('comentario')}
                    como="textarea"
                    etiqueta="Comentario"
                    requerido
                    ayuda="Hasta 500 caracteres."
                />
                <MensajeError error={error} />
                {acuse !== null && <p role="status">Recibimos tu consulta n.º {acuse}.</p>}
                <button className="btn btn-primary" disabled={enviando}>
                    {enviando ? 'Enviando…' : 'Enviar mensaje'}
                </button>
            </form>
        </section>
    );
}
