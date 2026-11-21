import { useState } from 'react';
import { useCarga } from '../../hooks/useCarga.js';
import { NOMBRE_ROL } from '../../logica/estados.js';
import { fecha, iniciales } from '../../logica/formato.js';
import { cambiarActivoUsuario, cambiarRolUsuario, listarUsuarios } from '../../services/admin.js';
import { Cargando, MensajeError } from '../Estado.jsx';
import Icono from '../Icono.jsx';
import Insignia from '../Insignia.jsx';

// Cuentas de la tienda. Una cuenta desactivada recibe 403 al iniciar sesión;
// el backend tampoco deja que el administrador desactive su propia cuenta.
export default function AdminUsuarios({ yo, avisar }) {
    const usuarios = useCarga(() => listarUsuarios(), []);
    const [cambiando, setCambiando] = useState(null);

    const [rolesElegidos, setRolesElegidos] = useState({});

    async function guardarRol(u) {
        const rol = rolesElegidos[u.id];
        if (!rol || rol === u.rol) return;
        setCambiando(u.id);
        try {
            const cuenta = await cambiarRolUsuario(u.id, rol);
            avisar({
                tipo: 'ok',
                texto: `${cuenta.nombre} ahora tiene el rol ${NOMBRE_ROL[cuenta.rol]}.`,
            });
            setRolesElegidos((prev) => {
                const copia = { ...prev };
                delete copia[u.id];
                return copia;
            });
            usuarios.recargar();
        } catch (e) {
            avisar({ tipo: 'error', texto: e.message });
        } finally {
            setCambiando(null);
        }
    }

    async function alternar(u) {
        setCambiando(u.id);
        try {
            await cambiarActivoUsuario(u.id, !u.activo);
            avisar({
                tipo: 'ok',
                texto: `La cuenta de ${u.nombre} quedó ${u.activo ? 'desactivada' : 'activa'}.`,
            });
            usuarios.recargar();
        } catch (e) {
            avisar({ tipo: 'error', texto: e.message });
        } finally {
            setCambiando(null);
        }
    }

    if (usuarios.cargando && !usuarios.datos) return <Cargando texto="Cargando usuarios…" />;
    if (usuarios.error)
        return <MensajeError error={usuarios.error} alReintentar={usuarios.recargar} />;

    return (
        <div className="d-flex flex-column gap-3">
            <div className="tabla-contenedor">
                <table className="table align-middle mb-0">
                    <caption className="visualmente-oculto">Cuentas de la tienda</caption>
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Correo</th>
                            <th scope="col">Rol</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Creada</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.datos.map((u) => {
                            const propia = u.id === yo.id;
                            return (
                                <tr key={u.id}>
                                    <td>
                                        <span className="d-flex align-items-center gap-2">
                                            <span className="avatar" aria-hidden="true">
                                                {iniciales(u.nombre)}
                                            </span>
                                            {u.nombre}
                                        </span>
                                    </td>
                                    <td className="small">{u.email}</td>
                                    <td>
                                        {propia ? (
                                            NOMBRE_ROL[u.rol]
                                        ) : (
                                            <div className="d-flex gap-2 align-items-center">
                                                <select
                                                    className="form-select form-select-sm"
                                                    aria-label={`Rol de ${u.nombre}`}
                                                    value={rolesElegidos[u.id] ?? u.rol}
                                                    disabled={cambiando !== null}
                                                    onChange={(e) =>
                                                        setRolesElegidos({
                                                            ...rolesElegidos,
                                                            [u.id]: e.target.value,
                                                        })
                                                    }
                                                >
                                                    {Object.entries(NOMBRE_ROL).map(
                                                        ([valor, nombre]) => (
                                                            <option key={valor} value={valor}>
                                                                {nombre}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-tonal"
                                                    disabled={
                                                        cambiando !== null ||
                                                        (rolesElegidos[u.id] ?? u.rol) === u.rol
                                                    }
                                                    aria-label={`Guardar rol de ${u.nombre}`}
                                                    onClick={() => guardarRol(u)}
                                                >
                                                    Guardar
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        {u.activo ? (
                                            <Insignia tono="ok" icono="check">
                                                Activa
                                            </Insignia>
                                        ) : (
                                            <Insignia tono="error" icono="prohibido">
                                                Desactivada
                                            </Insignia>
                                        )}
                                    </td>
                                    <td className="texto-mono small">{fecha(u.creadoEn)}</td>
                                    <td>
                                        {propia ? (
                                            <span className="small texto-secundario">
                                                Tu cuenta
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                className={`btn btn-sm ${u.activo ? 'btn-outline-danger' : 'btn-tonal'}`}
                                                disabled={cambiando !== null}
                                                onClick={() => alternar(u)}
                                                aria-label={`${u.activo ? 'Desactivar' : 'Activar'} la cuenta de ${u.nombre}`}
                                            >
                                                {u.activo ? 'Desactivar' : 'Activar'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="small texto-secundario m-0 d-flex align-items-center gap-2">
                <Icono nombre="info" tamano={16} />
                No puedes cambiar tu propio rol ni desactivar tu cuenta. Para usar el nuevo rol, la
                persona debe cerrar sesión y volver a ingresar.
            </p>
        </div>
    );
}
