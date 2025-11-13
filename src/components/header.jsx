// src/components/Header.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CarritoContext } from '../context/CarritoContext';
import { useUsuario } from '../context/UsuarioContext';

export function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { getCantidadItems } = useContext(CarritoContext);
    const { usuarioLogueado, cerrarSesion } = useUsuario();
    const cantidadItems = getCantidadItems();

    const isActive = (path) => location.pathname === path ? 'is-active' : '';

    const handleCerrarSesion = () => {
        cerrarSesion();
        navigate('/');
    };

    return (
    <header>
        <div className="logo">Llevar & Asar</div>
        <nav>
        <ul>
            <li><Link to="/" className={isActive('/')}>Inicio</Link></li>
            <li><Link to="/productos" className={isActive('/productos')}>Productos</Link></li>
            <li><Link to="/nosotros" className={isActive('/nosotros')}>Nosotros</Link></li>
            <li><Link to="/blog" className={isActive('/blog')}>Blog</Link></li>
            <li><Link to="/contacto" className={isActive('/contacto')}>Contacto</Link></li>
            
            {usuarioLogueado ? (
                <>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#5cb85c', fontWeight: 'bold' }}>👤 {usuarioLogueado.nombre.split(' ')[0]}</span>
                        <Link to="/perfil" className={isActive('/perfil')} style={{ color: '#007bff' }}>Perfil</Link>
                        <button 
                            onClick={handleCerrarSesion}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#d9534f',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontSize: '0.9em'
                            }}
                        >
                            Logout
                        </button>
                    </li>
                </>
            ) : (
                <>
                    <li><Link to="/login" className={isActive('/login')}>Iniciar Sesión</Link></li>
                    <li><Link to="/registro" className={isActive('/registro')}>Registro</Link></li>
                </>
            )}
            
            <li>
            <Link to="/carrito" className={`cart-icon ${isActive('/carrito')}`}>
                🛒 <span className="cart-count">{cantidadItems}</span>
            </Link>
            </li>
        </ul>
        </nav>
    </header>
    );
}