import { useUsuario } from '../../context/UsuarioContext';

export default function AdminUsuarios() {
    const { usuarios, actualizarUsuario, eliminarUsuario } = useUsuario();

    const handleEliminar = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            eliminarUsuario(id);
            alert('✅ Usuario eliminado');
        }
    };

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
                            <th>ID</th>
                            <th>RUT</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Región</th>
                            <th>Órdenes</th>
                            <th>Fecha Registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.run}</td>
                                <td>{usuario.nombre} {usuario.apellidos}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.region || 'N/A'}</td>
                                <td>{(usuario.ordenes || []).length}</td>
                                <td>{new Date(usuario.fechaRegistro).toLocaleDateString('es-CL')}</td>
                                <td style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                    <button 
                                        onClick={() => handleEliminar(usuario.id)}
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
