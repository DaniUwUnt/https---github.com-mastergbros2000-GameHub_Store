# Level-Up Gamer · Evaluación final transversal (DSY1104)

Frontend React del caso Level-Up Gamer. Continúa el proyecto GameHub de la EV3. La rama de la entrega es **eft-levelup**. Backend: https://github.com/DaniUwUnt/GameHub-Store-Backend/tree/eft-levelup.

**Primera ejecución en Windows:** extrae ambos ZIP en carpetas nuevas. Inicia el backend; cuando responda el catálogo en http://localhost:8080/api/v1/productos, abre **INICIAR_FRONTEND.cmd** junto a este archivo. El enlace de Vite suele ser http://localhost:5173. Requiere Node 22.12+ o 24 y acceso a npm la primera vez.

**Defensa:** con la API encendida, muestra una categoría temporal, un pedido y una consulta de contacto. El registro público asigna CLIENTE; Administración puede dar de alta otras cuentas y gestionar sus roles. El RUN utiliza módulo 11. El catálogo conserva centésimas; al añadir al carrito se cobra al peso más cercano por unidad. Las simulaciones de pago no procesan dinero.

**Validación:** \`npm ci\`, \`npm run lint\`, \`npm run build\`, \`npm test\` (Chrome instalado). La cobertura del código cargado por los tests se guarda en \`coverage/\`. No hay credenciales privadas en el frontend.

---

Desarrollo Fullstack II · DSY1104  
Equipo: Brayan Alarcón, Benjamín Bravo y Daniela Salinas.

Continúa la versión `alpha_2.0.1` de la EP2. Mantiene su paleta violeta y fucsia, navegación pública, catálogo, imágenes locales, carrusel y video. React consulta el backend Spring Boot en vez de leer un catálogo simulado.

## Ejecutar

1. Inicie el backend (su README trae Docker/MySQL y una demo local con JDK 21).
2. Use Node.js 22.12 o posterior compatible con el proyecto. Copie `.env.example` como `.env`. `VITE_API_URL` debe apuntar a la raíz del Gateway, por ejemplo `http://localhost:8080`, sin añadir `/api/v1`.
3. Ejecute `npm ci` y `npm run dev -- --strictPort`. Abra [Level-Up Gamer](http://localhost:5173).
4. Las cuentas de demo y `CLAVE_DEMO` están descritas en el README del backend. No copie secretos a las variables `VITE_*`, porque son públicas. `VITE_WHATSAPP_NUMBER` permite configurar el número oficial del equipo; si está vacío, la ayuda abre Contacto.

`npm run build` compila; `npm run lint` revisa el código; `npm test` corre Jasmine y Karma con Chrome instalado y genera `coverage/index.html`. Si Chrome no se encuentra, configure `CHROME_BIN` con la ruta al ejecutable instalado. `npm run format:check` comprueba el formato.

Para desplegar el frontend fuera del equipo, deberá tener un Gateway HTTPS accesible y autorizar el origen de ese frontend en CORS. El Gateway local de la defensa no es accesible desde una URL pública.

## Organización

- `src/App.jsx`: rutas, enlaces por rol y composición de la tienda.
- `src/pages/Home.jsx` y `src/components/`: diseño original, catálogo, detalle, categorías, información.
- `src/services/catalogoApi.js`: adapta el catálogo de la API al formato de tarjetas usado en EP2.
- `src/integracion/services/`: HTTP centralizado, sesión y servicios por área.
- `src/integracion/context/`: carrito y sesión persistidos en el navegador; renovación del JWT y cierre ante expiración.
- `src/integracion/pages/`: acceso y registro, carrito, checkout, mis órdenes, consultas de vendedor y administración.
- `src/tests/` y archivos `*.spec.js` de la integración: pruebas. Las fotos y el video están bajo `public/`.

Los estilos estáticos están en hojas CSS externas. Se conservan estilos en línea para valores que se calculan con los datos, como el ancho de las barras de reseñas o el color de los indicadores de estado.

El carrito local guarda únicamente la intención de compra. El backend comprueba el precio, el cupón (sin descuento adicional sobre oferta), la disponibilidad y los permisos. El frontend muestra estados de carga, vacío y error. Un cliente solo consulta sus propias compras. Vendedor no ve edición ni gestión; administrador mantiene el catálogo y gestiona operaciones.

El contacto es un formulario de demostración, no envía correo. El pago no usa tarjetas reales, y los comprobantes son académicos.

## Procedencia

Base del equipo: [Level-Up Gamer EP2](https://github.com/mastergbros2000/https---github.com-mastergbros2000-GameHub_Store/tree/main/alpha_2.0.1), revisión `6871aa3`. Se conservaron sus componentes de la vitrina y se adaptaron pantallas, servicios y pruebas del [frontend de referencia de cacc92](https://github.com/cacc92/duoc-fullstack2-gamehub-frontend), revisión `e7fc59f`. El trabajo se documenta en los anexos EP3.
