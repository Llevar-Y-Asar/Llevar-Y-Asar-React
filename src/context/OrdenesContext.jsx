import { createContext, useState, useContext, useEffect } from 'react';
import { ordenesAPI } from '../services/api';

export const OrdenesContext = createContext();

export function useOrdenes() {
    const context = useContext(OrdenesContext);
    if (!context) {
        throw new Error('useOrdenes debe usarse dentro de OrdenesProvider');
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
            const nuevaOrden = await ordenesAPI.crear(datosOrden);
            setOrdenes(prev => [...prev, nuevaOrden]);
            return nuevaOrden;
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
                // cargarOrdenesDelUsuario
            }}
        >
            {children}
        </OrdenesContext.Provider>
    );
}