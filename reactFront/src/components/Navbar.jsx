import React, { useEffect, useRef } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginModal from './LoginModal';

const Navbar = () => {
  const { toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const modalInstanceRef = useRef(null);

  useEffect(() => {
    const loginModalElement = document.getElementById('loginModal');
    if (loginModalElement && !modalInstanceRef.current) {
      try {
        modalInstanceRef.current = new window.bootstrap.Modal(loginModalElement);
      } catch (error) {
        console.error('Error initializing Bootstrap Modal:', error);
      }
    }
  }, []);

  const handleLoginBtnClick = (e) => {
    if (user) {
      e.preventDefault();
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/pages/perfil');
      }
    } else {
      if (modalInstanceRef.current) {
        modalInstanceRef.current.show();
      }
    }
  };

  const handleShopClick = () => {
    navigate('/pages/productos');
  };

  const isActive = (path) => location.pathname === path ? 'nav-btn-activo' : '';

  return (
    <>
      <nav className="navbar navbar-expand-lg shadow-sm sticky-top">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src="/assets/img/logo2.jpeg"
              alt="Logo Farmacia"
              width="50"
              height="50"
              className="me-2 logo-animate"
            />
            <span className="fw-bold">&nbsp;Farmacia María Rosa</span>
          </a>

          <button
            className="navbar-toggler custom-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto d-flex align-items-center">
              <li className="nav-item">
                <a className={`nav-link nav-btn ${isActive('/')}`} href="/">
                  Inicio
                  <span className="nav-underline"></span>
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link nav-btn ${isActive('/pages/productos')}`} href="/pages/productos">
                  Productos
                  <span className="nav-underline"></span>
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link nav-btn ${isActive('/pages/contacto')}`} href="/pages/contacto">
                  Contacto
                  <span className="nav-underline"></span>
                </a>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              <button 
                id="darkModeToggle"
                className="btn btn-custom-nav" 
                onClick={toggleDarkMode}
                title="Cambiar tema"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-moon h-5 w-5 icon-animate"
                  aria-hidden="true"
                >
                  <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path>
                </svg>
              </button>

              <button
                id="shopCar"
                className="btn btn-custom-nav"
                onClick={handleShopClick}
                title="Ver carrito"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-shopping-cart h-5 w-5 icon-animate"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="21" r="1"></circle>
                  <circle cx="19" cy="21" r="1"></circle>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                </svg>
              </button>

              <button
                id="loginBtn"
                className="btn btn-custom-nav"
                onClick={handleLoginBtnClick}
                title={user ? 'Ir a perfil' : 'Iniciar sesión'}
              >
                <svg
                  data-v-6433c584=""
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-user-round-icon lucide-circle-user-round"
                >
                  <path d="M18 20a6 6 0 0 0-12 0"></path>
                  <circle cx="12" cy="10" r="4"></circle>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </button>

              {user && (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={logout}
                  title="Cerrar sesión"
                >
                  Salir
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal />
    </>
  );
};

export default Navbar;
