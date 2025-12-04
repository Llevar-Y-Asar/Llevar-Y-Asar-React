import { useState, useEffect } from 'react';

export default function AdminOrdenes() {
    const [ordenes, setOrdenes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarOrdenes();
    }, []);

    const cargarOrdenes = async () => {
        setCargando(true);
        try {
            const respuesta = await fetch('http://localhost:8080/api/ordenes', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (respuesta.ok) {
                const data = await respuesta.json();
                setOrdenes(Array.isArray(data) ? data : []);
            } else {
                setError('Error al cargar órdenes');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('No se pudo conectar al servidor');
        } finally {
            setCargando(false);
        }
    };

    const cambiarEstado = async (ordenId, nuevoEstado) => {
        try {
            const respuesta = await fetch(`http://localhost:8080/api/ordenes/${ordenId}/estado`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (respuesta.ok) {
                alert('✅ Estado actualizado');
                cargarOrdenes();
            } else {
                alert('❌ Error al actualizar estado');
            }
        } catch (err) {
            alert('❌ Error al conectar');
        }
    };

    if (cargando) {
        return <div className="admin-section"><p>Cargando órdenes...</p></div>;
    }

    if (error) {
        return <div className="admin-section"><p style={{ color: 'red' }}>❌ {error}</p></div>;
    }

    const totalVentas = ordenes.reduce((sum, orden) => sum + (orden.total || 0), 0);

    return (
        <div className="admin-section">
            <h2>📋 Órdenes</h2>

            <div className="admin-stats">
                <div className="stat-card">
                    <h3>Total de Órdenes</h3>
                    <p className="stat-number">{ordenes.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Ventas Totales</h3>
                    <p className="stat-number">${totalVentas.toLocaleString('es-CL')}</p>
                </div>
            </div>

            {ordenes.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                    No hay órdenes registradas
                </p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID Orden</th>
                            <th>Usuario ID</th>
                            <th>Cantidad Items</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordenes.map(orden => (
                            <tr key={orden._id || orden.id}>
                                <td>#{orden.numeroOrden || orden._id?.substring(0, 8)}</td>
                                <td>{orden.usuarioId || 'N/A'}</td>
                                <td>{(orden.items || []).length}</td>
                                <td>${(orden.total || 0).toLocaleString('es-CL')}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: orden.estado === 'entregado' ? '#d4edda' : 
                                                   orden.estado === 'cancelado' ? '#f8d7da' : '#fff3cd',
                                        color: orden.estado === 'entregado' ? '#155724' :
                                               orden.estado === 'cancelado' ? '#721c24' : '#856404'
                                    }}>
                                        {orden.estado || 'pendiente'}
                                    </span>
                                </td>
                                <td>{orden.fechaCreacion ? new Date(orden.fechaCreacion).toLocaleDateString('es-CL') : 'N/A'}</td>
                                <td style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                    {orden.estado !== 'entregado' && (
                                        <button 
                                            onClick={() => cambiarEstado(orden._id || orden.id, 'entregado')}
                                            style={{ background: '#28a745', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                        >
                                            ✓ Entregar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}