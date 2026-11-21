// Prueba adicional (EP3): rutas protegidas por rol. El contexto de sesión se reemplaza por un valor fijo.
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../context/useAuth.js';
import { montar } from '../pruebas/montar.js';
import RutaProtegida from './RutaProtegida.jsx';

function app(usuario) {
    const sesion = { usuario, rol: usuario?.rol ?? null };
    return (
        <AuthContext value={sesion}>
            <MemoryRouter initialEntries={['/administracion']}>
                <Routes>
                    <Route
                        path="/administracion"
                        element={
                            <RutaProtegida rol="ADMIN">
                                <p>Panel de administración</p>
                            </RutaProtegida>
                        }
                    />
                    <Route path="/ingresar" element={<p>Página de acceso</p>} />
                </Routes>
            </MemoryRouter>
        </AuthContext>
    );
}

describe('RutaProtegida', () => {
    let vista;

    afterEach(() => vista.desmontar());

    it('sin sesión redirige a /ingresar', () => {
        vista = montar(app(null));
        expect(vista.texto()).toContain('Página de acceso');
        expect(vista.texto()).not.toContain('Panel de administración');
    });

    it('con un rol distinto muestra el aviso en vez del contenido', () => {
        vista = montar(app({ id: 3, nombre: 'Camila Rojas', rol: 'CLIENTE' }));
        expect(vista.texto()).toContain('No tienes acceso a esta sección');
        expect(vista.texto()).not.toContain('Panel de administración');
    });

    it('con el rol correcto muestra el contenido', () => {
        vista = montar(app({ id: 1, nombre: 'Ana Torres', rol: 'ADMIN' }));
        expect(vista.texto()).toContain('Panel de administración');
    });
});
