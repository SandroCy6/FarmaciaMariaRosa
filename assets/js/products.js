document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products-container");
  const pagination = document.getElementById("pagination");

  let productos = [];
  let currentPage = 1;
  const itemsPerPage = 6; // 🔹 Cambia este número según quieras
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  let productosFiltrados = [];

  // Renderizar productos según página
  function renderProducts() {
    container.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pagina = productosFiltrados.slice(start, end);

    pagina.forEach((producto) => {
      const col = document.createElement("div");
      col.classList.add("col-md-4");

      col.innerHTML = `
      <div class="card shadow-sm h-100 position-relative producto-card" style="cursor:pointer">
        <span class="badge-categoria">${producto.categoria}</span>
        <img src="${producto.imagen}" class="card-img-top p-3" alt="${
        producto.nombre
      }">
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

      // Evento click → abrir modal con detalles
      col.querySelector(".producto-card").addEventListener("click", () => {
        document.getElementById("modalImagen").src = producto.imagen;
        document.getElementById("modalImagen").alt = producto.nombre;
        document.getElementById("modalNombre").textContent = producto.nombre;
        document.getElementById("modalDescripcion").textContent =
          producto.descripcion;
        document.getElementById("modalCategoria").textContent =
          producto.categoria;
        document.getElementById("modalStock").textContent = producto.stock;
        document.getElementById(
          "modalPrecio"
        ).textContent = `S/ ${producto.precio.toFixed(2)}`;
        document.getElementById(
          "modalRating"
        ).textContent = `⭐ ${producto.rating}`;

        // Mostrar modal con Bootstrap
        const modal = new bootstrap.Modal(
          document.getElementById("productModal")
        );
        modal.show();
      });

      container.appendChild(col);
    });

    renderPagination();
  }

  // 🔹 función de filtros
  function aplicarFiltros() {
    const search = searchInput.value.toLowerCase();
    const categoria = categoryFilter.value;

    productosFiltrados = productos.filter((p) => {
      const matchSearch =
        p.nombre.toLowerCase().includes(search) ||
        p.descripcion.toLowerCase().includes(search);
      const matchCategoria = categoria === "all" || p.categoria === categoria;
      return matchSearch && matchCategoria;
    });

    currentPage = 1;
    renderProducts();
    document.getElementById(
      "resultCount"
    ).textContent = `${productosFiltrados.length} resultados`;
  }

  searchInput.addEventListener("input", aplicarFiltros);
  categoryFilter.addEventListener("change", aplicarFiltros);

  // Crear botones de paginación
  function renderPagination() {
    pagination.innerHTML = "";
    // 🔹 usar productosFiltrados para paginación, no productos
    const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

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
      pageBtn.classList.add(
        "btn",
        "btn-sm",
        i === currentPage ? "btn-danger" : "btn-outline-secondary",
        "mx-1"
      );

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
    .then((res) => res.json())
    .then((data) => {
      productos = data;
      productosFiltrados = productos; // iniciar con todos
      renderProducts();

      const categorias = [...new Set(productos.map((p) => p.categoria))];
      categoryFilter.innerHTML =
        '<option value="all" selected>Todos</option>' +
        categorias.map((c) => `<option value="${c}">${c}</option>`).join("");
    })
    .catch((error) => console.error("Error cargando JSON:", error));
});
