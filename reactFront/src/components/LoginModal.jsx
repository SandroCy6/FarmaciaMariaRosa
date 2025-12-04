import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginModal = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', password2: '' });
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const result = login(loginData.email, loginData.password);
    if (result.success) {
      const modal = window.bootstrap.Modal.getInstance(document.getElementById('loginModal'));
      if (modal) modal.hide();
      setLoginData({ email: '', password: '' });
      alert(`¡Bienvenido, ${loginData.email}!`);
      
      if (result.user.role === 'admin') {
        navigate('/admin');
      }
    } else {
      setLoginError(result.error);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    const result = register(registerData.email, registerData.password, registerData.password2);
    if (result.success) {
      setRegisterSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setRegisterData({ email: '', password: '', password2: '' });
      setTimeout(() => {
        const form = document.getElementById('registerForm');
        if (form) form.reset();
      }, 100);
    } else {
      setRegisterError(result.error);
    }
  };

  return (
    <div 
      className="modal fade" 
      id="loginModal" 
      tabIndex="-1" 
      aria-labelledby="loginModalLabel" 
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="loginModalLabel">
              Iniciar Sesión / Registrarse
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body">
            <ul className="nav nav-tabs mb-3" id="authTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="login-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#loginTabPane"
                  type="button"
                  role="tab"
                  aria-controls="loginTabPane"
                  aria-selected="true"
                >
                  Login
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="register-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#registerTabPane"
                  type="button"
                  role="tab"
                  aria-controls="registerTabPane"
                  aria-selected="false"
                >
                  Registro
                </button>
              </li>
            </ul>

            <div className="tab-content">
              <div 
                className="tab-pane fade show active" 
                id="loginTabPane" 
                role="tabpanel"
                aria-labelledby="login-tab"
              >
                <form id="loginForm" onSubmit={handleLoginSubmit}>
                  <div className="mb-3">
                    <label htmlFor="loginEmail" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="loginEmail"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="loginPassword" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="loginPassword"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  {loginError && (
                    <div id="loginError" className="text-danger mb-2">
                      {loginError}
                    </div>
                  )}
                  <button type="submit" className="btn btn-custom w-100 mt-2">
                    Ingresar
                  </button>
                </form>
              </div>

              <div 
                className="tab-pane fade" 
                id="registerTabPane" 
                role="tabpanel"
                aria-labelledby="register-tab"
              >
                <form id="registerForm" onSubmit={handleRegisterSubmit}>
                  <div className="mb-3">
                    <label htmlFor="registerEmail" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="registerEmail"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="registerPassword" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="registerPassword"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="registerPassword2" className="form-label">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="registerPassword2"
                      value={registerData.password2}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, password2: e.target.value })
                      }
                      required
                    />
                  </div>
                  {registerError && (
                    <div id="registerError" className="text-danger mb-2">
                      {registerError}
                    </div>
                  )}
                  {registerSuccess && (
                    <div id="registerSuccess" className="text-success mb-2">
                      {registerSuccess}
                    </div>
                  )}
                  <button type="submit" className="btn btn-custom w-100 mt-2">
                    Registrarse
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
