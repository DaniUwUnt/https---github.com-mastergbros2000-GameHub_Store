import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';

const enlaces = [
    ['/', 'Inicio'],
    ['/productos', 'Productos'],
    ['/categorias', 'Categorías'],
    ['/ofertas', 'Ofertas'],
    ['/blog', 'Blog'],
    ['/nosotros', 'Nosotros'],
    ['/contacto', 'Contacto'],
];

export default function Header({ cantidad, usuario, cerrarSesion }) {
    const [abierto, setAbierto] = useState(false);
    const { pathname } = useLocation();
    const vendedor = usuario?.rol === 'VENDEDOR';
    const visibles = vendedor
        ? [
              ['/productos', 'Productos'],
              ['/vendedor', 'Órdenes'],
          ]
        : [...enlaces];
    if (usuario?.rol === 'CLIENTE') visibles.push(['/mis-ordenes', 'Mis órdenes']);
    if (usuario?.rol === 'ADMIN')
        visibles.push(['/administracion', 'Administración'], ['/operador', 'Operaciones']);

    return (
        <header className="cabecera">
            <Navbar expand="xl" expanded={abierto} onToggle={setAbierto} data-bs-theme="dark">
                <Container className="contenedor">
                    <Navbar.Brand
                        as={Link}
                        to={vendedor ? '/vendedor' : '/'}
                        className="marca"
                        onClick={() => setAbierto(false)}
                    >
                        GameHub <span>Store</span>
                    </Navbar.Brand>
                    <Navbar.Toggle
                        aria-controls="menu-principal"
                        label="Abrir menú"
                        aria-expanded={abierto}
                    />
                    <Navbar.Collapse id="menu-principal">
                        <Nav className="navegacion ms-auto" aria-label="Navegación principal">
                            {visibles.map(([ruta, texto]) => (
                                <Nav.Link
                                    as={NavLink}
                                    to={ruta}
                                    end={ruta === '/'}
                                    key={ruta}
                                    onClick={() => setAbierto(false)}
                                >
                                    {texto}
                                </Nav.Link>
                            ))}
                            {!vendedor && (
                                <Nav.Link as={Link} to="/carrito" onClick={() => setAbierto(false)}>
                                    Carrito <span className="contador-carrito">{cantidad}</span>
                                </Nav.Link>
                            )}
                            {usuario ? (
                                <button className="boton boton-secundario" onClick={cerrarSesion}>
                                    Cerrar sesión
                                </button>
                            ) : (
                                <Nav.Link
                                    as={Link}
                                    to="/ingresar"
                                    onClick={() => setAbierto(false)}
                                >
                                    Ingresar
                                </Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="visually-hidden" aria-live="polite">
                Página {pathname}
            </div>
        </header>
    );
}
