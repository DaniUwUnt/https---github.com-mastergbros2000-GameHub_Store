// Validaciones de los formularios. Cada función devuelve '' si el valor sirve, o el mensaje que se
// muestra junto al campo. Las validarX(datos) devuelven un objeto { campo: mensaje } solo con los errores.
import { validarCorreoCuenta, validarRun } from './identidad.js';
import { regionPorNombre } from '../data/regiones.js';
import { aFechaISO } from './formato.js';

export const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarCorreo(valor = '') {
    if (!valor.trim()) return 'Escribe tu correo.';
    return REGEX_CORREO.test(valor.trim())
        ? ''
        : 'Escribe un correo válido, por ejemplo nombre@correo.cl.';
}

export function validarTelefono(valor = '') {
    if (!valor.trim()) return 'Escribe tu teléfono.';
    return /^9\d{8}$/.test(valor)
        ? ''
        : 'Usa solo números: 9 dígitos que empiezan con 9, por ejemplo 912345678.';
}

export function validarClave(valor = '') {
    if (valor.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (valor.length > 10) return 'La contraseña admite hasta 10 caracteres.';
    if (!/\d/.test(valor)) return 'La contraseña debe incluir al menos un número.';
    return '';
}

export function validarNombre(valor = '') {
    return valor.trim().length >= 3 ? '' : 'Escribe tu nombre y apellido.';
}

export function validarDireccion(valor = '') {
    if (valor.trim().length > 300) return 'La dirección admite hasta 300 caracteres.';
    return valor.trim().length >= 5 ? '' : 'Escribe la dirección de despacho: calle y número.';
}

export function validarComuna(region, comuna) {
    if (!comuna) return 'Elige una comuna.';
    const datos = regionPorNombre(region);
    return datos && !datos.comunas.includes(comuna)
        ? 'Esa comuna no pertenece a la región elegida.'
        : '';
}

function soloErrores(errores) {
    return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje));
}

// Checkout: todos los datos de despacho son obligatorios
export function validarDespacho(datos) {
    return soloErrores({
        nombre: validarNombre(datos.nombre),
        correo: validarCorreo(datos.correo),
        telefono: validarTelefono(datos.telefono),
        region: datos.region ? '' : 'Elige una región.',
        comuna: validarComuna(datos.region, datos.comuna),
        direccion: validarDireccion(datos.direccion),
    });
}

export function validarLogin(datos) {
    return soloErrores({
        email: validarCorreoCuenta(datos.email),
        clave: !datos.clave
            ? 'Escribe tu contraseña.'
            : datos.clave.length < 4 || datos.clave.length > 10
              ? 'Usa entre 4 y 10 caracteres.'
              : '',
    });
}

// Registro: además revisa que las dos contraseñas coincidan y que se acepten los términos
export function validarRegistro(datos) {
    return soloErrores({
        run: validarRun(datos.run),
        nombre:
            datos.nombre?.trim() && datos.nombre.trim().length <= 50
                ? ''
                : 'Escribe un nombre de hasta 50 caracteres.',
        apellidos:
            datos.apellidos?.trim() && datos.apellidos.trim().length <= 100
                ? ''
                : 'Escribe tus apellidos (hasta 100 caracteres).',
        nacimiento:
            datos.nacimiento && datos.nacimiento > aFechaISO()
                ? 'La fecha no puede estar en el futuro.'
                : '',
        email: validarCorreoCuenta(datos.email),
        telefono: validarTelefono(datos.telefono),
        clave: validarClave(datos.clave),
        confirmacion: datos.confirmacion === datos.clave ? '' : 'Las contraseñas no coinciden.',
        region: datos.region ? '' : 'Elige una región.',
        comuna: validarComuna(datos.region, datos.comuna),
        direccion: validarDireccion(datos.direccion),
        terminos: datos.terminos ? '' : 'Debes aceptar los términos para crear la cuenta.',
    });
}

// Filtro del catálogo: el mínimo no puede ser mayor que el máximo
export function validarRangoPrecio(minimo, maximo) {
    if (minimo === '' || maximo === '') return '';
    return Number(minimo) > Number(maximo) ? 'El mínimo no puede ser mayor que el máximo.' : '';
}

// Panel de administración: precio mayor que cero y una categoría que exista
export function validarProducto(datos, categorias) {
    const precio = Number(datos.precio);
    const precioNormal = datos.precioNormal === '' ? null : Number(datos.precioNormal);
    return soloErrores({
        stockCritico:
            datos.stockCritico != null &&
            datos.stockCritico !== '' &&
            (!Number.isInteger(Number(datos.stockCritico)) || Number(datos.stockCritico) < 0)
                ? 'Usa un umbral entero desde cero.'
                : '',
        sku:
            datos.sku.trim().length >= 3 && datos.sku.trim().length <= 255
                ? ''
                : 'El SKU admite entre 3 y 255 caracteres.',
        nombre:
            datos.nombre.trim() && datos.nombre.trim().length <= 100
                ? ''
                : 'Escribe un nombre de hasta 100 caracteres.',
        descripcion:
            (datos.descripcion ?? '').trim().length <= 500
                ? ''
                : 'La descripción admite hasta 500 caracteres.',
        stock:
            datos.stock === '' ||
            (datos.stock !== undefined &&
                (!Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0))
                ? 'Escribe un stock entero, igual o mayor que cero.'
                : '',
        marca: datos.marca.trim() ? '' : 'Escribe la marca.',
        categoriaId: categorias.some((c) => String(c.id) === String(datos.categoriaId))
            ? ''
            : 'Elige una categoría que exista.',
        precio: /^\d{1,9}(\.\d{1,2})?$/.test(String(datos.precio))
            ? ''
            : 'Usa un precio desde cero y hasta dos decimales.',
        precioNormal:
            precioNormal === null ||
            (/^\d{1,9}(\.\d{1,2})?$/.test(String(datos.precioNormal)) && precioNormal > precio)
                ? ''
                : 'El precio normal debe ser mayor que el precio de oferta.',
    });
}

// Promociones: la fecha de término no puede ser anterior a la de inicio
export function validarPromocion(datos) {
    const porcentaje = Number(datos.porcentaje);
    return soloErrores({
        codigo: /^[A-Za-z0-9]{4,20}$/.test(datos.codigo)
            ? ''
            : 'El código usa de 4 a 20 letras o números, sin espacios.',
        porcentaje: porcentaje >= 1 && porcentaje <= 90 ? '' : 'El descuento va de 1 % a 90 %.',
        tope: Number(datos.tope) > 0 ? '' : 'El tope de descuento debe ser mayor que cero.',
        usosMaximos: Number(datos.usosMaximos) >= 1 ? '' : 'El tope de usos debe ser al menos 1.',
        inicio: datos.inicio ? '' : 'Elige la fecha de inicio.',
        termino: !datos.termino
            ? 'Elige la fecha de término.'
            : datos.inicio && datos.termino < datos.inicio
              ? 'La fecha de término no puede ser anterior a la de inicio.'
              : '',
    });
}

// Ajuste de stock: el resultado nunca puede quedar negativo
export function validarMovimiento(tipo, cantidad, stockActual) {
    const n = Number(cantidad);
    if (cantidad === '' || !Number.isInteger(n) || n < 0) return 'Escribe una cantidad entera.';
    if (tipo !== 'AJUSTE' && n === 0) return 'La cantidad debe ser mayor que cero.';
    const resultado =
        tipo === 'INGRESO' ? stockActual + n : tipo === 'SALIDA' ? stockActual - n : n;
    if (resultado < 0)
        return `La salida deja el stock en −${Math.abs(resultado)}. El stock no puede quedar negativo.`;
    if (tipo === 'AJUSTE' && n === stockActual) return 'El conteo coincide con el stock actual.';
    return '';
}

// Reseña: de 1 a 5 estrellas y un comentario de 10 a 500 caracteres
export function validarResena(datos) {
    const largo = (datos.comentario ?? '').trim().length;
    return soloErrores({
        puntuacion:
            datos.puntuacion >= 1 && datos.puntuacion <= 5 ? '' : 'Elige de 1 a 5 estrellas.',
        comentario:
            largo < 10
                ? 'Escribe al menos 10 caracteres.'
                : largo > 500
                  ? 'La reseña tiene hasta 500 caracteres.'
                  : '',
    });
}

// Garantía: un motivo de la lista y una descripción de al menos 20 caracteres
export function validarGarantia(datos) {
    const largo = (datos.descripcion ?? '').trim().length;
    return soloErrores({
        motivo: datos.motivo ? '' : 'Elige el motivo de la solicitud.',
        descripcion:
            largo < 20
                ? `Describe el problema con al menos 20 caracteres (llevas ${largo}).`
                : largo > 600
                  ? 'La descripción tiene hasta 600 caracteres.'
                  : '',
    });
}

// Una garantía no se cierra (resuelta o rechazada) sin escribir qué se hizo
export function validarResolucion(estado, resolucion = '') {
    const cierra = estado === 'RESUELTA' || estado === 'RECHAZADA';
    return cierra && !resolucion.trim() ? 'Escribe la resolución antes de cerrar la garantía.' : '';
}

// Despacho del operador: seguimiento de hasta 30 caracteres y entrega estimada desde hoy en adelante
export function validarDatosDespacho(datos, hoy = aFechaISO()) {
    return soloErrores({
        seguimiento:
            (datos.seguimiento ?? '').trim().length > 30
                ? 'El número de seguimiento tiene hasta 30 caracteres.'
                : '',
        fechaEstimada:
            datos.fechaEstimada && datos.fechaEstimada < hoy
                ? 'La fecha estimada no puede estar en el pasado.'
                : '',
    });
}

// Categoría: nombre obligatorio y sin repetir otra existente (sin importar mayúsculas)
export function validarCategoria(nombre, categorias, idActual = null) {
    const limpio = nombre.trim();
    if (!limpio) return 'Escribe el nombre de la categoría.';
    if (limpio.length > 60) return 'El nombre tiene hasta 60 caracteres.';
    const repetida = categorias.find(
        (c) => c.id !== idActual && c.nombre.toLowerCase() === limpio.toLowerCase(),
    );
    return repetida ? `La categoría «${repetida.nombre}» ya existe.` : '';
}
