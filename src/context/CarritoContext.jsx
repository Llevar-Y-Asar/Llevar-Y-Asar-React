// src/context/CarritoContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { useProductos } from './productosContext';
import { carritoAPI } from '../services/api';

export const CarritoContext = createContext();

export function useCarrito() {
    const context = useContext(CarritoContext);
    if (!context) {
        throw new Error('useCarrito debe ser usado dentro de CarritoProvider');
    }
    return context;
}

export function CarritoProvider({ children }) {
    const [carrito, setCarrito] = useState(() => {
        // Cargar del localStorage al iniciar
        const saved = localStorage.getItem('carrito');
        return saved ? JSON.parse(saved) : [];
    });

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const { actualizarStock } = useProductos();

    // Guardar en localStorage cada vez que cambia el carrito
    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }, [carrito]);

    // Cargar carrito del backend para un usuario específico
    const cargarCarrito = async (usuarioRut) => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await carritoAPI.obtener(usuarioRut);
            setCarrito(respuesta.carrito?.items || []);
        } catch (err) {
            console.warn('No se pudo cargar carrito del backend:', err.message);
            // Usar datos locales como fallback
        } finally {
            setCargando(false);
        }
    };

    // Agregar item al carrito
    const agregarAlCarrito = async (producto, usuarioRut = null) => {
        try {
            const item = {
                productoId: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1,
                imagen: producto.imagen
            };

            // Si hay usuario logueado, sincronizar con backend
            if (usuarioRut) {
                await carritoAPI.agregarItem(usuarioRut, item);
            }

            // Actualizar carrito localmente
            setCarrito(prevCarrito => {
                const itemExistente = prevCarrito.find(p => p.id === producto.id);
                
                if (itemExistente) {
                    // Si ya existe, aumentar cantidad
                    if (producto.stock > 0) {
                        actualizarStock(producto.id, 1);
                        return prevCarrito.map(p =>
                            p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
                        );
                    }
                    return prevCarrito;
                } else {
                    // Si no existe, agregarlo
                    if (producto.stock > 0) {
                        actualizarStock(producto.id, 1);
                        return [...prevCarrito, { ...producto, cantidad: 1 }];
                    }
                    return prevCarrito;
                }
            });
        } catch (err) {
            setError(err.message);
            // Continuar con operación local incluso si backend falla
            setCarrito(prevCarrito => {
                const itemExistente = prevCarrito.find(p => p.id === producto.id);
                if (itemExistente && producto.stock > 0) {
                    actualizarStock(producto.id, 1);
                    return prevCarrito.map(p =>
                        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
                    );
                } else if (producto.stock > 0) {
                    actualizarStock(producto.id, 1);
                    return [...prevCarrito, { ...producto, cantidad: 1 }];
                }
                return prevCarrito;
            });
        }
    };

    // Quitar item del carrito
    const quitarDelCarrito = async (id, usuarioRut = null) => {
        try {
            // Si hay usuario logueado, sincronizar con backend
            if (usuarioRut) {
                await carritoAPI.eliminarItem(usuarioRut, id);
            }

            setCarrito(prevCarrito => {
                const item = prevCarrito.find(p => p.id === id);
                if (item && item.cantidad > 1) {
                    return prevCarrito.map(p =>
                        p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
                    );
                } else {
                    return prevCarrito.filter(p => p.id !== id);
                }
            });
        } catch (err) {
            setError(err.message);
            // Continuar con operación local
            setCarrito(prevCarrito => {
                const item = prevCarrito.find(p => p.id === id);
                if (item && item.cantidad > 1) {
                    return prevCarrito.map(p =>
                        p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
                    );
                } else {
                    return prevCarrito.filter(p => p.id !== id);
                }
            });
        }
    };

    // Vaciar carrito
    const vaciarCarrito = async (usuarioRut = null) => {
        try {
            // Si hay usuario logueado, sincronizar con backend
            if (usuarioRut) {
                await carritoAPI.vaciar(usuarioRut);
            }

            setCarrito([]);
        } catch (err) {
            setError(err.message);
            // Continuar con operación local
            setCarrito([]);
        }
    };

    const getTotalCarrito = () => {
        return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
    };

    const getCantidadItems = () => {
        return carrito.reduce((total, item) => total + item.cantidad, 0);
    };

    return (
        <CarritoContext.Provider 
            value={{ 
                carrito, 
                agregarAlCarrito, 
                quitarDelCarrito, 
                vaciarCarrito,
                getTotalCarrito,
                getCantidadItems,
                cargarCarrito,
                cargando,
                error
            }}
        >
            {children}
        </CarritoContext.Provider>
    );
}