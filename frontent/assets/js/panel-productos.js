document.addEventListener("DOMContentLoaded", function () {
  let products = [];
  let filteredProducts = [];
  const productsTable = document.querySelector("#productsTable tbody");
  const productForm = document.getElementById("productForm");
  const productModal = new bootstrap.Modal(document.getElementById("productModal"));
  const searchInput = document.getElementById("adminSearchInput");
  const idSearchInput = document.getElementById("adminIdSearchInput");
  const categoryFilter = document.getElementById("adminCategoryFilter");

  function loadCategories() {
    fetch("http://localhost:8081/api/categorias")
      .then(response => {
        if (!response.ok) throw new Error("Error al cargar categorías");
        return response.json();
      })
      .then(categories => {
        categoryFilter.innerHTML = '<option value="all">Todas las categorías</option>' +
          categories.map(c => `<option value="${c.idCategoria}">${c.nombre}</option>`).join("");
      })
      .catch(error => {
        console.error("Error cargando categorías:", error);
        categoryFilter.innerHTML = '<option value="all">Todas las categorías</option>';
      });
  }

  function loadProducts() {
    fetch("http://localhost:8081/api/productos")
      .then(response => {
        if (!response.ok) throw new Error("Error al cargar productos");
        return response.json();
      })
      .then(data => {
        products = data;
        filteredProducts = products;
        renderTable();
      })
      .catch(error => {
        console.error("Error cargando productos:", error);
        productsTable.innerHTML = `<tr><td colspan="9" class="text-center text-muted">Error al cargar productos: ${error.message}</td></tr>`;
      });
  }

  function aplicarFiltros() {
    const search = searchInput.value.trim().toLowerCase();
    const idSearch = idSearchInput.value.trim();
    const categoria = categoryFilter.value;
    filteredProducts = products.filter(p => {
      const matchCategoria = categoria === "all" || String(p.idCategoria) === categoria;
      const matchId = idSearch === "" || String(p.idProducto).includes(idSearch);
      const matchSearch =
        search === "" ||
        p.nombre.toLowerCase().includes(search) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(search));
      return matchCategoria && matchId && matchSearch;
    });
    renderTable();
  }

  function renderTable() {
    productsTable.innerHTML = "";
    if (filteredProducts.length === 0) {
      productsTable.innerHTML = `<tr><td colspan="9" class="text-center text-muted">No se encontraron productos</td></tr>`;
      return;
    }
    filteredProducts.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.idProducto}</td>
        <td>${p.nombre}</td>
        <td>${p.idCategoria}</td>
        <td>${p.descripcion || '-'}</td>
        <td>S/ ${parseFloat(p.precio).toFixed(2)}</td>
        <td>${p.stockActual}</td>
        <td><img src="${p.imagenPrincipal || ''}" alt="" width="50" onerror="this.src='https://via.placeholder.com/50'"></td>
        <td>${p.fechaVencimiento || '-'}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editProduct(${p.idProducto})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.idProducto})">Eliminar</button>
        </td>
      `;
      productsTable.appendChild(tr);
    });
  }

  searchInput.addEventListener("input", aplicarFiltros);
  idSearchInput.addEventListener("input", aplicarFiltros);
  categoryFilter.addEventListener("change", aplicarFiltros);

  window.editProduct = function(id) {
    const p = products.find(p => p.idProducto === id);
    if (!p) return;
    document.getElementById("productId").value = p.idProducto;
    document.getElementById("productName").value = p.nombre;
    document.getElementById("productCategory").value = p.idCategoria;
    document.getElementById("productDescription").value = p.descripcion || "";
    document.getElementById("productPrice").value = p.precio;
    document.getElementById("productStock").value = p.stockActual;
    document.getElementById("productImage").value = p.imagenPrincipal || "";
    document.getElementById("productFechaCaducidad").value = p.fechaVencimiento || "";
    document.getElementById("productRequiereReceta").value = p.requiereReceta ? "true" : "false";
    document.getElementById("productEsControlado").value = p.esControlado ? "true" : "false";
    document.getElementById("productLaboratorio").value = p.laboratorio || "";
    document.getElementById("productPrincipioActivo").value = p.principioActivo || "";
    document.getElementById("productConcentracion").value = p.concentracion || "";
    document.getElementById("productFormaFarmaceutica").value = p.formaFarmaceutica || "";
    productModal.show();
  };

  window.deleteProduct = function(id) {
    if (confirm("¿Eliminar este producto?")) {
      fetch(`http://localhost:8081/api/productos/${id}`, { method: "DELETE" })
        .then(response => {
          if (!response.ok) throw new Error("Error al eliminar producto");
          products = products.filter(p => p.idProducto !== id);
          aplicarFiltros();
        })
        .catch(error => {
          console.error("Error eliminando producto:", error);
          alert("Error al eliminar producto: " + error.message);
        });
    }
  };

  productForm.onsubmit = function(e) {
    e.preventDefault();
    const id = document.getElementById("productId").value;
    const product = {
      nombre: document.getElementById("productName").value,
      idCategoria: parseInt(document.getElementById("productCategory").value),
      descripcion: document.getElementById("productDescription").value,
      precio: parseFloat(document.getElementById("productPrice").value),
      stockActual: parseInt(document.getElementById("productStock").value),
      imagenPrincipal: document.getElementById("productImage").value,
      fechaVencimiento: document.getElementById("productFechaCaducidad").value || null,
      requiereReceta: document.getElementById("productRequiereReceta").value === "true",
      esControlado: document.getElementById("productEsControlado").value === "true",
      laboratorio: document.getElementById("productLaboratorio").value || null,
      principioActivo: document.getElementById("productPrincipioActivo").value || null,
      concentracion: document.getElementById("productConcentracion").value || null,
      formaFarmaceutica: document.getElementById("productFormaFarmaceutica").value || null,
      estado: true
    };

    const url = id ? `http://localhost:8081/api/productos/${id}` : "http://localhost:8081/api/productos";
    const method = id ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    })
      .then(response => {
        if (!response.ok) throw new Error("Error al guardar producto");
        return response.json();
      })
      .then(data => {
        if (id) {
          const idx = products.findIndex(p => p.idProducto == id);
          if (idx !== -1) products[idx] = data;
        } else {
          products.push(data);
        }
        aplicarFiltros();
        productModal.hide();
        productForm.reset();
        document.getElementById("productId").value = "";
      })
      .catch(error => {
        console.error("Error guardando producto:", error);
        alert("Error al guardar producto: " + error.message);
      });
  };

  document.getElementById("productModal").addEventListener("show.bs.modal", function () {
    productForm.reset();
    document.getElementById("productId").value = "";
    document.getElementById("productFechaCaducidad").value = "";
  });

  loadCategories();
  loadProducts();
});