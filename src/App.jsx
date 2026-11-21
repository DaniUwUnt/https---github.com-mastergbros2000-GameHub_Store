import { useEffect } from 'react';
import {
    BrowserRouter,
    Link,
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';
import './integracion/styles/tema.css';
import './integracion/styles/app.css';
import './App.css';
import './integracion/styles/ep3.css';
import Blog from './components/Blog.jsx';
import Categories from './components/Categories.jsx';
import Contacto from './components/Contacto.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Nosotros from './components/Nosotros.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import ProductList from './components/ProductList.jsx';
import { CartProvider } from './context/CartContext.jsx';
import AvisoSesion from './integracion/components/AvisoSesion.jsx';
import { Cargando, MensajeError } from './integracion/components/Estado.jsx';
import RutaProtegida from './integracion/components/RutaProtegida.jsx';
import AuthProvider from './integracion/context/AuthProvider.jsx';
import CarritoProvider from './integracion/context/CarritoProvider.jsx';
import { useAuth } from './integracion/context/useAuth.js';
import { useCarrito } from './integracion/context/useCarrito.js';
import { useCarga } from './integracion/hooks/useCarga.js';
import Acceso from './integracion/pages/Acceso.jsx';
import Carrito from './integracion/pages/Carrito.jsx';
import Checkout from './integracion/pages/Checkout.jsx';
import Confirmacion from './integracion/pages/Confirmacion.jsx';
import MisOrdenes from './integracion/pages/MisOrdenes.jsx';
import PanelAdmin from './integracion/pages/PanelAdmin.jsx';
import PanelOperador from './integracion/pages/PanelOperador.jsx';
import Ventas from './integracion/pages/Ventas.jsx';
import { cargarCatalogo, cargarDetalle } from './services/catalogoApi.js';
import Home from './pages/Home.jsx';

const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER;

function Carga({ consulta, children }) {
    if (consulta.cargando) return <Cargando texto="Consultando el catálogo…" />;
    if (consulta.error)
        return <MensajeError error={consulta.error} alReintentar={consulta.recargar} />;
    return children(consulta.datos);
}

function Vitrina({ vista, soloLectura = false }) {
    const { nombre } = useParams();
    const consulta = useCarga(() => cargarCatalogo(nombre), [nombre]);
    return (
        <Carga consulta={consulta}>
            {({ productos, categorias }) => {
                if (vista === 'inicio')
                    return <Home productos={productos} categorias={categorias} />;
                if (vista === 'categorias')
                    return <Categories categorias={categorias} productos={productos} />;
                return (
                    <section className="seccion">
                        <h1>
                            {nombre ??
                                (vista === 'ofertas'
                                    ? 'Productos en oferta'
                                    : 'Catálogo de productos')}
                        </h1>
                        <ProductList
                            key={nombre ?? vista}
                            productos={productos}
                            categoriasApi={categorias}
                            mostrarFiltros={vista !== 'ofertas'}
                            soloOfertas={vista === 'ofertas'}
                            soloLectura={soloLectura}
                        />
                    </section>
                );
            }}
        </Carga>
    );
}

function Detalle({ soloLectura }) {
    const { id } = useParams();
    const consulta = useCarga(() => cargarDetalle(id), [id]);
    if (consulta.error?.estado === 404) return <ProductDetail />;
    return (
        <Carga consulta={consulta}>
            {(datos) => <ProductDetail key={id} {...datos} soloLectura={soloLectura} />}
        </Carga>
    );
}

function Privada({ rol, children }) {
    return <RutaProtegida rol={rol}>{children}</RutaProtegida>;
}

function Tienda({ children }) {
    const { rol } = useAuth();
    return rol === 'VENDEDOR' ? <Navigate to="/vendedor" replace /> : children;
}

function AppContent() {
    const { usuario, rol, salir } = useAuth();
    const { unidades, vaciar } = useCarrito();
    const navegar = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    function cerrarSesion() {
        vaciar();
        salir();
        navegar('/', { replace: true });
    }

    return (
        <div className="App">
            <a className="saltar-contenido" href="#contenido">
                Saltar al contenido
            </a>
            <Header cantidad={unidades} usuario={usuario} cerrarSesion={cerrarSesion} />
            <AvisoSesion />
            <main id="contenido" tabIndex={-1} className="contenedor contenido-principal">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Tienda>
                                <Vitrina vista="inicio" />
                            </Tienda>
                        }
                    />
                    <Route
                        path="/productos"
                        element={<Vitrina vista="productos" soloLectura={rol === 'VENDEDOR'} />}
                    />
                    <Route
                        path="/categorias"
                        element={
                            <Tienda>
                                <Vitrina vista="categorias" />
                            </Tienda>
                        }
                    />
                    <Route
                        path="/categorias/:nombre"
                        element={
                            <Tienda>
                                <Vitrina vista="productos" />
                            </Tienda>
                        }
                    />
                    <Route
                        path="/ofertas"
                        element={
                            <Tienda>
                                <Vitrina vista="ofertas" />
                            </Tienda>
                        }
                    />
                    <Route
                        path="/detalle/:id"
                        element={<Detalle soloLectura={rol === 'VENDEDOR'} />}
                    />
                    <Route
                        path="/carrito"
                        element={
                            <Tienda>
                                <Carrito />
                            </Tienda>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <Privada rol="CLIENTE">
                                <Checkout />
                            </Privada>
                        }
                    />
                    <Route
                        path="/ordenes/:id/confirmacion"
                        element={
                            <Privada rol="CLIENTE">
                                <Confirmacion />
                            </Privada>
                        }
                    />
                    <Route
                        path="/mis-ordenes"
                        element={
                            <Privada rol="CLIENTE">
                                <MisOrdenes />
                            </Privada>
                        }
                    />
                    <Route
                        path="/vendedor"
                        element={
                            <Privada rol="VENDEDOR">
                                <Ventas />
                            </Privada>
                        }
                    />
                    <Route
                        path="/operador"
                        element={
                            <Privada rol="ADMIN">
                                <PanelOperador />
                            </Privada>
                        }
                    />
                    <Route
                        path="/administracion/*"
                        element={
                            <Privada rol="ADMIN">
                                <PanelAdmin />
                            </Privada>
                        }
                    />
                    <Route
                        path="/blog"
                        element={
                            <Tienda>
                                <Blog />
                            </Tienda>
                        }
                    />
                    <Route
                        path="/nosotros"
                        element={
                            <Tienda>
                                <Nosotros />
                            </Tienda>
                        }
                    />
                    <Route
                        path="/contacto"
                        element={
                            <Tienda>
                                <Contacto />
                            </Tienda>
                        }
                    />
                    <Route path="/ingresar" element={<Acceso />} />
                    <Route
                        path="/registro"
                        element={<Navigate to="/ingresar#titulo-registro" replace />}
                    />
                    <Route
                        path="*"
                        element={
                            <section className="seccion centrado">
                                <h1>Página no encontrada</h1>
                                <Link className="boton" to="/">
                                    Volver al inicio
                                </Link>
                            </section>
                        }
                    />
                </Routes>
            </main>
            {rol !== 'VENDEDOR' && (
                <>
                    <Footer />
                    {/^\d{8,15}$/.test(whatsapp ?? '') ? (
                        <a
                            className="boton-whatsapp"
                            href={`https://wa.me/${whatsapp}?text=Hola%20GameHub%20Store`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            WhatsApp
                        </a>
                    ) : (
                        <Link className="boton-whatsapp" to="/contacto">
                            Ayuda
                        </Link>
                    )}
                </>
            )}
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <AuthProvider>
                <CarritoProvider>
                    <CartProvider>
                        <AppContent />
                    </CartProvider>
                </CarritoProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
