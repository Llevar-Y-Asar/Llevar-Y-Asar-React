// src/pages/home.jsx
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useProductos } from '../context/productosContext';

export function Home() {
    const { agregarAlCarrito } = useCarrito();
    const { productos } = useProductos();
    
    return (
    <>
      {/* Hero */}
      <section id="hero" aria-label="Hero">
        <div className="hero__contenido">
            <h1><span className="resaltado">🔥 Sabor</span> que se <span className="resaltado">lleva</span> y se <span className="resaltado">asa</span></h1>
            <p>Los mejores cortes y embutidos, directo a tu mesa.</p>
            <Link to="/productos" className="btn-hero">Ver catálogo</Link>
        </div>
      </section>

      <main>
        {/* Categorías */}
        <section id="categorias" aria-label="Categorías">
          <h2>Explora por categoría</h2>
          <div className="categorias-grid">
              <div className="categoria">🥩 Cortes Premium</div>
              <div className="categoria">🌭 Embutidos</div>
              <div className="categoria">🍖 Combos</div>
              <div className="categoria">🔥 Parrilladas</div>
          </div>
        </section>

        {/* Productos Destacados */}
        <section id="featured-products">
          <h2>Productos destacados</h2>
          <div className="product-grid">
              {productos.slice(0, 3).map(producto => (
              <article key={producto.id} className="product-card">
                  <img src={producto.imagen} alt={producto.nombre} />
                  <h3>{producto.nombre}</h3>
                  <p className="price">${producto.precio.toLocaleString('es-CL')}</p>
                  <p style={{ fontSize: '0.9em', margin: '5px 0' }}>
                    Stock: <span style={{ 
                        color: producto.stock <= 3 ? '#d9534f' : '#5cb85c',
                        fontWeight: 'bold'
                    }}>{producto.stock}</span> {producto.stock <= 3 ? '⚠️' : ''}
                  </p>
                  <button 
                    className="btn" 
                    onClick={() => agregarAlCarrito(producto)}
                    disabled={producto.stock === 0}
                    style={{
                        opacity: producto.stock === 0 ? 0.5 : 1,
                        cursor: producto.stock === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                  </button>
              </article>
              ))}
          </div>
        </section>

        {/* Testimonios */}
        <section id="testimonios">
          <h2>Lo que dicen nuestros clientes</h2>
          <div className="testimonios-grid">
              <div className="testimonio">
              <blockquote>"La carne llegó fresca y deliciosa, ¡el asado fue un éxito!"</blockquote>
              <h4>- Carolina, Santiago</h4>
              </div>
              <div className="testimonio">
              <blockquote>"Excelente atención y productos de primera calidad."</blockquote>
              <h4>- Felipe, Ñuñoa</h4>
              </div>
              <div className="testimonio">
              <blockquote>"Los combos familiares son perfectos para el fin de semana."</blockquote>
              <h4>- Marcela, Maipú</h4>
              </div>
          </div>
        </section>

        {/* CTA Final */}
        <section id="cta-final">
          <h2>¿Listo para tu próximo asado?</h2>
          <Link to="/productos" className="btn-hero">Explorar catálogo</Link>
        </section>
      </main>
    </>
    );
}