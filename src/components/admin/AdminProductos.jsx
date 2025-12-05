import { useState } from 'react';
import { useProductos } from '../../context/productosContext';

export default function AdminProductos() {
    const { productos, agregarProducto, editarProducto, eliminarProducto } = useProductos();
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: 'Cortes Premium',
        imagen: '/assets/image/parrillada.jpg'
    });
    const [editandoId, setEditandoId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.nombre && formData.precio) {
            if (editandoId) {
                // Editar producto existente
                editarProducto(editandoId, {
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                    precio: parseFloat(formData.precio),
                    stock: parseInt(formData.stock) || 0,
                    categoria: formData.categoria,
                    imagen: formData.imagen
                });
                setEditandoId(null);
            } else {
                // Crear nuevo producto
                agregarProducto({
                    nombre: formData.nombre,
                    descripcion: formData.descripcion,
                    precio: parseFloat(formData.precio),
                    stock: parseInt(formData.stock) || 0,
                    categoria: formData.categoria,
                    imagen: formData.imagen,
                    stockCritico: 3
                });
            }
            setFormData({ 
                nombre: '', 
                descripcion: '', 
                precio: '', 
                stock: '', 
                categoria: 'Cortes Premium',
                imagen: '/assets/image/parrillada.jpg'
            });
        }
    };

    const handleEdit = (producto) => {
        setFormData({
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            precio: producto.precio,
            stock: producto.stock,
            categoria: producto.categoria || 'Cortes Premium',
            imagen: producto.imagen || '/assets/image/parrillada.jpg'
        });
        setEditandoId(producto.id);
    };

    const handleCancel = () => {
        setEditandoId(null);
        setFormData({ 
            nombre: '', 
            descripcion: '', 
            precio: '', 
            stock: '', 
            categoria: 'Cortes Premium',
            imagen: '/assets/image/parrillada.jpg'
        });
    };

    return (
        <div className="admin-section">
            <h2>📦 Gestionar Productos</h2>

            <form onSubmit={handleSubmit} className="admin-form">
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre del producto"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="descripcion"
                    placeholder="Descripción"
                    value={formData.descripcion}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="precio"
                    placeholder="Precio"
                    value={formData.precio}
                    onChange={handleChange}
                    step="0.01"
                    required
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                />
                <select name="categoria" value={formData.categoria} onChange={handleChange}>
                    <option value="Cortes Premium">Cortes Premium</option>
                    <option value="Embutidos">Embutidos</option>
                    <option value="Combos">Combos</option>
                    <option value="Entrañas">Entrañas</option>
                    <option value="Lomo Liso">Lomo Liso</option>
                    <option value="Punta Ganso">Punta Ganso</option>
                </select>
                <input
                    type="text"
                    name="imagen"
                    placeholder="URL de imagen"
                    value={formData.imagen}
                    onChange={handleChange}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ flex: 1 }}>
                        {editandoId ? '✏️ Actualizar Producto' : '➕ Agregar Producto'}
                    </button>
                    {editandoId && (
                        <button type="button" onClick={handleCancel} style={{ flex: 1, background: '#6c757d' }}>
                            ❌ Cancelar
                        </button>
                    )}
                </div>
            </form>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Lista de Productos ({productos.length})</h3>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(prod => (
                        <tr key={prod.id}>
                            <td>{prod.id}</td>
                            <td>{prod.nombre}</td>
                            <td>{prod.categoria || 'N/A'}</td>
                            <td>${prod.precio.toLocaleString('es-CL')}</td>
                            <td>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    background: prod.stock <= prod.stockCritico ? '#ffe0d0' : '#d4edda',
                                    color: prod.stock <= prod.stockCritico ? '#d9534f' : '#2d5016'
                                }}>
                                    {prod.stock}
                                </span>
                            </td>
                            <td style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                <button 
                                    onClick={() => handleEdit(prod)}
                                    style={{ background: '#007bff', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    ✏️ Editar
                                </button>
                                <button 
                                    onClick={() => eliminarProducto(prod.id)}
                                    style={{ background: '#d9534f', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    🗑️ Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}