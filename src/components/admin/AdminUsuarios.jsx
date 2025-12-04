import { useState, useEffect } from 'react';

export default function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        setCargando(true);
        try {
            const respuesta = await fetch('http://localhost:8080/api/usuarios', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (respuesta.ok) {
                const data = await respuesta.json();
                setUsuarios(Array.isArray(data) ? data : []);
            } else {
                setError('Error al cargar usuarios');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('No se pudo conectar al servidor');
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = async (rut) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                const respuesta = await fetch(`http://localhost:8080/api/usuarios/${rut}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (respuesta.ok) {
                    alert('✅ Usuario eliminado');
                    cargarUsuarios();
                } else {
                    alert('❌ Error al eliminar usuario');
                }
            } catch (err) {
                alert('❌ Error al conectar con el servidor');
            }
        }
    };

    if (cargando) {
        return <div className="admin-section"><p>Cargando usuarios...</p></div>;
    }

    if (error) {
        return <div className="admin-section"><p style={{ color: 'red' }}>❌ {error}</p></div>;
    }

    return (
        <div className="admin-section">
            <h2>👥 Gestionar Usuarios</h2>
            
            {usuarios.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                    No hay usuarios registrados aún.
                </p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>RUT</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Región</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.rut || usuario._id}>
                                <td>{usuario.rut || 'N/A'}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.telefono || 'N/A'}</td>
                                <td>{usuario.region || 'N/A'}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: usuario.rol === 'ADMIN' ? '#fff3cd' : '#d1ecf1',
                                        color: usuario.rol === 'ADMIN' ? '#856404' : '#0c5460'
                                    }}>
                                        {usuario.rol || 'USER'}
                                    </span>
                                </td>
                                <td style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                    <button 
                                        onClick={() => handleEliminar(usuario.rut)}
                                        style={{ background: '#d9534f', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
