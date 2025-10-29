document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user || user.role !== "admin") {
    window.location.href = "../index.html";
    return;
  }

  const API_BASE = "http://127.0.0.1:8081/api";
  const clientsTable = document.getElementById("clientsTable");
  const clientsCount = document.getElementById("clientsCount");
  const searchInput = document.getElementById("searchClienteInput");
  const modalDetalles = new bootstrap.Modal(
    document.getElementById("clienteDetallesModal")
  );
  const modalBody = document.getElementById("clienteDetallesBody");
  const modalEditar = new bootstrap.Modal(
    document.getElementById("editarClienteModal")
  );
  const formEditar = document.getElementById("editarClienteForm");

  let clientes = [];

  cargarClientes();
  searchInput.addEventListener("input", filtrarClientes);

  function cargarClientes() {
    cargarDatosGenerico({
      url: `${API_BASE}/clientes`,
      tablaId: "clientsTable",
      columnas: 7,
      callbackMostrarDatos: function (data) {
        clientes = data;
        mostrarClientes(clientes);
      },
      callbackEstadisticas: function (data) {
        document.getElementById("clientsCount").textContent = data.length;
      },
    });
  }

  function mostrarClientes(list) {
    const tbody = clientsTable.querySelector("tbody");
    tbody.innerHTML = "";

    if (!list || list.length === 0) {
      clientsCount.textContent = "0";
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4">No hay clientes registrados</td></tr>`;
      return;
    }

    clientsCount.textContent = list.length;
    list.forEach((cli) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${cli.idCliente}</td>
        <td>${escapeHtml(cli.nombre)}</td>
        <td>${escapeHtml(cli.dni)}</td>
        <td>${escapeHtml(cli.email || "-")}</td>
        <td>${escapeHtml(cli.telefono || "-")}</td>
        <td>${cli.tieneCondicionCronica ? "Sí" : "No"}</td>
        <td>
          <button class="btn btn-info btn-sm me-1" onclick="verDetalles(${
            cli.idCliente
          })">
            <i class="bi bi-eye"></i> Ver
          </button>
          <button class="btn btn-warning btn-sm" onclick="editarCliente(${
            cli.idCliente
          })">
            <i class="bi bi-pencil"></i> Editar
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.verDetalles = function (id) {
    const cli = clientes.find((c) => c.idCliente === id);
    if (!cli) return;

    modalBody.innerHTML = `
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><strong>ID:</strong> ${cli.idCliente}</li>
        <li class="list-group-item"><strong>Nombre:</strong> ${escapeHtml(
          cli.nombre
        )}</li>
        <li class="list-group-item"><strong>DNI:</strong> ${escapeHtml(
          cli.dni
        )}</li>
        <li class="list-group-item"><strong>Email:</strong> ${escapeHtml(
          cli.email || "-"
        )}</li>
        <li class="list-group-item"><strong>Teléfono:</strong> ${escapeHtml(
          cli.telefono || "-"
        )}</li>
        <li class="list-group-item"><strong>Dirección:</strong> ${escapeHtml(
          cli.direccion || "-"
        )}</li>
        <li class="list-group-item"><strong>Fecha de nacimiento:</strong> ${
          cli.fechaNacimiento || "-"
        }</li>
        <li class="list-group-item"><strong>Condición crónica:</strong> ${
          cli.tieneCondicionCronica ? "Sí" : "No"
        }</li>
        <li class="list-group-item"><strong>Notas especiales:</strong> ${escapeHtml(
          cli.notasEspeciales || "Ninguna"
        )}</li>
        <li class="list-group-item"><strong>Acepta notificaciones:</strong> ${
          cli.aceptaNotificaciones ? "Sí" : "No"
        }</li>
      </ul>
    `;
    modalDetalles.show();
  };

  window.editarCliente = function (id) {
    const cli = clientes.find((c) => c.idCliente === id);
    if (!cli) return;

    document.getElementById("editIdCliente").value = cli.idCliente;
    document.getElementById("editNombre").value = cli.nombre;
    document.getElementById("editDni").value = cli.dni;
    document.getElementById("editEmail").value = cli.email || "";
    document.getElementById("editTelefono").value = cli.telefono || "";
    document.getElementById("editDireccion").value = cli.direccion || "";
    document.getElementById("editCondicionCronica").checked =
      cli.tieneCondicionCronica;
    document.getElementById("editAceptaNotificaciones").checked =
      cli.aceptaNotificaciones;
    modalEditar.show();
  };

  formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("editIdCliente").value;
    const data = {
      nombre: document.getElementById("editNombre").value,
      dni: document.getElementById("editDni").value,
      email: document.getElementById("editEmail").value,
      telefono: document.getElementById("editTelefono").value,
      direccion: document.getElementById("editDireccion").value,
      tieneCondicionCronica: document.getElementById("editCondicionCronica")
        .checked,
      aceptaNotificaciones: document.getElementById("editAceptaNotificaciones")
        .checked,
    };

    try {
      const res = await fetch(`${API_BASE}/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      modalEditar.hide();
      cargarClientes();
    } catch (err) {
      console.error("Detalles del error al actualizar:", err);
      alert("No se pudo actualizar el cliente.\n" + err.message);
    }
  });

  function filtrarClientes() {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) return mostrarClientes(clientes);
    const filtered = clientes.filter(
      (c) =>
        (c.nombre || "").toLowerCase().includes(q) ||
        (c.dni || "").toLowerCase().includes(q)
    );
    mostrarClientes(filtered);
  }

  function escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
