import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container text-center">
        <img
          style={{ marginBottom: '10px' }}
          src="/assets/img/logo2.jpeg"
          alt="Logo Farmacia"
          width="50"
          height="50"
          className="me-2 logo-animate"
        />
        <h5 className="fw-bold" style={{ marginBottom: '20px' }}>
          Farmacia María Rosa
        </h5>

        <p>
          Tu farmacia de confianza. Comprometidos con tu salud y bienestar desde hace más de 30
          años.
        </p>
        <div className="d-flex flex-column flex-md-row justify-content-center gap-4 mt-3">
          <p>
            <i className="bi bi-geo-alt-fill"></i> Av. Huacachina Frente Hospital Regional,
            Ciudad ICA
          </p>
          <p>
            <i className="bi bi-telephone-fill"></i> +51 922 684 873
          </p>
          <p>
            <i className="bi bi-envelope-fill"></i> info@farmaciamariarosa.cl
          </p>
        </div>
        <p className="mt-3">&copy; 2025 Farmacia María Rosa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
