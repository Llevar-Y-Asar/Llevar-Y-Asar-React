import { createContext, useState, useEffect, useContext } from 'react';
import { productosAPI } from '../services/api';
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
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Cargar productos del backend al iniciar
    useEffect(() => {
        cargarProductos();
    }, []);

    // Recargar productos cada 5 segundos para reflejar cambios de stock
    useEffect(() => {
        const intervalo = setInterval(() => {
            cargarProductos();
        }, 5000);
        
        return () => clearInterval(intervalo);
    }, []);

    // Guardar stock en localStorage cuando cambia
    useEffect(() => {
        localStorage.setItem('productos_stock', JSON.stringify(productos));
    }, [productos]);

    // Cargar productos desde el backend
    const cargarProductos = async () => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await productosAPI.obtenerActivos();
            
            // Si el backend retorna productos, usarlos
            if (respuesta && respuesta.length > 0) {
                // Recuperar stock guardado localmente (si existe)
                const stockLocal = localStorage.getItem('productos_stock');
                if (stockLocal) {
                    const productosConStock = JSON.parse(stockLocal);
                    // Mergear: datos del backend con stock del localStorage
                    const productosMerged = respuesta.map(p => {
                        const stockGuardado = productosConStock.find(ps => ps.id === p.id);
                        return stockGuardado ? { ...p, stock: stockGuardado.stock } : p;
                    });
                    setProductos(productosMerged);
                } else {
                    setProductos(respuesta);
                }
            } else {
                // Si no hay, usar los datos iniciales como fallback
                setProductos(productosIniciales);
            }
        } catch (err) {
            console.error('Error cargando productos del backend:', err.message);
            setError(err.message);
            // Fallback a productos iniciales si el backend falla
            console.warn('Usando datos locales como fallback');
            setProductos(productosIniciales);
        } finally {
            setCargando(false);
        }
    };

    // Agregar producto (admin)
    const agregarProducto = async (producto) => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await productosAPI.crear(producto);
            setProductos([...productos, respuesta.producto]);
            return respuesta.producto;
        } catch (err) {
            setError(err.message);
            // Fallback: agregar localmente
            const nuevoProducto = {
                ...producto,
                id: Math.max(...productos.map(p => p.id || 0), 0) + 1
            };
            setProductos([...productos, nuevoProducto]);
            return nuevoProducto;
        } finally {
            setCargando(false);
        }
    };

    // Editar producto (admin)
    const editarProducto = async (id, productoActualizado) => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await productosAPI.actualizar(id, productoActualizado);
            setProductos(productos.map(p => 
                p.id === id ? respuesta.producto : p
            ));
            return respuesta.producto;
        } catch (err) {
            setError(err.message);
            // Fallback: editar localmente
            setProductos(productos.map(p => 
                p.id === id ? { ...p, ...productoActualizado } : p
            ));
        } finally {
            setCargando(false);
        }
    };

    // Eliminar producto (admin)
    const eliminarProducto = async (id) => {
        setCargando(true);
        setError(null);
        try {
            await productosAPI.eliminar(id);
            setProductos(productos.filter(p => p.id !== id));
        } catch (err) {
            setError(err.message);
            // Fallback: eliminar localmente
            setProductos(productos.filter(p => p.id !== id));
        } finally {
            setCargando(false);
        }
    };

    // Actualizar stock (cuando se agrega al carrito)
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
                actualizarStock,
                cargando,
                error,
                cargarProductos
            }}
        >
            {children}
        </ProductosContext.Provider>
    );
} 