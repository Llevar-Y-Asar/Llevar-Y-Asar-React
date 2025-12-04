import { createContext, useState, useEffect, useContext } from 'react';
import { usuariosAPI } from '../services/api';

export const UsuarioContext = createContext();

export function useUsuario() {
    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error('useUsuario debe ser usado dentro de UsuarioProvider');
    }
    return context;
}

export function UsuarioProvider({ children }) {
    const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
        const saved = localStorage.getItem('usuario_logueado');
        return saved ? JSON.parse(saved) : null;
    });

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    // Guardar usuario logueado en localStorage
    useEffect(() => {
        if (usuarioLogueado) {
            localStorage.setItem('usuario_logueado', JSON.stringify(usuarioLogueado));
        } else {
            localStorage.removeItem('usuario_logueado');
        }
    }, [usuarioLogueado]);

    // Registrar usuario con validación en backend
    const registrarUsuario = async (usuarioData) => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await usuariosAPI.registrar(usuarioData);
            return respuesta.usuario;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    // Iniciar sesión contra el backend
    const iniciarSesion = async (rut, password) => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await usuariosAPI.login(rut, password);
            setUsuarioLogueado(respuesta.usuario);
            return respuesta.usuario;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    // Cerrar sesión
    const cerrarSesion = () => {
        setUsuarioLogueado(null);
        localStorage.removeItem('usuario_logueado');
    };

    // Actualizar datos del usuario
    const actualizarUsuario = async (rut, datosActualizados) => {
        setCargando(true);
        setError(null);
        try {
            const respuesta = await usuariosAPI.actualizar(rut, datosActualizados);
            const usuarioActualizado = respuesta.usuario;
            setUsuarioLogueado(usuarioActualizado);
            return usuarioActualizado;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    // Desactivar usuario
    const desactivarUsuario = async (rut) => {
        setCargando(true);
        setError(null);
        try {
            await usuariosAPI.desactivar(rut);
            setUsuarioLogueado(null);
            localStorage.removeItem('usuario_logueado');
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    return (
        <UsuarioContext.Provider 
            value={{ 
                usuarioLogueado,
                registrarUsuario,
                iniciarSesion,
                cerrarSesion,
                actualizarUsuario,
                desactivarUsuario,
                cargando,
                error
            }}
        >
            {children}
        </UsuarioContext.Provider>
    );
}
