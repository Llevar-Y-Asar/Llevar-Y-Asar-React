import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext';

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { iniciarSesion, cargando, error: errorContext } = useUsuario();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const usuario = await iniciarSesion(formData.email, formData.password);
            alert(`✅ ¡Bienvenido ${usuario.nombre}!`);

            // Redirigir tras login
            const redirect = location.state?.redirect || '/perfil';
            navigate(redirect);
        } catch (err) {
            setErrores({ general: `❌ ${err.message || 'Error al iniciar sesión. Verifica email y contraseña.'}` });
        }
    };

    return (
        <main>
            <section>
                <h1>Iniciar Sesión</h1>
                <p>Ingresa tus datos para acceder a tu cuenta y realizar pedidos.</p>
                <form onSubmit={handleSubmit}>
                    {errores.general && <div className="error">{errores.general}</div>}
                    {errorContext && <div className="error">{errorContext}</div>}

                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="nombre@dominio.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={cargando}
                    />
                    {errores.email && <div className="error">{errores.email}</div>}

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