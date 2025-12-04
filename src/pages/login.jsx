// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext';

export function Login() {
    const navigate = useNavigate();
    const { iniciarSesion, cargando, error } = useUsuario();
    const [formData, setFormData] = useState({
        rut: '',
        password: ''
    });

    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errores[name]) {
            setErrores(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Intentar login contra el backend
            const usuario = await iniciarSesion(formData.rut, formData.password);
            alert(`✅ ¡Bienvenido ${usuario.nombre}!`);
            navigate('/perfil');
        } catch (err) {
            setErrores({ 
                general: `❌ ${err.message || 'Error al iniciar sesión. Verifica RUT y contraseña.'}` 
            });
        }
    };

    return (
        <main>
            <section>
                <h1>Iniciar Sesión</h1>
                <p>Ingresa tus datos para acceder a tu cuenta y realizar pedidos.</p>
                <form id="form-login" onSubmit={handleSubmit}>
                    {errores.general && <div className="error">{errores.general}</div>}
                    {error && <div className="error">{error}</div>}

                    <label>RUT (Ej: 12.345.678-9):</label>
                    <input
                        type="text"
                        name="rut"
                        placeholder="12.345.678-9"
                        value={formData.rut}
                        onChange={handleChange}
                        required
                        disabled={cargando}
                    />
                    {errores.rut && <div className="error">{errores.rut}</div>}

                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={cargando}
                    />
                    {errores.password && <div className="error">{errores.password}</div>}

                    <button type="submit" disabled={cargando}>
                        {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                    <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
                </form>
            </section>
        </main>
    );
}