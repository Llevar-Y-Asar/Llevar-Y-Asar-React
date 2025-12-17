// src/context/UsuarioContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

export const UsuarioContext = createContext();

export function useUsuario() {
    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error('useUsuario debe usarse dentro de UsuarioProvider');
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

    // Guardar en localStorage cuando cambie el usuario
    useEffect(() => {
        if (usuarioLogueado) {
            localStorage.setItem('usuario_logueado', JSON.stringify(usuarioLogueado));
        } else {
            localStorage.removeItem('usuario_logueado');
        }
    }, [usuarioLogueado]);

    // Registrar usuario
    const registrarUsuario = async (usuarioData) => {
        setCargando(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/usuarios/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuarioData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error en registro');
            return data.usuario;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    // Iniciar sesión 
    const iniciarSesion = async (email, password) => {
        setCargando(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Credenciales incorrectas');

            //  Guardar usuario Y token
            const usuarioConToken = {
                ...data.usuario,
                token: data.token
            };
            setUsuarioLogueado(usuarioConToken);
            localStorage.setItem('auth_token', data.token); // ← JWT para llamadas futuras
            return data.usuario;
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
        localStorage.removeItem('auth_token');
    };

    return (
        <UsuarioContext.Provider
            value={{
                usuarioLogueado,
                registrarUsuario,
                iniciarSesion,
                cerrarSesion,
                cargando,
                error
            }}
        >
            {children}
        </UsuarioContext.Provider>
    );
}