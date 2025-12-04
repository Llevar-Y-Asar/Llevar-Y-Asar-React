// src/services/api.js
// Cliente HTTP centralizado para llamadas al backend

const API_URL = 'http://localhost:8080/api';

/**
 * Función auxiliar para hacer requests HTTP
 * @param {string} endpoint - Ruta del endpoint sin la URL base
 * @param {string} metodo - GET, POST, PUT, PATCH, DELETE
 * @param {object} datos - Datos a enviar (para POST, PUT, PATCH)
 * @returns {Promise<object>} Respuesta del servidor
 */
async function request(endpoint, metodo = 'GET', datos = null) {
  const opciones = {
    method: metodo,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Agregar body si es necesario
  if (datos && (metodo === 'POST' || metodo === 'PUT' || metodo === 'PATCH')) {
    opciones.body = JSON.stringify(datos);
  }

  try {
    const respuesta = await fetch(`${API_URL}${endpoint}`, opciones);
    
    // Si no es OK pero no es error de red, intentar parsear JSON de error
    if (!respuesta.ok) {
      const error = await respuesta.json().catch(() => ({ 
        mensaje: `Error ${respuesta.status}` 
      }));
      throw new Error(error.mensaje || `Error: ${respuesta.status}`);
    }
    
    // Parsear respuesta exitosa
    return await respuesta.json();
  } catch (error) {
    console.error('Error en API:', error);
    throw error;
  }
}

// ============================================
// SERVICIOS DE PRODUCTOS
// ============================================

export const productosAPI = {
  // Obtener todos los productos
  obtenerTodos: () => request('/productos', 'GET'),

  // Obtener solo productos activos
  obtenerActivos: () => request('/productos/activos', 'GET'),

  // Obtener producto por ID
  obtenerPorId: (id) => request(`/productos/${id}`, 'GET'),

  // Obtener productos por categoría
  obtenerPorCategoria: (categoria) => 
    request(`/productos/categoria/${categoria}`, 'GET'),

  // Buscar productos por nombre
  buscar: (termino) => request(`/productos/buscar?q=${termino}`, 'GET'),

  // Crear producto (admin)
  crear: (producto) => request('/productos/admin', 'POST', producto),

  // Actualizar producto (admin)
  actualizar: (id, producto) => 
    request(`/productos/admin/${id}`, 'PUT', producto),

  // Desactivar producto (admin)
  desactivar: (id) => 
    request(`/productos/admin/${id}/desactivar`, 'PATCH'),

  // Eliminar producto (admin)
  eliminar: (id) => request(`/productos/admin/${id}`, 'DELETE')
};

// ============================================
// SERVICIOS DE USUARIOS
// ============================================

export const usuariosAPI = {
  // Registrar nuevo usuario
  registrar: (datos) => request('/usuarios/registro', 'POST', datos),

  // Login
  login: (rut, password) => 
    request('/usuarios/login', 'POST', { rut, password }),

  // Obtener usuario por RUT
  obtenerPorRut: (rut) => request(`/usuarios/${rut}`, 'GET'),

  // Obtener todos los usuarios (admin)
  obtenerTodos: () => request('/usuarios', 'GET'),

  // Actualizar datos del usuario
  actualizar: (rut, datos) => 
    request(`/usuarios/${rut}`, 'PUT', datos),

  // Desactivar usuario
  desactivar: (rut) => 
    request(`/usuarios/${rut}/desactivar`, 'PATCH'),

  // Eliminar usuario (admin)
  eliminar: (rut) => request(`/usuarios/${rut}`, 'DELETE')
};

// ============================================
// SERVICIOS DE CARRITO
// ============================================

export const carritoAPI = {
  // Obtener carrito del usuario
  obtener: (usuarioRut) => 
    request(`/carrito/${usuarioRut}`, 'GET'),

  // Agregar item al carrito
  agregarItem: (usuarioRut, item) => 
    request(`/carrito/${usuarioRut}/agregar`, 'POST', item),

  // Eliminar item del carrito
  eliminarItem: (usuarioRut, productoId) => 
    request(`/carrito/${usuarioRut}/eliminar/${productoId}`, 'DELETE'),

  // Vaciar carrito
  vaciar: (usuarioRut) => 
    request(`/carrito/${usuarioRut}/vaciar`, 'DELETE')
};

// ============================================
// SERVICIOS DE ÓRDENES
// ============================================

export const ordenesAPI = {
  // Obtener todas las órdenes
  obtenerTodas: () => request('/ordenes', 'GET'),

  // Obtener orden por ID
  obtenerPorId: (id) => request(`/ordenes/${id}`, 'GET'),

  // Obtener órdenes del usuario
  obtenerPorUsuario: (usuarioRut) => 
    request(`/ordenes/usuario/${usuarioRut}`, 'GET'),

  // Obtener órdenes por estado
  obtenerPorEstado: (estado) => 
    request(`/ordenes/estado/${estado}`, 'GET'),

  // Crear nueva orden
  crear: (orden) => request('/ordenes', 'POST', orden),

  // Actualizar orden (admin)
  actualizar: (id, orden) => 
    request(`/ordenes/${id}`, 'PUT', orden),

  // Cambiar estado de la orden
  cambiarEstado: (id, nuevoEstado) => 
    request(`/ordenes/${id}/estado/${nuevoEstado}`, 'PATCH'),

  // Cancelar orden
  cancelar: (id) => 
    request(`/ordenes/${id}/cancelar`, 'PATCH')
};

export default {
  productosAPI,
  usuariosAPI,
  carritoAPI,
  ordenesAPI
};
