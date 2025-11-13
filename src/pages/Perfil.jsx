import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext';

export function Perfil() {
    const navigate = useNavigate();
    const { usuarioLogueado, cerrarSesion } = useUsuario();

    if (!usuarioLogueado) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1>🚫 Acceso denegado</h1>
                <p style={{ fontSize: '1.1em', margin: '1rem 0', color: '#666' }}>Debes iniciar sesión para ver tu perfil.</p>
                <button 
                    onClick={() => navigate('/login')} 
                    className="btn" 
                    style={{ maxWidth: '200px', margin: '2rem auto' }}
                >
                    Ir a Login
                </button>
            </main>
        );
    }

    const handleCerrarSesion = () => {
        cerrarSesion();
        alert('✅ Sesión cerrada');
        navigate('/');
    };

    const ordenes = usuarioLogueado.ordenes || [];

    return (
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>👤 Mi Perfil</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                {/* Datos del Usuario */}
                <section style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
                    <h2>📋 Mis Datos</h2>
                    <div style={{ marginTop: '1rem' }}>
                        <p><strong>Nombre:</strong> {usuarioLogueado.nombre} {usuarioLogueado.apellidos}</p>
                        <p><strong>RUT:</strong> {usuarioLogueado.run}</p>
                        <p><strong>Email:</strong> {usuarioLogueado.email}</p>
                        <p><strong>Región:</strong> {usuarioLogueado.region || 'No especificada'}</p>
                        <p><strong>Miembro desde:</strong> {new Date(usuarioLogueado.fechaRegistro).toLocaleDateString('es-CL')}</p>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <button
                            onClick={() => navigate('/registro')}
                            style={{
                                background: '#007bff',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginRight: '10px',
                                fontSize: '0.95em'
                            }}
                        >
                            ✏️ Editar Perfil
                        </button>
                        <button
                            onClick={handleCerrarSesion}
                            style={{
                                background: '#d9534f',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.95em'
                            }}
                        >
                            🚪 Cerrar Sesión
                        </button>
                    </div>
                </section>

                {/* Stats */}
                <section style={{ background: '#f0f8ff', padding: '1.5rem', borderRadius: '8px' }}>
                    <h2>📊 Estadísticas</h2>
                    <div style={{ marginTop: '1rem', fontSize: '1.2em' }}>
                        <p>
                            <strong style={{ fontSize: '1.5em', color: '#5cb85c' }}>{ordenes.length}</strong>
                            <br/>
                            Órdenes realizadas
                        </p>
                        <p style={{ marginTop: '1.5rem' }}>
                            <strong style={{ fontSize: '1.5em', color: '#007bff' }}>
                                ${ordenes.reduce((total, orden) => total + (orden.total || 0), 0).toLocaleString('es-CL')}
                            </strong>
                            <br/>
                            Total gastado
                        </p>
                    </div>
                </section>
            </div>

            {/* Historial de Órdenes */}
            <section style={{ marginTop: '2rem', background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
                <h2>🛍️ Historial de Órdenes</h2>
                
                {ordenes.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', marginTop: '1rem' }}>
                        Aún no has realizado ninguna compra.
                    </p>
                ) : (
                    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #333', background: '#e9ecef' }}>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>ID Orden</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Productos</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordenes.map(orden => (
                                    <tr key={orden.id} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '10px' }}>
                                            <code style={{ background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>
                                                {orden.id.slice(0, 8)}
                                            </code>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            {orden.fecha}
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            {(orden.items || []).length} producto{(orden.items || []).length !== 1 ? 's' : ''}
                                        </td>
                                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#5cb85c' }}>
                                            ${orden.total.toLocaleString('es-CL')}
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{
                                                background: orden.estado === 'confirmada' ? '#d4edda' : '#fff3cd',
                                                color: orden.estado === 'confirmada' ? '#155724' : '#856404',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.9em'
                                            }}>
                                                {orden.estado === 'confirmada' ? '✅ Confirmada' : '⏳ Pendiente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}
