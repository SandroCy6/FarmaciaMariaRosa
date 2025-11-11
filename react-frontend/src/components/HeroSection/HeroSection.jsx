import React from "react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <section className={`${styles.hero} position-relative overflow-hidden`}>
      <div className="container">
        <div className="row align-items-center">
          {/* Texto */}
          <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
            <span
              className={`${styles.badge} ${styles.badgePrimaryCustom} mb-4 ${styles.animateSlideIn}`}
              style={{ "--animation-delay": "0.2s" }}
            >
              <i className="bi bi-star-fill me-1"></i> Tu farmacia de confianza
            </span>
            <h1 className={`fw-bold ${styles.animateSlideIn}`} style={{ "--animation-delay": "0.4s" }}>
              Encuentra tus productos <br />
              y <span className={styles.heroHighlight}>recógelos en tienda</span>
            </h1>
            <p className={`text-muted mb-4 ${styles.animateSlideIn}`} style={{ "--animation-delay": "0.6s" }}>
              Reserva tus medicamentos y productos de salud online. Agenda tu hora de recogida y paga
              cómodamente en nuestra farmacia.
            </p>
            <a
              href="/productos"
              className={`${styles.catalogoButton} ${styles.animateSlideIn}`}
              style={{ "--animation-delay": "0.8s" }}
            >
              Ver Productos
            </a>
          </div>
          {/* Imagen */}
          <div className="col-md-6">
            <div className="position-relative">
              <img
                src="/assets/img/farmacia.jpg"
                className={`img-fluid rounded-4 shadow ${styles.heroImage}`}
                alt="Farmacia"
              />
              <span
                className={`${styles.badge} ${styles.badgePrimaryCustom} position-absolute bottom-0 start-0 m-3`}
                style={{ "--animation-delay": "1s" }}
              >
                500+ Productos
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
