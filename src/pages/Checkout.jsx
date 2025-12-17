import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useUsuario } from '../context/UsuarioContext';
import { useOrdenes } from '../context/OrdenesContext';
import { carritoAPI } from '../services/api';

export function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { carrito, getTotalCarrito, vaciarCarrito } = useCarrito();
    const { usuarioLogueado } = useUsuario();
    const { crearOrden } = useOrdenes();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        direccion: '',
        ciudad: '',
        telefono: '',
        numeroTarjeta: '',
        mesExp: '',
        annoExp: '',
        cvv: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);

    // Redirigir si no hay carrito
    useEffect(() => {
        if (carrito.length === 0 && !orderCreated) {
            navigate('/productos');
        }
    }, [carrito, orderCreated, navigate]);

    // Redirigir a registro si no está logueado y tiene carrito
    useEffect(() => {
        if (!usuarioLogueado && carrito.length > 0) {
            navigate('/registro', { state: { redirect: location.pathname } });
        }
    }, [usuarioLogueado, carrito, navigate, location.pathname]);

    // Cargar datos del usuario si está logueado
    useEffect(() => {
        if (usuarioLogueado) {
            setFormData(prev => ({
                ...prev,
                nombre: usuarioLogueado.nombre || '',
                email: usuarioLogueado.email || '',
                direccion: usuarioLogueado.direccion || '',
                ciudad: usuarioLogueado.ciudad || '',
                telefono: usuarioLogueado.telefono || ''
            }));
        }
    }, [usuarioLogueado]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!formData.nombre || !formData.email || !formData.direccion || !formData.numeroTarjeta) {
            alert('❌ Por favor completa todos los campos');
            return;
        }
        if (formData.numeroTarjeta.replace(/\s/g, '').length !== 16) {
            alert('❌ Número de tarjeta debe tener 16 dígitos');
            return;
        }

        // Requiere login
        if (!usuarioLogueado) {
            alert('❌ Debes crear una cuenta para completar tu compra');
            navigate('/registro', { state: { redirect: location.pathname } });
            return;
        }

        setIsProcessing(true);

        try {
            // Crear orden
            const nuevaOrden = await crearOrden({
                usuarioId: usuarioLogueado.rut,
                items: carrito,
                total: getTotalCarrito(),
                direccionEntrega: formData.direccion
            });

            // Vaciar carrito en backend
            await carritoAPI.vaciar(usuarioLogueado.rut);
            vaciarCarrito();

            setOrderCreated(true);
            setTimeout(() => {
                alert(`✅ ¡Orden confirmada! Número: ${nuevaOrden.numeroOrden}`);
                navigate('/perfil');
            }, 1500);
        } catch (error) {
            setIsProcessing(false);
            alert(`❌ Error al crear la orden: ${error.message}`);
        }
    };

    if (orderCreated) {
        return (
            <main className="text-center" style={{ padding: '2rem', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1 style={{ color: '#5cb85c' }}>✅ ¡Orden Confirmada!</h1>
                <p style={{ fontSize: '1.1em', margin: '1rem 0', color: '#666' }}>Gracias por tu compra.</p>
                <button onClick={() => navigate('/')} className="btn" style={{ maxWidth: '200px', margin: '2rem auto' }}>
                    Volver al inicio
                </button>
            </main>
        );
    }

    return (
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>🛍️ Finalizar Compra</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                {/* Resumen de Orden */}
                <section style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
                    <h2>📋 Resumen de Orden</h2>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {carrito.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                                <span>{item.nombre} x{item.cantidad}</span>
                                <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', fontWeight: 'bold' }}>
                            <span>Total:</span>
                            <span style={{ color: '#5cb85c' }}>${getTotalCarrito().toLocaleString('es-CL')}</span>
                        </div>
                    </div>
                </section>

                {/* Formulario de Checkout */}
                <section>
                    <h2>📮 Información de Entrega</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre completo"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input
                            type="text"
                            name="direccion"
                            placeholder="Dirección"
                            value={formData.direccion}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input
                            type="text"
                            name="ciudad"
                            placeholder="Ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input
                            type="tel"
                            name="telefono"
                            placeholder="Teléfono"
                            value={formData.telefono}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />

                        <h3 style={{ marginTop: '1.5rem' }}>💳 Datos de Pago</h3>
                        <input
                            type="text"
                            name="numeroTarjeta"
                            placeholder="Número de tarjeta (16 dígitos)"
                            value={formData.numeroTarjeta}
                            onChange={(e) => setFormData(prev => ({ ...prev, numeroTarjeta: e.target.value.replace(/\D/g, '').slice(0, 16) }))}
                            required
                            maxLength="16"
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                            <input
                                type="text"
                                name="mesExp"
                                placeholder="MM"
                                value={formData.mesExp}
                                onChange={(e) => setFormData(prev => ({ ...prev, mesExp: e.target.value.replace(/\D/g, '').slice(0, 2) }))}
                                required
                                maxLength="2"
                                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <input
                                type="text"
                                name="annoExp"
                                placeholder="AA"
                                value={formData.annoExp}
                                onChange={(e) => setFormData(prev => ({ ...prev, annoExp: e.target.value.replace(/\D/g, '').slice(0, 2) }))}
                                required
                                maxLength="2"
                                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                        <input
                            type="text"
                            name="cvv"
                            placeholder="CVV (3 dígitos)"
                            value={formData.cvv}
                            onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                            required
                            maxLength="3"
                            style={{ width: '100%', padding: '10px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />

                        <button
                            type="submit"
                            disabled={isProcessing}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: isProcessing ? '#ccc' : '#5cb85c',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '1.1em',
                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {isProcessing ? '⏳ Procesando pago...' : '✅ Confirmar Compra'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/carrito')}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#6c757d',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '1em',
                                cursor: 'pointer',
                                marginTop: '0.5rem'
                            }}
                        >
                            ← Volver al carrito
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}