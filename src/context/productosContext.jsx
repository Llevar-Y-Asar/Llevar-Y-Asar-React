import { createContext, useState, useEffect, useContext } from 'react';
import { productos as productosIniciales } from '../data/productos';

export const ProductosContext = createContext();

export function useProductos() {
    const context = useContext(ProductosContext);
    if (!context) {
        throw new Error('useProductos debe ser usado dentro de ProductosProvider');
    }
    return context;
}

export function ProductosProvider({ children }) {
    const [productos, setProductos] = useState(() => {
        // Cargar del localStorage al iniciar
        const saved = localStorage.getItem('productos_admin');
        return saved ? JSON.parse(saved) : productosIniciales;
    });

    // Guardar en localStorage cada vez que cambia
    useEffect(() => {
        localStorage.setItem('productos_admin', JSON.stringify(productos));
    }, [productos]);

    const agregarProducto = (producto) => {
        const nuevoProducto = {
            ...producto,
            id: Math.max(...productos.map(p => p.id), 0) + 1
        };
        setProductos([...productos, nuevoProducto]);
    };

    const editarProducto = (id, productoActualizado) => {
        setProductos(productos.map(p => 
            p.id === id ? { ...p, ...productoActualizado } : p
        ));
    };

    const eliminarProducto = (id) => {
        setProductos(productos.filter(p => p.id !== id));
    };

    const actualizarStock = (id, cantidad) => {
        setProductos(productos.map(p =>
            p.id === id ? { ...p, stock: Math.max(0, p.stock - cantidad) } : p
        ));
    };

    return (
        <ProductosContext.Provider 
            value={{ 
                productos, 
                agregarProducto, 
                editarProducto, 
                eliminarProducto,
                actualizarStock
            }}
        >
            {children}
        </ProductosContext.Provider>
    );
} 