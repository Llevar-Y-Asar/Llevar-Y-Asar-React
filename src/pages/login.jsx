// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validarFormularioLogin } from '../utils/helpers';
import { useUsuario } from '../context/UsuarioContext';

export function Login() {
    const navigate = useNavigate();
    const { iniciarSesion, usuarios } = useUsuario();
    const [formData, setFormData] = useState({
        run: '',
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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Buscar usuario por RUT
        const usuario = usuarios.find(u => u.run === formData.run);
        
        if (!usuario) {
            setErrores({ run: '❌ Usuario no encontrado. Verifica tu RUT.' });
            return;
        }
        
        if (usuario.password !== formData.password) {
            setErrores({ password: '❌ Contraseña incorrecta.' });
            return;
        }
        
        // Login exitoso
        iniciarSesion(formData.run, formData.password);
        alert(`✅ ¡Bienvenido ${usuario.nombre}!`);
        navigate('/perfil');
    };

    return (
        <main>
            <section>
                <h1>Iniciar Sesión</h1>
                <p>Ingresa tus datos para acceder a tu cuenta y realizar pedidos.</p>
                <form id="form-login" onSubmit={handleSubmit}>
                    <label>RUT (sin puntos ni guión):</label>
                    <input
                        type="text"
                        name="run"
                        placeholder="12345678"
                        value={formData.run}
                        onChange={handleChange}
                        required
                    />
                    {errores.run && <div className="error">{errores.run}</div>}

                    <label>Contraseña:</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errores.password && <div className="error">{errores.password}</div>}

                    <button type="submit">Iniciar Sesión</button>
                    <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
                </form>
            </section>
        </main>
    );
}