// src/context/OrdenesContext.jsx
import { createContext, useState, useContext } from 'react';
import { ordenesAPI } from '../services/api';

export const OrdenesContext = createContext();

export function useOrdenes() {
    const context = useContext(OrdenesContext);
    if (!context) {
        throw new Error('useOrdenes debe ser usado dentro de OrdenesProvider');
    }
    return context;
}

export function OrdenesProvider({ children }) {
    const [ordenes, setOrdenes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    // Cargar órdenes del usuario
    const cargarOrdenesDelUsuario = async (usuarioRut) => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await ordenesAPI.obtenerPorUsuario(usuarioRut);
            setOrdenes(respuesta || []);
        } catch (err) {
            setError(err.message);
            console.error('Error cargando órdenes:', err);
        } finally {
            setCargando(false);
        }
    };

    // Crear nueva orden
    const crearOrden = async (datosOrden) => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await ordenesAPI.crear(datosOrden);
            const nuevaOrden = respuesta.orden;
            setOrdenes([...ordenes, nuevaOrden]);
            return nuevaOrden;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    // Obtener orden específica
    const obtenerOrden = async (id) => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await ordenesAPI.obtenerPorId(id);
            return respuesta;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    // Cambiar estado de la orden
    const cambiarEstadoOrden = async (id, nuevoEstado) => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await ordenesAPI.cambiarEstado(id, nuevoEstado);
            const ordenActualizada = respuesta.orden;
            
            // Actualizar en el estado local
            setOrdenes(ordenes.map(o => 
                o.id === id ? ordenActualizada : o
            ));
            
            return ordenActualizada;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    // Cancelar orden
    const cancelarOrden = async (id) => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await ordenesAPI.cancelar(id);
            const ordenActualizada = respuesta.orden;
            
            // Actualizar en el estado local
            setOrdenes(ordenes.map(o => 
                o.id === id ? ordenActualizada : o
            ));
            
            return ordenActualizada;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    return (
        <OrdenesContext.Provider 
            value={{
                ordenes,
                cargando,
                error,
                cargarOrdenesDelUsuario,
                crearOrden,
                obtenerOrden,
                cambiarEstadoOrden,
                cancelarOrden
            }}
        >
            {children}
        </OrdenesContext.Provider>
    );
}
