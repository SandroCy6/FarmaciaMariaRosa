document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products-container");
  const pagination = document.getElementById("pagination");

  let productos = [];
  let currentPage = 1;
  const itemsPerPage = 6; // 🔹 Cambia este número según quieras

  // Renderizar productos según página
  function renderProducts() {
    container.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const productosPagina = productos.slice(start, end);

    productosPagina.forEach(producto => {
      const col = document.createElement("div");
      col.classList.add("col-md-4");

      col.innerHTML = `
        <div class="card shadow-sm h-100 position-relative">
          <span class="badge-categoria">${producto.categoria}</span>
          <img src="${producto.imagen}" class="card-img-top p-3" alt="${producto.nombre}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text text-muted">${producto.descripcion}</p>
            <p class="mb-1"><strong>Stock:</strong> ${producto.stock}</p>
            <div class="mt-auto">
              <p class="fw-bold text-success">S/ ${producto.precio.toFixed(2)}</p>
              <small class="text-warning">⭐ ${producto.rating}</small>
            </div>
          </div>
        </div>
      `;

      container.appendChild(col);
    });

    renderPagination();
  }

  // Crear botones de paginación
  function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(productos.length / itemsPerPage);

    // Botón "Anterior"
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "« Anterior";
    prevBtn.classList.add("btn", "btn-outline-danger", "me-2");
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts();
      }
    });
    pagination.appendChild(prevBtn);

    // Botones de páginas
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      pageBtn.classList.add("btn", "btn-sm", i === currentPage ? "btn-danger" : "btn-outline-secondary", "mx-1");

      pageBtn.addEventListener("click", () => {
        currentPage = i;
        renderProducts();
      });

      pagination.appendChild(pageBtn);
    }

    // Botón "Siguiente"
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente »";
    nextBtn.classList.add("btn", "btn-outline-danger", "ms-2");
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
      }
    });
    pagination.appendChild(nextBtn);
  }

  // Cargar productos desde JSON
  fetch("../data/products.json")
    .then(res => res.json())
    .then(data => {
      productos = data;
      renderProducts();
    })
    .catch(error => console.error("Error cargando JSON:", error));
});
