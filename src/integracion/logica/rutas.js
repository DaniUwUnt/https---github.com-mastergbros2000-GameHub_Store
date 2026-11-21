// A dónde lleva cada rol después de iniciar sesión
export const INICIO_POR_ROL = { CLIENTE: '/', VENDEDOR: '/vendedor', ADMIN: '/administracion' };

// Rutas que solo puede abrir cierto rol (las mismas reglas que App.jsx y SeguridadConfig)
const RUTAS_POR_ROL = [
    { prefijo: '/administracion', roles: ['ADMIN'] },
    { prefijo: '/vendedor', roles: ['VENDEDOR'] },
    { prefijo: '/operador', roles: ['ADMIN'] },
    { prefijo: '/carrito', roles: ['CLIENTE', 'ADMIN'] },
    { prefijo: '/checkout', roles: ['CLIENTE'] },
    { prefijo: '/mis-ordenes', roles: ['CLIENTE'] },
    { prefijo: '/ordenes/', roles: ['CLIENTE'] },
];

// Si la persona venía de una ruta protegida y su rol puede abrirla, vuelve ahí; si no, va al inicio de su rol
export function rutaDespuesDeIngresar(rol, desde) {
    const inicio = INICIO_POR_ROL[rol] ?? '/';
    if (!desde || desde === '/ingresar') return inicio;
    const regla = RUTAS_POR_ROL.find((r) => desde.startsWith(r.prefijo));
    return !regla || regla.roles.includes(rol) ? desde : inicio;
}
