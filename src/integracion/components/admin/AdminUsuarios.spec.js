import { montar, esperarRespuestas, escribir, hacerClic } from '../../pruebas/montar.js';
import AdminUsuarios from './AdminUsuarios.jsx';

describe('Administración de roles', () => {
    let vista;
    afterEach(() => vista?.desmontar());

    it('muestra el propio rol sin editor y guarda el rol elegido para otra persona', async () => {
        const usuarios = [
            { id: 1, nombre: 'Ana', rol: 'ADMIN', activo: true, creadoEn: '2026-11-20T10:00:00' },
            {
                id: 3,
                nombre: 'Camila',
                rol: 'CLIENTE',
                activo: true,
                creadoEn: '2026-11-20T10:00:00',
            },
        ];
        const avisar = jasmine.createSpy('avisar');
        const peticiones = [];
        spyOn(window, 'fetch').and.callFake(async (url, opciones) => {
            if (opciones.method === 'PATCH') {
                peticiones.push([new URL(url).pathname, JSON.parse(opciones.body)]);
                usuarios[1].rol = JSON.parse(opciones.body).rol;
            }
            const datos = opciones.method === 'PATCH' ? usuarios[1] : usuarios;
            return { ok: true, status: 200, json: async () => datos };
        });
        vista = montar(<AdminUsuarios yo={usuarios[0]} avisar={avisar} />);
        await esperarRespuestas();
        expect(vista.contenedor.querySelectorAll('select').length).toBe(1);
        const selector = vista.contenedor.querySelector('[aria-label="Rol de Camila"]');
        const guardar = vista.contenedor.querySelector('[aria-label="Guardar rol de Camila"]');
        expect(guardar.disabled).toBeTrue();
        escribir(selector, 'VENDEDOR');
        expect(peticiones.length).toBe(0);
        hacerClic(guardar);
        await esperarRespuestas();
        expect(peticiones).toEqual([['/api/v1/admin/usuarios/3/rol', { rol: 'VENDEDOR' }]]);
        expect(guardar.disabled).toBeTrue();
        expect(selector.value).toBe('VENDEDOR');
        expect(avisar).toHaveBeenCalledWith({
            tipo: 'ok',
            texto: 'Camila ahora tiene el rol Vendedor.',
        });
    });
});
