import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeaturedCarousel from '../components/FeaturedCarousel';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* CARRUSEL */}
      <div className="carrusel-container">
        <div id="carruselFarmacia" className="carousel slide shadow rounded-4 overflow-hidden" data-bs-ride="carousel">
          {/* Indicadores */}
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carruselFarmacia"
              data-bs-slide-to="0"
              className="active"
            ></button>
            <button
              type="button"
              data-bs-target="#carruselFarmacia"
              data-bs-slide-to="1"
            ></button>
          </div>

          {/* Imágenes */}
          <div className="carousel-inner">
            <div className="carousel-item active">
              <a href="/pages/productos">
                <img
                  src="./assets/img/carrusel1.jpg"
                  className="carrusel-img d-block w-100"
                  alt="carrusel1"
                  style={{ objectFit: 'cover' }}
                />
              </a>
            </div>
            <div className="carousel-item">
              <a href="/pages/productos">
                <img
                  src="./assets/img/carrusel2.jpg"
                  className="carrusel-img d-block w-100"
                  alt="carrusel2"
                  style={{ objectFit: 'cover' }}
                />
              </a>
            </div>
          </div>

          {/* Controles */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carruselFarmacia"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carruselFarmacia"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="hero position-relative overflow-hidden">
        <div className="container">
          <div className="row align-items-center">
            {/* Texto */}
            <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
              <span
                className="badge bg-primary-custom text-white mb-4 animate-slide-in"
                style={{ '--animation-delay': '0.2s' }}
              >
                <i className="bi bi-star-fill me-1"></i> Tu farmacia de confianza
              </span>
              <h1 className="fw-bold animate-slide-in" style={{ '--animation-delay': '0.4s' }}>
                Encuentra tus productos <br />
                y <span className="hero-highlight">recógelos en tienda</span>
              </h1>
              <p className="text-muted mb-4 animate-slide-in" style={{ '--animation-delay': '0.6s' }}>
                Reserva tus medicamentos y productos de salud online. Agenda tu hora de recogida
                y paga cómodamente en nuestra farmacia.
              </p>
              <a
                href="/pages/productos"
                className="catalogo-button"
                style={{ '--animation-delay': '0.8s' }}
              >
                Ver Productos
              </a>
            </div>
            {/* Imagen */}
            <div className="col-md-6">
              <div className="position-relative animate-image-in">
                <img
                  src="./assets/img/farmacia.jpg"
                  className="img-fluid rounded-4 shadow hero-image"
                  alt="Farmacia"
                />
                <span
                  className="badge bg-primary-custom position-absolute bottom-0 start-0 m-3 animate-badge"
                  style={{ '--animation-delay': '1s' }}
                >
                  500+ Productos
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <FeaturedCarousel />

      {/* CATEGORÍAS */}
      <section className="categories py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3 animate-fade-in titulo-gradiente">Nuestras Categorías</h2>
          <p
            className="text-muted mb-5 animate-fade-in"
            style={{ '--animation-delay': '0.2s' }}
          >
            Encuentra exactamente lo que necesitas para tu salud y bienestar
          </p>
          <div className="categories-grid">
            {/* Categoría 1 */}
            <div className="category-card medicina">
              <div className="card h-100 position-relative">
                <img
                  src="./assets/img/medicinas.jpg"
                  className="card-img-top category-img"
                  alt="Medicinas"
                  aria-label="Categoría Medicinas"
                />
                <div className="card-body">
                  <i className="bi bi-capsule-pill mb-3" aria-hidden="true"></i>
                  <h5 className="category fw-bold">Medicinas</h5>
                  <p className="text-muted">Medicamentos recetados y de venta libre</p>
                  <button
                    className="btn btn-custom"
                    onClick={() => navigate('/pages/productos')}
                    aria-label="Explorar categoría Medicinas"
                  >
                    Explorar Categoría
                  </button>
                </div>
              </div>
            </div>

            {/* Categoría 2 */}
            <div className="category-card cuidado">
              <div className="card h-100 position-relative">
                <img
                  src="./assets/img/cuidado-personal.png"
                  className="card-img-top category-img"
                  alt="Cuidado Personal"
                  aria-label="Categoría Cuidado Personal"
                />
                <div className="card-body">
                  <i className="bi bi-heart-pulse mb-3" aria-hidden="true"></i>
                  <h5 className="category fw-bold">Cuidado Personal</h5>
                  <p className="text-muted">Productos para tu higiene y bienestar</p>
                  <button
                    className="btn btn-custom"
                    onClick={() => navigate('/pages/productos')}
                    aria-label="Explorar categoría Cuidado Personal"
                  >
                    Explorar Categoría
                  </button>
                </div>
              </div>
            </div>

            {/* Categoría 3 */}
            <div className="category-card vitaminas">
              <div className="card h-100 position-relative">
                <img
                  src="./assets/img/vitaminas-suplementos.jpg"
                  className="card-img-top category-img"
                  alt="Vitaminas y Suplementos"
                  aria-label="Categoría Vitaminas y Suplementos"
                />
                <div className="card-body">
                  <i className="bi bi-stars mb-3" aria-hidden="true"></i>
                  <h5 className="category fw-bold">Vitaminas y Suplementos</h5>
                  <p className="text-muted">Complementos para una vida saludable</p>
                  <button
                    className="btn btn-custom"
                    onClick={() => navigate('/pages/productos')}
                    aria-label="Explorar categoría Vitaminas y Suplementos"
                  >
                    Explorar Categoría
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CONTACTO */}
      <section className="contacto-hero d-flex align-items-center justify-content-center text-center">
        <div className="overlay"></div>
        <div className="content">
          <h1 className="display-3 fw-bold text-white">¡Contáctanos!</h1>
          <p className="lead text-white">
            Llena el formulario y estaremos aquí para ayudarte en todo momento
          </p>
          <button
            className="contacto-button"
            onClick={() => navigate('/pages/contacto')}
          >
            ¡Contactanos aqui!
          </button>
        </div>
      </section>
    </>
  );
};

export default Home;
