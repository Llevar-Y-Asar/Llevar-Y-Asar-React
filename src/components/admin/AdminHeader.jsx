export default function AdminHeader({ vista, setVista, usuario }) {
    return (
    <div className="admin-header">
        <h1>📊 Panel Administrador</h1>
        <p>Gestiona productos, órdenes y usuarios</p>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button 
                onClick={() => setVista('productos')}
                style={{
                    padding: '10px 20px',
                    background: vista === 'productos' ? '#5cb85c' : '#ddd',
                    color: vista === 'productos' ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.95rem'
                }}
            >
                📦 Productos
            </button>
            
            <button 
                onClick={() => setVista('ordenes')}
                style={{
                    padding: '10px 20px',
                    background: vista === 'ordenes' ? '#5cb85c' : '#ddd',
                    color: vista === 'ordenes' ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.95rem'
                }}
            >
                📋 Órdenes
            </button>
            
            <button 
                onClick={() => setVista('usuarios')}
                style={{
                    padding: '10px 20px',
                    background: vista === 'usuarios' ? '#5cb85c' : '#ddd',
                    color: vista === 'usuarios' ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.95rem'
                }}
            >
                👥 Usuarios
            </button>
        </div>
    </div>
    )
}