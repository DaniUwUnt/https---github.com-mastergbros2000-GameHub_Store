import { solicitar } from './api.js';

// sesion: null evita mandar un token viejo y que un 401 de credenciales se lea como sesión vencida
export const iniciarSesion = (email, clave) =>
    solicitar('/api/v1/auth/login', { metodo: 'POST', cuerpo: { email, clave }, sesion: null });

export const registrar = (datos) =>
    solicitar('/api/v1/auth/registro', { metodo: 'POST', cuerpo: datos, sesion: null });

// El perfil (datos de contacto y despacho) vive en user-service
export const obtenerPerfil = () => solicitar('/api/v1/usuarios/perfil');

export const renovarSesion = () => solicitar('/api/v1/auth/renovar', { metodo: 'POST' });
