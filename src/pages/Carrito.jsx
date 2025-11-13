import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

export function Carrito() {
    const { carrito, quitarDelCarrito, vaciarCarrito, getTotalCarrito } = useCarrito();
    const navigate = useNavigate();
    
    if (carrito.length === 0) {
        return (
            <main>
                <section>
                    <h1>🛒 Tu Carrito</h1>
                    <p style={{textAlign: 'center', fontSize: '1.1rem', color: '#666', marginTop: '2rem'}}>
                        Tu carrito está vacío
                    </p>
                    <div style={{textAlign: 'center', marginTop: '2rem'}}>
                        <Link to="/productos" className="btn-hero">
                            Ir a comprar
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <h1>🛒 Tu Carrito</h1>
            <section id="carrito-container" className="carrito-layout">
                
                {/* Lista de productos */}
                <div className="carrito-lista">
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.map(item => (
                                <tr key={item.id}>
                                    <td>{item.nombre}</td>
                                    <td>${item.precio.toLocaleString('es-CL')}</td>
                                    <td>{item.cantidad}</td>
                                    <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                                    <td>
                                        <button 
                                            onClick={() => quitarDelCarrito(item.id)}
                                            style={{
                                                background: '#d9534f',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Quitar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Barra lateral de acciones */}
                <aside className="carrito-acciones">
                    <h2>Total: $<span id="carrito-total">{getTotalCarrito().toLocaleString('es-CL')}</span></h2>
                    <button id="vaciar-carrito" onClick={vaciarCarrito}>Vaciar carrito</button>
                    <button id="finalizar-compra" onClick={() => navigate('/checkout')}>Finalizar compra</button>
                </aside>

            </section>
        </main>
    );
}
