import { validarContacto, validarCorreoCuenta, validarRun } from './identidad.js';
import { validarLogin, validarRegistro, validarProducto } from './validaciones.js';
import { agregarAlCarrito } from './carrito.js';
import { REGIONES, comunasDe } from '../data/regiones.js';
import { precioFinal } from '../../services/productosService.js';

describe('EFT · identidad chilena y límites del anexo', () => {
    it('acepta omitir el umbral o poner cero y rechaza fracciones', () => {
        const producto = {
            sku: 'TEC',
            nombre: 'Teclado',
            marca: 'Demo',
            categoriaId: '1',
            precio: '0',
            precioNormal: '',
            stock: '0',
        };
        for (const limite of ['', '0', '3'])
            expect(validarProducto({ ...producto, stockCritico: limite }, [{ id: 1 }])).toEqual({});
        expect(
            validarProducto({ ...producto, stockCritico: '1.5' }, [{ id: 1 }]).stockCritico,
        ).toBeTruthy();
    });
    const cuenta = {
        run: '123456785',
        nombre: 'Paz',
        apellidos: 'Soto',
        email: 'paz@gmail.com',
        clave: 'abc12345',
        confirmacion: 'abc12345',
        telefono: '912345678',
        region: 'Región Metropolitana de Santiago',
        comuna: 'Ñuñoa',
        direccion: 'Calle Uno 123',
        terminos: true,
    };
    it('admite RUN de prueba con dígito y con K minúscula', () => {
        expect(validarRun('123456785')).toBe('');
        expect(validarRun('1000005k')).toBe('');
    });
    it('rechaza dígito incorrecto, puntos/guion y RUN muy corto', () => {
        for (const r of ['123456789', '12.345.678-5', '1234', '00000000'])
            expect(validarRun(r)).toBeTruthy();
    });
    it('reconoce solo los tres dominios, sin distinguir mayúsculas', () => {
        for (const d of ['DUOC.CL', 'profesor.duoc.cl', 'gmail.com'])
            expect(validarCorreoCuenta('paz@' + d)).toBe('');
        expect(validarCorreoCuenta('paz@duoc.cl.ejemplo.com')).toBeTruthy();
    });
    it('controla 100 caracteres en correo y 4 a 10 en el acceso', () => {
        expect(validarCorreoCuenta('a'.repeat(95) + '@duoc.cl')).toBeTruthy();
        for (const clave of ['abc', '12345678901'])
            expect(validarLogin({ email: cuenta.email, clave }).clave).toBeTruthy();
        expect(validarLogin({ email: cuenta.email, clave: 'abcd' })).toEqual({});
    });
    it('acepta la cuenta completa y el nacimiento omitido', () =>
        expect(validarRegistro(cuenta)).toEqual({}));
    it('rechaza apellidos y dirección demasiado largos y fecha futura', () => {
        const e = validarRegistro({
            ...cuenta,
            apellidos: 'A'.repeat(101),
            direccion: 'A'.repeat(301),
            nacimiento: '2099-01-01',
        });
        expect(Object.keys(e).sort()).toEqual(['apellidos', 'direccion', 'nacimiento']);
    });
    it('incluye las 16 regiones y 346 comunas del recurso entregado', () => {
        expect(REGIONES.length).toBe(16);
        expect(REGIONES.reduce((n, r) => n + r.comunas.length, 0)).toBe(346);
        expect(comunasDe('Región Metropolitana de Santiago')).toContain('Isla de Maipo');
    });
    it('correo de contacto opcional y máximos inclusivos', () => {
        expect(
            validarContacto({ nombre: 'A'.repeat(100), correo: '', comentario: 'C'.repeat(500) }),
        ).toEqual({});
        expect(
            Object.keys(
                validarContacto({
                    nombre: 'A'.repeat(101),
                    correo: 'x@otro.cl',
                    comentario: 'C'.repeat(501),
                }),
            ).length,
        ).toBe(3);
    });
    it('acepta precio cero o centésimas; rechaza stock fraccionario y SKU corto', () => {
        const p = {
            sku: 'TEC',
            nombre: 'Teclado',
            marca: 'Demo',
            categoriaId: '1',
            precio: '0',
            precioNormal: '',
            stock: '0',
        };
        const cats = [{ id: 1 }];
        expect(validarProducto(p, cats)).toEqual({});
        expect(validarProducto({ ...p, precio: '1990.50' }, cats)).toEqual({});
        expect(
            validarProducto({ ...p, sku: 'X'.repeat(420), precio: '1000000500.34' }, cats),
        ).toEqual({});
        expect(
            Object.keys(
                validarProducto({ ...p, sku: 'AA', stock: '1.5', precio: '0.001' }, cats),
            ).sort(),
        ).toEqual(['precio', 'sku', 'stock']);
    });
    it('muestra el precio exacto del catálogo y repite el redondeo del servidor al agregar', () => {
        expect(precioFinal({ precioVigente: 1990.5 })).toBe(1990.5);
        expect(agregarAlCarrito([], { id: 1, precio: 1990.5, stock: 2 }).lineas[0].precio).toBe(
            1991,
        );
    });
});
