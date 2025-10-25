// assets/js/admin-productos.js
document.addEventListener("DOMContentLoaded", async function () {
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

  // 3️⃣ Cargar productos desde el backend
  async function cargarProductos() {
    try {
      const response = await fetch("http://127.0.0.1:8081/api/productos");
      if (!response.ok) throw new Error("Error al obtener productos");
      const productos = await response.json();

      const tbody = document.querySelector("#productsTable tbody");
      tbody.innerHTML = "";

      if (!productos.length) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">No hay productos disponibles</td></tr>`;
        return;
      }

      productos.forEach(p => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${p.idProducto}</td>
          <td>${p.nombre}</td>
          <td>${p.categoria?.nombre || "Sin categoría"}</td>
          <td>${p.descripcion || ""}</td>
          <td>S/ ${p.precio?.toFixed(2) || "0.00"}</td>
          <td>${p.stock}</td>
          <td><img src="${p.imagenUrl || "../assets/img/no-image.png"}" alt="img" width="60"></td>
          <td>${p.fechaCaducidad ? new Date(p.fechaCaducidad).toLocaleDateString() : "-"}</td>
          <td>
            <button class="btn btn-warning btn-sm editar-btn" data-id="${p.idProducto}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm eliminar-btn" data-id="${p.idProducto}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        `;
        tbody.appendChild(fila);
      });

      configurarBotones();
    } catch (error) {
      console.error("❌ Error cargando productos:", error);
      const tbody = document.querySelector("#productsTable tbody");
      tbody.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Error al cargar productos</td></tr>`;
    }
  }

  // 4️⃣ Configurar botones de acción
  function configurarBotones() {
    document.querySelectorAll(".eliminar-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm("¿Seguro que deseas eliminar este producto?")) {
          await eliminarProducto(id);
          cargarProductos();
        }
      });
    });
  }

  async function eliminarProducto(id) {
    try {
      const response = await fetch(`http://127.0.0.1:8081/api/productos/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Error al eliminar producto");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  }

  // 🔄 Llamar al cargar
  await cargarProductos();
});
