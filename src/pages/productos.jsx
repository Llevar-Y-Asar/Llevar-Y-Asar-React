// src/pages/Productos.jsx
import { useProductos } from '../context/productosContext';
import { useCarrito } from '../context/CarritoContext';

export function Productos() {
    const { productos } = useProductos();
    const { agregarAlCarrito } = useCarrito();

    return (
        <main>
            <section>
                <h1>Nuestros Productos</h1>
                <p>Selecciona tu favorito y llévalo a casa. ¡Todo listo para asar!</p>

                <div id="productos-container" className="product-grid">
                    {productos.map(producto => (
                        <article key={producto.id} className="producto">
                            <div className="producto__contenido">
                                <figure className="producto__media">
                                    <img 
                                        src={producto.imagen} 
                                        alt={producto.nombre}
                                        loading="lazy"
                                        style={{maxWidth: '200px', borderRadius: '8px'}}
                                    />
                                </figure>
                                <div className="producto__info">
                                    <span className="producto__categoria">{producto.categoria}</span>
                                    <h3 className="producto__titulo">{producto.nombre}</h3>
                                    <p className="producto__descripcion">{producto.descripcion}</p>
                                    <p className="producto__precio">${producto.precio.toLocaleString('es-CL')}</p>
                                    <p>Stock: <span style={{ 
                                        color: producto.stock <= 3 ? '#d9534f' : '#5cb85c',
                                        fontWeight: 'bold'
                                    }}>{producto.stock}</span> {producto.stock <= 3 ? '⚠️ Bajo' : ''}</p>
                                    <button 
                                        className="producto__btn" 
                                        onClick={() => agregarAlCarrito(producto)}
                                        disabled={producto.stock === 0}
                                        style={{
                                            opacity: producto.stock === 0 ? 0.5 : 1,
                                            cursor: producto.stock === 0 ? 'not-allowed' : 'pointer',
                                            background: producto.stock === 0 ? '#ccc' : ''
                                        }}
                                    >
                                        {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}