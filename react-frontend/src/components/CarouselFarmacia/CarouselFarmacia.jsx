import React from "react";

export default function CarouselFarmacia() {
  return (
    <div className="carrusel-container">
      <div
        id="carruselFarmacia"
        className="carousel slide shadow rounded-4 overflow-hidden"
        data-bs-ride="carousel"
      >
        {/* Indicadores */}
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carruselFarmacia"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carruselFarmacia"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
        </div>

        {/* Imágenes */}
        <div className="carousel-inner">
          <div className="carousel-item active">
            <a href="./pages/productos.html">
              <img
                src="/assets/img/carrusel1.jpg"
                className="carrusel-img d-block w-100"
                alt="carrusel1"
                style={{ objectFit: "cover" }}
              />
            </a>
          </div>
          <div className="carousel-item">
            <a href="./pages/productos.html">
              <img
                src="/assets/img/carrusel2.jpg"
                className="carrusel-img d-block w-100"
                alt="carrusel2"
                style={{ objectFit: "cover" }}
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
          aria-label="Previous"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carruselFarmacia"
          data-bs-slide="next"
          aria-label="Next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>
  );
}
