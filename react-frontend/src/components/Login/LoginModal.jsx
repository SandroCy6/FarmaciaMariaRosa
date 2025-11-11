import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";

export default function LoginModal() {
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPassword2, setRegisterPassword2] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    const success = login(loginEmail, loginPassword);
    if (!success) {
      setLoginError("Usuario o contraseña incorrectos.");
    } else {
      // Cerrar modal (puedes usar manejo de estado global para eso)
      // Por ahora simplemente reset
      setLoginEmail("");
      setLoginPassword("");
      // Opcional: cerrar modal con bootstrap o librería React Modal
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    if (registerPassword !== registerPassword2) {
      setRegisterError("Las contraseñas no coinciden.");
      return;
    }
    const success = register(registerEmail, registerPassword);
    if (!success) {
      setRegisterError("El correo ya está registrado o contraseña inválida.");
    } else {
      setRegisterSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterPassword2("");
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
            <ul
              className="nav nav-tabs mb-3"
              id="authTab"
              role="tablist"
              style={{ cursor: "pointer" }}
            >
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                  onClick={() => setActiveTab("login")}
                  type="button"
                  role="tab"
                >
                  Login
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${
                    activeTab === "register" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("register")}
                  type="button"
                  role="tab"
                >
                  Registro
                </button>
              </li>
            </ul>
            <div className="tab-content">
              {activeTab === "login" && (
                <div
                  className="tab-pane fade show active"
                  id="loginTabPane"
                  role="tabpanel"
                >
                  <form onSubmit={handleLoginSubmit}>
                    <div className="mb-3">
                      <label htmlFor="loginEmail" className="form-label">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="loginEmail"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
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
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    {loginError && (
                      <div className="text-danger">{loginError}</div>
                    )}
                    <button type="submit" className="btn btn-custom w-100 mt-2">
                      Ingresar
                    </button>
                  </form>
                </div>
              )}
              {activeTab === "register" && (
                <div
                  className="tab-pane fade show active"
                  id="registerTabPane"
                  role="tabpanel"
                >
                  <form onSubmit={handleRegisterSubmit}>
                    <div className="mb-3">
                      <label htmlFor="registerEmail" className="form-label">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="registerEmail"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
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
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
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
                        value={registerPassword2}
                        onChange={(e) => setRegisterPassword2(e.target.value)}
                        required
                      />
                    </div>
                    {registerError && (
                      <div className="text-danger">{registerError}</div>
                    )}
                    {registerSuccess && (
                      <div className="text-success">{registerSuccess}</div>
                    )}
                    <button type="submit" className="btn btn-custom w-100 mt-2">
                      Registrarse
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
