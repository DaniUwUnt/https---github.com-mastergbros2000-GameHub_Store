// Solo la URL pública del Gateway: las credenciales de MySQL y los secretos nunca van en React.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(
    /\/+$/,
    '',
);
