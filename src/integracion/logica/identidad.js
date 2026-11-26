// Reglas del anexo EFT. El cuerpo del RUN se multiplica de derecha a izquierda por 2, 3, …, 7.
export function validarRun(valor = '') {
    const run = valor.trim().toUpperCase();
    if (!/^[1-9]\d{5,7}[\dK]$/.test(run))
        return 'Escribe tu RUN sin puntos ni guion (7 a 9 caracteres).';
    let suma = 0;
    let peso = 2;
    for (const digito of [...run.slice(0, -1)].reverse()) {
        suma += Number(digito) * peso;
        peso = peso === 7 ? 2 : peso + 1;
    }
    const resto = 11 - (suma % 11);
    const verificador = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
    return run.endsWith(verificador) ? '' : 'El dígito verificador del RUN no coincide.';
}
export function validarCorreoCuenta(valor = '') {
    const correo = valor.trim();
    if (!correo) return 'Escribe tu correo.';
    if (correo.length > 100) return 'El correo admite hasta 100 caracteres.';
    return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correo)
        ? ''
        : 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
}
export function validarContacto({ nombre = '', correo = '', comentario = '' }) {
    const errores = {};
    if (!nombre.trim() || nombre.trim().length > 100)
        errores.nombre = 'Escribe un nombre de 1 a 100 caracteres.';
    if (correo.trim() && validarCorreoCuenta(correo)) errores.correo = validarCorreoCuenta(correo);
    if (!comentario.trim() || comentario.trim().length > 500)
        errores.comentario = 'Escribe un comentario de 1 a 500 caracteres.';
    return errores;
}
