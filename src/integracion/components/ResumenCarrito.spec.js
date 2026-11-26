// Prueba 8 del listado obligatorio
import { montar } from '../pruebas/montar.js';
import ResumenCarrito from './ResumenCarrito.jsx';

describe('ResumenCarrito', () => {
    let vista;

    afterEach(() => vista.desmontar());

    it('(8) muestra el mensaje de carrito vacío cuando no hay líneas', () => {
        vista = montar(<ResumenCarrito lineas={[]} cupon={null} />);

        expect(vista.texto()).toContain('Tu carrito está vacío.');
        // Sin líneas no se ofrece el campo de cupón
        expect(vista.contenedor.querySelector('#cupon')).toBeNull();
    });

    it('muestra el total confirmado por la regla de cupón sin descuento sobre oferta', () => {
        const lineas = [
            { productoId: 1, precio: 967991, precioNormal: 1099990, cantidad: 1 },
            { productoId: 2, precio: 24990, precioNormal: null, cantidad: 1 },
        ];
        const cupon = {
            codigo: 'GAME10',
            porcentaje: 10,
            tope: 30000,
            inicio: '2000-01-01',
            termino: '2100-12-31',
        };
        vista = montar(<ResumenCarrito lineas={lineas} cupon={cupon} />);
        expect(vista.texto()).toContain('−$2.499');
        expect(vista.texto()).toContain('$990.482');
    });

    it('con líneas, muestra el total calculado con logica/carrito.js', () => {
        const lineas = [
            {
                productoId: 4,
                nombre: 'Teclado mecánico Nimbo TKL',
                precio: 59990,
                stock: 24,
                cantidad: 2,
            },
        ];
        vista = montar(<ResumenCarrito lineas={lineas} cupon={null} />);

        expect(vista.texto()).not.toContain('Tu carrito está vacío.');
        expect(vista.texto()).toContain('$119.980');
    });
});
