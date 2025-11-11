import React from "react";
import styles from "./CategoriaSection.module.css";

export default function CategoriaSection() {
  return (
    <section className={`${styles.categories} py-5`}>
      <div className="container text-center">
        <h2 className={`fw-bold mb-3 ${styles.animateFadeIn} ${styles.categoriesTitle}`}>
          Nuestras Categorías
        </h2>
        <p
          className={`text-muted mb-5 ${styles.animateFadeIn} ${styles.categoriesDescription}`}
          style={{ "--animation-delay": "0.2s" }}
        >
          Encuentra exactamente lo que necesitas para tu salud y bienestar
        </p>
        <div className={styles.categoriesGrid}>
          {/* Categoría 1 - Medicinas */}
          <div className={`${styles.categoryCard} ${styles.medicina}`}>
            <div className={`${styles.card} h-100 position-relative`}>
              <img
                src="/assets/img/medicinas.jpg"
                className={styles.categoryImg}
                alt="Medicinas"
                aria-label="Categoría Medicinas"
              />
              <div className={styles.cardBody}>
                <i className={`bi bi-capsule-pill ${styles.cardBodyIcon}`} aria-hidden="true"></i>
                <h5 className={styles.categoryTitle}>Medicinas</h5>
                <p className={styles.categoryDescription}>
                  Medicamentos recetados y de venta libre
                </p>
                <a
                  href="/categorias/medicinas"
                  className={styles.btnCustomCategory}
                  aria-label="Explorar categoría Medicinas"
                >
                  Explorar Categoría
                </a>
              </div>
            </div>
          </div>

          {/* Categoría 2 - Cuidado Personal */}
          <div className={`${styles.categoryCard} ${styles.cuidado}`}>
            <div className={`${styles.card} h-100 position-relative`}>
              <img
                src="/assets/img/cuidado-personal.png"
                className={styles.categoryImg}
                alt="Cuidado Personal"
                aria-label="Categoría Cuidado Personal"
              />
              <div className={styles.cardBody}>
                <i className={`bi bi-heart-pulse ${styles.cardBodyIcon}`} aria-hidden="true"></i>
                <h5 className={styles.categoryTitle}>Cuidado Personal</h5>
                <p className={styles.categoryDescription}>
                  Productos para tu higiene y bienestar
                </p>
                <a
                  href="/categorias/cuidado-personal"
                  className={styles.btnCustomCategory}
                  aria-label="Explorar categoría Cuidado Personal"
                >
                  Explorar Categoría
                </a>
              </div>
            </div>
          </div>

          {/* Categoría 3 - Vitaminas y Suplementos */}
          <div className={`${styles.categoryCard} ${styles.vitaminas}`}>
            <div className={`${styles.card} h-100 position-relative`}>
              <img
                src="/assets/img/vitaminas-suplementos.jpg"
                className={styles.categoryImg}
                alt="Vitaminas y Suplementos"
                aria-label="Categoría Vitaminas y Suplementos"
              />
              <div className={styles.cardBody}>
                <i className={`bi bi-stars ${styles.cardBodyIcon}`} aria-hidden="true"></i>
                <h5 className={styles.categoryTitle}>Vitaminas y Suplementos</h5>
                <p className={styles.categoryDescription}>
                  Complementos para una vida saludable
                </p>
                <a
                  href="/categorias/vitaminas-suplementos"
                  className={styles.btnCustomCategory}
                  aria-label="Explorar categoría Vitaminas y Suplementos"
                >
                  Explorar Categoría
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
