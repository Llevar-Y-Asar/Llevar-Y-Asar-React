const API_URL = 'http://localhost:8080/api';

async function request(endpoint, metodo = 'GET', datos = null) {
    const opciones = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Agregar token JWT si existe
    const token = localStorage.getItem('auth_token');
    if (token) {
        opciones.headers['Authorization'] = `Bearer ${token}`;
    }

    if (datos && (metodo === 'POST' || metodo === 'PUT' || metodo === 'PATCH')) {
        opciones.body = JSON.stringify(datos);
    }

    try {
        const respuesta = await fetch(`${API_URL}${endpoint}`, opciones);
        if (!respuesta.ok) {
            const error = await respuesta.json().catch(() => ({ 
                mensaje: `Error ${respuesta.status}` 
            }));
            throw new Error(error.mensaje || `Error: ${respuesta.status}`);
        }
        return await respuesta.json();
    } catch (error) {
        console.error('Error en API:', error);
        throw error;
    }
}

// ================== SERVICIOS ==================

// PRODUCTOS
export const productosAPI = {
    obtenerActivos: () => request('/productos', 'GET'),
    obtenerTodos: () => request('/productos/todos', 'GET'),
    obtenerPorId: (id) => request(`/productos/${id}`, 'GET'),
    crear: (producto) => request('/productos', 'POST', producto),
    actualizar: (id, producto) => request(`/productos/${id}`, 'PUT', producto),
    eliminar: (id) => request(`/productos/${id}`, 'DELETE'),
    actualizarStock: (id, cantidad) => request(`/productos/${id}/stock`, 'PATCH', { cantidad })
};

// USUARIOS
export const usuariosAPI = {
    registrar: (datos) => request('/usuarios/registro', 'POST', datos),
    login: (email, password) => request('/usuarios/login', 'POST', { email, password }),
    obtenerPorRut: (rut) => request(`/usuarios/${rut}`, 'GET'),
    actualizar: (rut, datos) => request(`/usuarios/${rut}`, 'PUT', datos),
    desactivar: (rut) => request(`/usuarios/${rut}`, 'DELETE'),
    obtenerTodos: () => request('/usuarios', 'GET')
};

// CARRITO
export const carritoAPI = {
    obtener: (usuarioRut) => request(`/carrito/${usuarioRut}`, 'GET'),
    agregarItem: (usuarioRut, item) => request(`/carrito/${usuarioRut}/agregar`, 'POST', item),
    eliminarItem: (usuarioRut, idProducto) => request(`/carrito/${usuarioRut}/items/${idProducto}`, 'DELETE'),
    vaciar: (usuarioRut) => request(`/carrito/${usuarioRut}/vaciar`, 'DELETE')
};

// ÓRDENES
export const ordenesAPI = {
    crear: (orden) => request('/ordenes', 'POST', orden),
    obtenerPorUsuario: (usuarioRut) => request(`/ordenes/usuario/${usuarioRut}`, 'GET'),
    obtenerTodas: () => request('/ordenes', 'GET'),
    cambiarEstado: (ordenId, estado) => request(`/ordenes/${ordenId}/estado`, 'PATCH', { estado })
};