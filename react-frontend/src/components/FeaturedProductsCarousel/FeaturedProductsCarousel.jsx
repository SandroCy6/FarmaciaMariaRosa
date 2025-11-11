import React, { useEffect, useState } from "react";

function pickBestRated(products, count = 4) {
  // Ordena por rating descendente y mezcla aleatoriamente entre top 8
  const sorted = [...products].sort((a, b) => b.rating - a.rating);
  const top = sorted.slice(0, 8);

  for (let i = top.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [top[i], top[j]] = [top[j], top[i]];
  }
  return top.slice(0, count);
}

export default function FeaturedProductsCarousel() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/assets/data/products.json");
      const products = await res.json();
      setFeaturedProducts(pickBestRated(products));
    }
    fetchProducts();
  }, []);

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="fw-bold mb-4 text-center titulo-gradiente">
          Productos Destacados
        </h2>
        <div
          id="featuredProductsCarousel"
          className="carousel slide shadow rounded-4 overflow-hidden"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {featuredProducts.map((p, idx) => (
              <div
                className={`carousel-item${idx === 0 ? " active" : ""}`}
                key={p.id || idx}
              >
                <div className="row align-items-center">
                  <div className="col-md-5 text-center">
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      className="img-fluid rounded shadow"
                      style={{ maxHeight: 250 }}
                    />
                  </div>
                  <div className="col-md-7">
                    <h4>{p.nombre}</h4>
                    <p className="text-muted">{p.descripcion}</p>
                    <p>
                      <strong>Categoría:</strong> {p.categoria}
                    </p>
                    <p>
                      <strong>Precio:</strong>{" "}
                      <span className="text-success fw-bold">
                        S/ {parseFloat(p.precio).toFixed(2)}
                      </span>
                    </p>
                    <p>
                      <strong>Rating:</strong>{" "}
                      <span className="text-warning">
                        {"★".repeat(Math.round(p.rating))}
                      </span>{" "}
                      ({p.rating})
                    </p>
                    <a href="./pages/productos.html" className="btn btn-custom mt-2">
                      Ver más
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#featuredProductsCarousel"
            data-bs-slide="prev"
            aria-label="Previous"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#featuredProductsCarousel"
            data-bs-slide="next"
            aria-label="Next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    </section>
  );
}
