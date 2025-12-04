import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si no hay usuario logueado, redirigir al inicio
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body text-center">
                <p className="text-muted">Cargando perfil...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body text-center">
              <i className="bi bi-person-circle display-1 mb-3"></i>
              <h3 id="userEmail">{user.email}</h3>
              <p className="text-muted">Bienvenido a tu perfil.</p>
              {user.role === 'admin' && (
                <p className="badge bg-danger mb-3">
                  Rol: Administrador
                </p>
              )}
              <button
                id="logoutBtn"
                className="btn btn-danger mt-3"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Perfil;
