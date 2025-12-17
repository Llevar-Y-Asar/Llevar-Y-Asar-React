import { createContext, useState, useEffect, useContext } from 'react';
import { carritoAPI, productosAPI } from '../services/api';

export const CarritoContext = createContext();

export function useCarrito() {
    const context = useContext(CarritoContext);
    if (!context) {
        throw new Error('useCarrito debe usarse dentro de CarritoProvider');
    }
    return context;
}

export function CarritoProvider({ children }) {
    const [carrito, setCarrito] = useState(() => {
        const saved = localStorage.getItem('carrito');
        return saved ? JSON.parse(saved) : [];
    });
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    // Guardar en localStorage
    useEffect(() => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }, [carrito]);

    // Cargar carrito del backend (si hay usuario logueado)
    const cargarCarrito = async (usuarioRut) => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await carritoAPI.obtener(usuarioRut);
            setCarrito(respuesta.carrito?.items || []);
        } catch (err) {
            console.warn('No se pudo cargar carrito del backend:', err.message);
        } finally {
            setCargando(false);
        }
    };

    // Agregar al carrito (local + backend si hay sesión)
    const agregarAlCarrito = async (producto, usuarioRut = null) => {
        try {
            if (producto.stock <= 0) {
                setError('Producto sin stock');
                return;
            }

            // Si hay usuario logueado → actualizar stock en backend
            if (usuarioRut) {
                try {
                    await productosAPI.actualizarStock(producto.id, 1);
                } catch (err) {
                    setError('No se pudo actualizar el stock en el servidor');
                    return;
                }

                // Sincronizar item con backend
                const item = {
                    productoId: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: 1,
                    imagen: producto.imagen
                };
                await carritoAPI.agregarItem(usuarioRut, item);
            }

            // Actualizar carrito local
            setCarrito(prevCarrito => {
                const itemExistente = prevCarrito.find(p => p.id === producto.id);
                if (itemExistente) {
                    return prevCarrito.map(p =>
                        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
                    );
                } else {
                    return [...prevCarrito, { ...producto, cantidad: 1 }];
                }
            });
        } catch (err) {
            setError(err.message);
        }
    };

    // Quitar del carrito
    const quitarDelCarrito = async (id, usuarioRut = null) => {
        try {
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
        }
    };

    // Vaciar carrito
    const vaciarCarrito = async (usuarioRut = null) => {
        try {
            if (usuarioRut) {
                await carritoAPI.vaciar(usuarioRut);
            }
            setCarrito([]);
        } catch (err) {
            setError(err.message);
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