// assets/js/admin-productos.js
document.addEventListener("DOMContentLoaded", async function () {
  let productos = [];
  let isSaving = false; // Flag global para evitar doble envío

  // 1️⃣ Verificar autenticación
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  if (!user || user.role !== "admin") {
    window.location.href = "../index.html";
    return;
  }

  // 2️⃣ Logout
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../index.html";
  };

  // 3️⃣ Cargar productos
  async function cargarProductos() {
    await cargarDatosGenerico({
      url: "http://127.0.0.1:8081/api/productos",
      tablaId: "productsTable",
      columnas: 9, // mismo número de columnas
      callbackMostrarDatos: mostrarProductos,
    });
  }
  function mostrarProductos(data) {
    productos = data; // para mantener sincronizado el array global

    const tbody = document.querySelector("#productsTable tbody");
    tbody.innerHTML = "";

    if (!productos.length) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">No hay productos disponibles</td></tr>`;
      return;
    }

    productos.forEach((p) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
      <td>${p.idProducto}</td>
      <td>${p.nombre}</td>
      <td>${p.categoriaNombre || "Sin categoría"}</td>
      <td>${p.descripcion || ""}</td>
      <td>S/ ${(p.precio ?? 0).toFixed(2)}</td>
      <td>${p.stockActual ?? 0}</td>
      <td><img src="${
        p.imagenPrincipal || "../assets/img/no-image.png"
      }" alt="img" width="60"></td>
      <td>${
        p.fechaVencimiento
          ? new Date(p.fechaVencimiento).toLocaleDateString()
          : "-"
      }</td>
      <td>
        <button class="btn btn-warning btn-sm editar-btn" data-id="${
          p.idProducto
        }">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-danger btn-sm eliminar-btn" data-id="${
          p.idProducto
        }">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
      tbody.appendChild(fila);
    });

    configurarBotones();
  }

  // 4️⃣ Botones editar y eliminar
  function configurarBotones() {
    document.querySelectorAll(".eliminar-btn").forEach((btn) => {
      btn.onclick = async (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm("¿Seguro que deseas eliminar este producto?")) {
          await eliminarProducto(id);
          await cargarProductos();
        }
      };
    });

    document.querySelectorAll(".editar-btn").forEach((btn) => {
      btn.onclick = async (e) => {
        const id = e.currentTarget.dataset.id;
        const producto = productos.find((p) => p.idProducto == id);
        if (!producto) return;
        await mostrarModalEdicion(producto);
      };
    });
  }

  // 5️⃣ Modal agregar producto
  document.getElementById("addProductBtn").onclick = async function () {
    document.getElementById("productModalLabel").textContent =
      "Agregar Producto";
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    await cargarCategoriasSelect();
    new bootstrap.Modal(document.getElementById("productModal")).show();
  };

  // 6️⃣ Modal editar producto
  async function mostrarModalEdicion(p) {
    await cargarCategoriasSelect();

    const form = document.getElementById("productForm");
    form.reset();

    document.getElementById("productModalLabel").textContent =
      "Editar Producto";
    document.getElementById("productId").value = p.idProducto || "";
    document.getElementById("productName").value = p.nombre || "";
    document.getElementById("productCategory").value = p.idCategoria || "";
    document.getElementById("productDescription").value = p.descripcion || "";
    document.getElementById("productPrice").value = p.precio ?? "";
    document.getElementById("productStock").value = p.stockActual ?? "";
    document.getElementById("productImage").value = p.imagenPrincipal || "";
    document.getElementById("productFechaCaducidad").value = p.fechaVencimiento
      ? p.fechaVencimiento.split("T")[0]
      : "";
    document.getElementById("productRequiereReceta").value = p.requiereReceta
      ? "true"
      : "false";
    document.getElementById("productEsControlado").value = p.esControlado
      ? "true"
      : "false";
    document.getElementById("productLaboratorio").value = p.laboratorio || "";
    document.getElementById("productPrincipioActivo").value =
      p.principioActivo || "";
    document.getElementById("productConcentracion").value =
      p.concentracion || "";
    document.getElementById("productFormaFarmaceutica").value =
      p.formaFarmaceutica || "";

    new bootstrap.Modal(document.getElementById("productModal")).show();
  }

  // 7️⃣ Guardar producto — Listener registrado UNA SOLA VEZ
  const form = document.getElementById("productForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSaving) return;
    isSaving = true;

    const id = document.getElementById("productId").value.trim();

    const producto = {
      nombre: document.getElementById("productName").value.trim(),
      idCategoria: parseInt(document.getElementById("productCategory").value),
      descripcion: document.getElementById("productDescription").value.trim(),
      precio: parseFloat(document.getElementById("productPrice").value),
      stockActual: parseInt(document.getElementById("productStock").value),
      imagenPrincipal: document.getElementById("productImage").value.trim(),
      fechaVencimiento:
        document.getElementById("productFechaCaducidad").value || null,
      requiereReceta:
        document.getElementById("productRequiereReceta").value === "true",
      esControlado:
        document.getElementById("productEsControlado").value === "true",
      laboratorio: document.getElementById("productLaboratorio").value.trim(),
      principioActivo: document
        .getElementById("productPrincipioActivo")
        .value.trim(),
      concentracion: document
        .getElementById("productConcentracion")
        .value.trim(),
      formaFarmaceutica: document
        .getElementById("productFormaFarmaceutica")
        .value.trim(),
      estado: true,
    };

    try {
      const url = id
        ? `http://127.0.0.1:8081/api/productos/${id}`
        : "http://127.0.0.1:8081/api/productos";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });

      if (!response.ok) throw new Error("Error al guardar producto");

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("productModal")
      );
      if (modal) modal.hide();

      await cargarProductos();
    } catch (error) {
      console.error("❌ Error al guardar producto:", error);
      alert("Error al guardar el producto.");
    } finally {
      isSaving = false;
    }
  });

  // 8️⃣ Eliminar producto
  async function eliminarProducto(id) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8081/api/productos/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Error al eliminar producto");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  }

  // 9️⃣ Cargar categorías
  async function cargarCategoriasSelect() {
    const select = document.getElementById("productCategory");
    select.innerHTML = `<option value="">Selecciona una categoría</option>`;
    try {
      const response = await fetch("http://127.0.0.1:8081/api/categorias");
      const categorias = await response.json();
      categorias.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat.idCategoria;
        opt.textContent = cat.nombre;
        select.appendChild(opt);
      });
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  }

  // 🔄 Inicializar tabla
  await cargarProductos();
});

// 🧼 Limpieza de backdrop y scroll al cerrar modal
document.addEventListener("hidden.bs.modal", function () {
  document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
});
