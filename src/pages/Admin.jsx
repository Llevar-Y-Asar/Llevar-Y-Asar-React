import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext';
import AdminHeader from '../components/admin/AdminHeader';
import AdminProductos from '../components/admin/AdminProductos';
import AdminOrdenes from '../components/admin/AdminOrdenes';
import AdminUsuarios from '../components/admin/AdminUsuarios';
import '../../css/admin.css';

export default function Admin() {
    const navigate = useNavigate();
    const { usuarioLogueado } = useUsuario();
    const [vista, setVista] = useState('productos');

    useEffect(() => {
        // Validar que el usuario sea admin
        if (!usuarioLogueado || usuarioLogueado.rol !== 'ADMIN') {
            navigate('/login');
        }
    }, [usuarioLogueado, navigate]);

    // No renderizar nada mientras se valida
    if (!usuarioLogueado || usuarioLogueado.rol !== 'ADMIN') {
        return null;
    }

    return (
        <div className="admin-container">
            <AdminHeader vista={vista} setVista={setVista} usuario={usuarioLogueado} />
            <div className="admin-content">
                {vista === 'productos' && <AdminProductos />}
                {vista === 'ordenes' && <AdminOrdenes />}
                {vista === 'usuarios' && <AdminUsuarios />}
            </div>
        </div>
    );
}