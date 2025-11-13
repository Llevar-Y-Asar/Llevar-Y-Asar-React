import { createContext, useState, useEffect, useContext } from 'react';

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

    const [usuarios, setUsuarios] = useState(() => {
        const saved = localStorage.getItem('usuarios_registrados');
        return saved ? JSON.parse(saved) : [];
    });

    // Guardar usuario logueado
    useEffect(() => {
        if (usuarioLogueado) {
            localStorage.setItem('usuario_logueado', JSON.stringify(usuarioLogueado));
        } else {
            localStorage.removeItem('usuario_logueado');
        }
    }, [usuarioLogueado]);

    // Guardar lista de usuarios
    useEffect(() => {
        localStorage.setItem('usuarios_registrados', JSON.stringify(usuarios));
    }, [usuarios]);

    const registrarUsuario = (usuarioData) => {
        const nuevoUsuario = {
            id: Math.max(...usuarios.map(u => u.id || 0), 0) + 1,
            ...usuarioData,
            fechaRegistro: new Date().toISOString(),
            ordenes: []
        };
        setUsuarios([...usuarios, nuevoUsuario]);
        return nuevoUsuario;
    };

    const iniciarSesion = (run, password) => {
        const usuario = usuarios.find(u => u.run === run);
        if (usuario) {
            setUsuarioLogueado(usuario);
            return usuario;
        }
        return null;
    };

    const cerrarSesion = () => {
        setUsuarioLogueado(null);
    };

    const actualizarUsuario = (id, datosActualizados) => {
        setUsuarios(usuarios.map(u =>
            u.id === id ? { ...u, ...datosActualizados } : u
        ));
        if (usuarioLogueado && usuarioLogueado.id === id) {
            setUsuarioLogueado({ ...usuarioLogueado, ...datosActualizados });
        }
    };

    const eliminarUsuario = (id) => {
        setUsuarios(usuarios.filter(u => u.id !== id));
        if (usuarioLogueado && usuarioLogueado.id === id) {
            setUsuarioLogueado(null);
        }
    };

    const agregarOrdenAlUsuario = (usuarioId, orden) => {
        setUsuarios(usuarios.map(u => {
            if (u.id === usuarioId) {
                return {
                    ...u,
                    ordenes: [...(u.ordenes || []), orden]
                };
            }
            return u;
        }));
    };

    return (
        <UsuarioContext.Provider 
            value={{ 
                usuarioLogueado,
                usuarios,
                registrarUsuario,
                iniciarSesion,
                cerrarSesion,
                actualizarUsuario,
                eliminarUsuario,
                agregarOrdenAlUsuario
            }}
        >
            {children}
        </UsuarioContext.Provider>
    );
}
