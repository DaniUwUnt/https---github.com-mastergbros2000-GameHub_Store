import { solicitar } from './api.js';
export const enviarContacto = (datos) =>
    solicitar('/api/v1/contacto', { metodo: 'POST', sesion: null, cuerpo: datos });
export const listarMensajes = () => solicitar('/api/v1/admin/contacto');
