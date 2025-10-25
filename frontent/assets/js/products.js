document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products-container");
  const pagination = document.getElementById("pagination");

  let productos = [];
  let currentPage = 1;
  const itemsPerPage = 6;
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  let productosFiltrados = [];
  const maxVisiblePages = 5; // Máximo de botones de página visibles

  // Renderizar productos según página
  function renderProducts() {
    container.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pagina = productosFiltrados.slice(start, end);

    // Mostrar mensaje si no hay resultados
    if (pagina.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-search display-1 text-muted"></i>
          <h3 class="mt-3">No se encontraron productos</h3>
          <p class="text-muted">Intenta con otros términos de búsqueda o categorías</p>
        </div>
      `;
      pagination.innerHTML = "";
      return;
    }
    // Crear cards de productos
    pagina.forEach((producto) => {
      const col = document.createElement("div");
      col.classList.add("col-md-4", "mb-4");

      col.innerHTML = `
      <div class="card shadow-sm h-100 position-relative producto-card" style="cursor:pointer">
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
      // Abrir modal con detalles al hacer clic
      col.querySelector(".producto-card").addEventListener("click", () => {
        document.getElementById("modalImagen").src = producto.imagen;
        document.getElementById("modalImagen").alt = producto.nombre;
        document.getElementById("modalNombre").textContent = producto.nombre;
        document.getElementById("modalDescripcion").textContent = producto.descripcion;
        document.getElementById("modalCategoria").textContent = producto.categoria;
        document.getElementById("modalStock").textContent = producto.stock;
        document.getElementById("modalPrecio").textContent = `S/ ${producto.precio.toFixed(2)}`;
        document.getElementById("modalRating").textContent = `⭐ ${producto.rating}`;

        const modal = new bootstrap.Modal(document.getElementById("productModal"));
        modal.show();
      });

      container.appendChild(col);
    });

    renderPagination();
  }

  // 🔹 Aplica búsqueda y filtros por categoría
  function aplicarFiltros() {
    const search = searchInput.value.toLowerCase();
    const categoria = categoryFilter.value;

    productosFiltrados = productos.filter((p) => {
      const matchSearch = p.nombre.toLowerCase().includes(search) || p.descripcion.toLowerCase().includes(search);
      const matchCategoria = categoria === "all" || p.categoria === categoria;
      return matchSearch && matchCategoria;
    });

    currentPage = 1;
    renderProducts();

    // Mostrar cantidad de resultados
    const resultCount = document.getElementById("resultCount");
    if (searchInput.value.trim() !== "") {
      resultCount.textContent = `${productosFiltrados.length} resultados`;
      resultCount.style.display = "inline-block";
    } else {
      resultCount.style.display = "none";
    }
  }

  searchInput.addEventListener("input", aplicarFiltros);
  categoryFilter.addEventListener("change", aplicarFiltros);

  // 🔹 Renderiza los botones de paginación
  function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
    
    if (totalPages <= 1) return; // No mostrar paginación si hay una sola página

    // Calcular rango de páginas visibles
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Botón "Primera página"
    if (startPage > 1) {
      const firstBtn = createPaginationButton("««", 1, "btn-outline-danger", "Primera página");
      pagination.appendChild(firstBtn);
    }

    // Botón "Anterior"
    const prevBtn = createPaginationButton("« Anterior", currentPage - 1, "btn-outline-danger", "Página anterior");
    prevBtn.disabled = currentPage === 1;
    pagination.appendChild(prevBtn);

    // Botones de páginas numeradas
    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = createPaginationButton(i, i, i === currentPage ? "btn-danger" : "btn-outline-secondary", `Ir a página ${i}`);
      pagination.appendChild(pageBtn);
    }

    // Puntos suspensivos si hay más páginas después
    if (endPage < totalPages) {
      const ellipsis = document.createElement("span");
      ellipsis.classList.add("mx-2", "align-middle");
      ellipsis.textContent = "...";
      pagination.appendChild(ellipsis);
      
      // Botón para última página
      const lastBtn = createPaginationButton(totalPages, totalPages, "btn-outline-secondary", `Ir a la última página (${totalPages})`);
      pagination.appendChild(lastBtn);
    }

    // Botón "Siguiente"
    const nextBtn = createPaginationButton("Siguiente »", currentPage + 1, "btn-outline-danger", "Página siguiente");
    nextBtn.disabled = currentPage === totalPages;
    pagination.appendChild(nextBtn);

    // Botón "Última página"
    if (endPage < totalPages) {
      const lastBtn = createPaginationButton("»»", totalPages, "btn-outline-danger", "Última página");
      pagination.appendChild(lastBtn);
    }

    // Información de página actual
    const pageInfo = document.createElement("span");
    pageInfo.classList.add("align-self-center", "ms-3", "d-none", "d-md-block", "text-muted");
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    pagination.appendChild(pageInfo);
  }

  // Función auxiliar para crear botones de paginación
  function createPaginationButton(text, page, style, title) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add("btn", "btn-sm", style, "mx-1");
    button.title = title;
    
    button.addEventListener("click", () => {
      if (page >= 1 && page <= Math.ceil(productosFiltrados.length / itemsPerPage)) {
        currentPage = page;
        renderProducts();
        // Scroll suave hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    
    return button;
  }

  // Carga categorías desde /api/categorias
  async function cargarCategorias() {
    try {
      const response = await fetch('http://localhost:8081/api/categorias');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      categorias = await response.json();
      categoryFilter.innerHTML = '<option value="all" selected>Todas las categorías</option>' +
        categorias.map((c) => `<option value="${c.nombre}">${c.nombre}</option>`).join("");
    } catch (error) {
      console.error("Error cargando categorías:", error);
      categoryFilter.innerHTML = '<option value="all" selected>Todas las categorías</option>';
    }
  }

  // 🔹 Carga productos desde localStorage (admin) o JSON
  async function cargarProductos() {
    try {
      const response = await fetch('http://localhost:8081/api/productos');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const productosDTO = await response.json();

      // Mapear ProductoDTO a la estructura esperada por el frontend
      productos = productosDTO.map((dto) => {
        const categoria = categorias.find(c => c.idCategoria === dto.idCategoria);
        return {
          idProducto: dto.idProducto,
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          precio: dto.precio,
          stock: dto.stockActual,
          categoria: categoria ? categoria.nombre : 'Sin categoría',
          imagen: dto.imagenPrincipal || 'https://via.placeholder.com/150',
          rating: 'N/A' // Rating no está en ProductoDTO, asignamos 'N/A'
        };
      });

      productosFiltrados = productos;
      renderProducts();
    } catch (error) {
      console.error("Error cargando productos:", error);
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-exclamation-triangle display-1 text-danger"></i>
          <h3 class="mt-3">Error al cargar productos</h3>
          <p class="text-muted">No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.</p>
        </div>
      `;
      pagination.innerHTML = "";
    }
  
  }

  // Cargar categorías y luego productos
  async function inicializar() {
    await cargarCategorias();
    await cargarProductos();
  }

  inicializar();
});