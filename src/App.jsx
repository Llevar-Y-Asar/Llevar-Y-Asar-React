// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { Home } from './pages/home';
import { Productos } from './pages/productos';
import { Registro } from './pages/registro';
import { Login } from './pages/login';
import { Perfil } from './pages/Perfil';
import Admin from './pages/Admin';
import { Nosotros } from './pages/Nosotros';
import { Blog } from './pages/Blog';
import { BlogDetalle } from './pages/BlogDetalle';
import { Contacto } from './pages/Contacto';
import { Carrito } from './pages/Carrito';
import { Checkout } from './pages/Checkout';
import { CarritoProvider } from './context/CarritoContext';
import { ProductosProvider } from './context/productosContext';
import { UsuarioProvider } from './context/UsuarioContext';
import { OrdenesProvider } from './context/OrdenesContext';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <UsuarioProvider>
        <ProductosProvider>
          <CarritoProvider>
            <OrdenesProvider>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetalle />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/login" element={<Login />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
              <Footer />
            </OrdenesProvider>
          </CarritoProvider>
        </ProductosProvider>
      </UsuarioProvider>
    </BrowserRouter>
  );
}