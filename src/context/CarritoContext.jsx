// src/context/CarritoContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { useProductos } from './productosContext';

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

    const { actualizarStock } = useProductos();

  // Guardar en localStorage cada vez que cambia el carrito
    useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    }, [carrito]);

    const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => {
        const item = prevCarrito.find(p => p.id === producto.id);
        
        if (item) {
        // Si ya existe, aumentar cantidad y reducir stock
        if (producto.stock > 0) {
            actualizarStock(producto.id, 1);
            return prevCarrito.map(p =>
                p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
            );
        }
        return prevCarrito;
        } else {
        // Si no existe, agregarlo con cantidad 1 y reducir stock
        if (producto.stock > 0) {
            actualizarStock(producto.id, 1);
            return [...prevCarrito, { ...producto, cantidad: 1 }];
        }
        return prevCarrito;
        }
    });
    };

    const quitarDelCarrito = (id) => {
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
    };

    const vaciarCarrito = () => {
    setCarrito([]);
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
        getCantidadItems
        }}
    >
        {children}
    </CarritoContext.Provider>
    );
}