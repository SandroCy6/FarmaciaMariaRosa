import React, { useEffect, useState } from 'react';
import { getProducts, pickBestRated } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

const FeaturedCarousel = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await getProducts();
      const featured = pickBestRated(allProducts, 4);
      setProducts(featured);
    };
    loadProducts();
  }, []);

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="fw-bold mb-4 text-center titulo-gradiente">Productos Destacados</h2>
        <div
          id="featuredProductsCarousel"
          className="carousel slide shadow rounded-4 overflow-hidden"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner" id="featuredProductsInner">
            {products.map((product, idx) => (
              <div
                key={product.id || idx}
                className={`carousel-item${idx === 0 ? ' active' : ''}`}
              >
                <div className="row align-items-center">
                  <div className="col-md-5 text-center">
                    <img
                      src={product.imagen}
                      alt={product.nombre}
                      className="img-fluid rounded shadow"
                      style={{ maxHeight: '250px' }}
                    />
                  </div>
                  <div className="col-md-7">
                    <h4>{product.nombre}</h4>
                    <p className="text-muted">{product.descripcion}</p>
                    <p>
                      <strong>Categoría:</strong> {product.categoria}
                    </p>
                    <p>
                      <strong>Precio:</strong>{' '}
                      <span className="text-success fw-bold">
                        S/ {parseFloat(product.precio).toFixed(2)}
                      </span>
                    </p>
                    <p>
                      <strong>Rating:</strong>{' '}
                      <span className="text-warning">
                        {'★'.repeat(Math.round(product.rating))}
                      </span>{' '}
                      ({product.rating})
                    </p>
                    <button
                      className="btn btn-custom mt-2"
                      onClick={() => navigate('/pages/productos')}
                    >
                      Ver más
                    </button>
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
          >
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#featuredProductsCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarousel;
