import { createElement } from 'react';
import Contacto from '../../components/Contacto.jsx';
import { montar, escribir, enviar, esperarRespuestas } from './montar.js';
describe('Contacto · DOM y contrato de red', () => {
    let vista;
    let red;
    let campo;
    beforeEach(() => {
        red = spyOn(globalThis, 'fetch');
        vista = montar(createElement(Contacto));
        campo = (id) => vista.contenedor.querySelector('#contacto-' + id);
    });
    afterEach(() => vista.desmontar());
    it('asocia label con control y explica el error sin llamar a la API', () => {
        enviar(vista.contenedor.querySelector('form'));
        expect(campo('nombre').labels[0].textContent).toContain('Nombre');
        expect(campo('comentario').getAttribute('aria-invalid')).toBe('true');
        expect(red).not.toHaveBeenCalled();
    });
    it('envía al servidor y muestra el número recibido aunque no haya correo', async () => {
        red.and.resolveTo(new Response('{"id":42}', { status: 201 }));
        escribir(campo('nombre'), 'Paz');
        escribir(campo('comentario'), 'Consulta sobre stock');
        enviar(vista.contenedor.querySelector('form'));
        await esperarRespuestas();
        const [url, op] = red.calls.mostRecent().args;
        expect(url).toContain('/api/v1/contacto');
        expect(JSON.parse(op.body)).toEqual({
            nombre: 'Paz',
            correo: null,
            comentario: 'Consulta sobre stock',
        });
        expect(vista.texto()).toContain('42');
        expect(campo('comentario').value).toBe('');
    });
    it('conserva la consulta si la conexión falla', async () => {
        red.and.rejectWith(new Error('offline'));
        escribir(campo('nombre'), 'Paz');
        escribir(campo('comentario'), '¿Tienen stock?');
        enviar(vista.contenedor.querySelector('form'));
        await esperarRespuestas();
        expect(campo('comentario').value).toBe('¿Tienen stock?');
        expect(vista.contenedor.querySelector('[role=alert]')).not.toBeNull();
    });
});
