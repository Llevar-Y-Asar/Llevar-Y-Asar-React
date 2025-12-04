import { useState, useEffect } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import AdminProductos from '../components/admin/AdminProductos';
import AdminOrdenes from '../components/admin/AdminOrdenes';
import AdminUsuarios from '../components/admin/AdminUsuarios';
import '../../css/admin.css';

export default function Admin() {
    const [vista, setVista] = useState('productos');
    const [isAdmin, setIsAdmin] = useState(false);
    const [usuarioTemp, setUsuarioTemp] = useState(null);

    useEffect(() => {
        // Permitir acceso sin restricción de rol para testing
        const usuarioLogueado = localStorage.getItem('usuario_logueado');
        
        if (usuarioLogueado) {
            try {
                const usuario = JSON.parse(usuarioLogueado);
                setIsAdmin(true);
                setUsuarioTemp(usuario);
            } catch (e) {
                console.error('Error parsing user:', e);
            }
        } else {
            // Para testing: crear usuario admin temporal
            const adminTemporal = {
                rut: '20.000.000-0',
                nombre: 'Administrador',
                rol: 'ADMIN',
                email: 'admin@llevarayasar.cl'
            };
            localStorage.setItem('usuario_logueado', JSON.stringify(adminTemporal));
            setIsAdmin(true);
            setUsuarioTemp(adminTemporal);
        }
    }, []);

    if (!isAdmin) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1>❌ Acceso Denegado</h1>
                <p>Solo administradores pueden acceder a esta página.</p>
            </main>
        );
    }

    return (
        <div className="admin-container">
            <AdminHeader vista={vista} setVista={setVista} usuario={usuarioTemp} />
            <div className="admin-content">
                {vista === 'productos' && <AdminProductos />}
                {vista === 'ordenes' && <AdminOrdenes />}
                {vista === 'usuarios' && <AdminUsuarios />}
            </div>
        </div>
    );
}