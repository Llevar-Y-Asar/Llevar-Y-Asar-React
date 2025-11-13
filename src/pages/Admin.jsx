import { useState } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import AdminProductos from '../components/admin/AdminProductos';
import AdminOrdenes from '../components/admin/AdminOrdenes';
import AdminUsuarios from '../components/admin/AdminUsuarios';
import '../../css/admin.css';

export default function Admin() {
    const [vista, setVista] = useState('productos');

    return (
        <div className="admin-container">
            <AdminHeader vista={vista} setVista={setVista} />
            <div className="admin-content">
                {vista === 'productos' && <AdminProductos />}
                {vista === 'ordenes' && <AdminOrdenes />}
                {vista === 'usuarios' && <AdminUsuarios />}
            </div>
        </div>
    );
}