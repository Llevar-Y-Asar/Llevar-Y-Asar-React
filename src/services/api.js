const API_URL = 'http://localhost:8080/api';

async function request(endpoint, metodo = 'GET', datos = null) {
    const opciones = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // ✅ Agregar token JWT si existe
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
export const productosAPI = {
    obtenerActivos: () => request('/productos', 'GET')
};

export const usuariosAPI = {
    registrar: (datos) => request('/usuarios/registro', 'POST', datos),
    login: (email, password) => request('/usuarios/login', 'POST', { email, password })
};

export const carritoAPI = {
    obtener: (usuarioRut) => request(`/carrito/${usuarioRut}`, 'GET'),
    agregarItem: (usuarioRut, item) => request(`/carrito/${usuarioRut}/agregar`, 'POST', item),
    vaciar: (usuarioRut) => request(`/carrito/${usuarioRut}/vaciar`, 'DELETE')
};

export const ordenesAPI = {
    crear: (orden) => request('/ordenes', 'POST', orden)
};