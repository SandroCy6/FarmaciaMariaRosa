document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticación (misma lógica que otras páginas admin)
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!user || user.role !== 'admin') {
    window.location.href = '../index.html';
    return;
  }

  const API_BASE = 'http://127.0.0.1:8081/api';
  const categoriesTable = document.getElementById('categoriesTable');
  const categoriesCount = document.getElementById('categoriesCount');
  const searchInput = document.getElementById('searchCategoriaInput');
  const btnAdd = document.getElementById('btnAddCategoria');

  const categoriaModalEl = document.getElementById('categoriaModal');
  const categoriaModal = new bootstrap.Modal(categoriaModalEl);
  const categoriaForm = document.getElementById('categoriaForm');

  let categorias = [];

  // Cargar al inicio
  cargarCategorias();

  // Listeners
  searchInput.addEventListener('input', filtrarCategorias);
  btnAdd.addEventListener('click', () => abrirModalNuevo());
  categoriaForm.addEventListener('submit', guardarCategoria);

 async function cargarCategorias() {
  await cargarDatosGenerico({
    url: `${API_BASE}/categorias`,
    tablaId: "categoriesTable",
    columnas: 6, // el número de columnas reales en la tabla
    callbackMostrarDatos: (data) => {
      categorias = data;
      mostrarCategorias(categorias);
    },
    callbackEstadisticas: (data) => {
      categoriesCount.textContent = String(data.length);
    }
  });
}


  function mostrarCategorias(list) {
    const tbody = categoriesTable.querySelector('tbody');
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      categoriesCount.textContent = '0';
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="6" class="text-center py-4">No hay categorías disponibles</td>`;
      tbody.appendChild(tr);
      return;
    }

    categoriesCount.textContent = String(list.length);

    list.forEach(cat => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cat.idCategoria}</td>
        <td>${escapeHtml(cat.nombre)}</td>
        <td>${escapeHtml(cat.descripcion || '')}</td>
        <td>${cat.estado ? '<span class="badge bg-success">Activo</span>' : '<span class="badge bg-secondary">Inactivo</span>'}</td>
        <td>${cat.orden != null ? cat.orden : ''}</td>
        <td>
          <button class="btn btn-warning btn-sm editar-btn" data-id="${cat.idCategoria}" data-action="edit"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-danger btn-sm eliminar-btn" data-id="${cat.idCategoria}" data-action="delete"><i class="bi bi-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Delegación de eventos para botones
    tbody.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        if (action === 'edit') abrirModalEditar(Number(id));
        if (action === 'delete') eliminarCategoria(Number(id));
      });
    });
  }

  function filtrarCategorias() {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) return mostrarCategorias(categorias);
    const filtered = categorias.filter(c => (c.nombre || '').toLowerCase().includes(q));
    mostrarCategorias(filtered);
  }

  function abrirModalNuevo() {
    document.getElementById('categoriaId').value = '';
    document.getElementById('categoriaNombre').value = '';
    document.getElementById('categoriaDescripcion').value = '';
    document.getElementById('categoriaImagen').value = '';
    document.getElementById('categoriaEstado').value = 'true';
    document.getElementById('categoriaOrden').value = '';
    document.getElementById('categoriaModalLabel').textContent = 'Agregar Categoría';
    categoriaModal.show();
  }

  function abrirModalEditar(id) {
    const cat = categorias.find(c => c.idCategoria === id);
    if (!cat) return alert('Categoría no encontrada');
    document.getElementById('categoriaId').value = cat.idCategoria;
    document.getElementById('categoriaNombre').value = cat.nombre || '';
    document.getElementById('categoriaDescripcion').value = cat.descripcion || '';
    document.getElementById('categoriaImagen').value = cat.imagenUrl || '';
    document.getElementById('categoriaEstado').value = String(cat.estado === true);
    document.getElementById('categoriaOrden').value = cat.orden != null ? cat.orden : '';
    document.getElementById('categoriaModalLabel').textContent = 'Editar Categoría';
    categoriaModal.show();
  }

  async function guardarCategoria(e) {
    e.preventDefault();
    const id = document.getElementById('categoriaId').value;
    const payload = {
      nombre: document.getElementById('categoriaNombre').value.trim(),
      descripcion: document.getElementById('categoriaDescripcion').value.trim() || null,
      imagenUrl: document.getElementById('categoriaImagen').value.trim() || null,
      estado: document.getElementById('categoriaEstado').value === 'true',
      orden: document.getElementById('categoriaOrden').value ? Number(document.getElementById('categoriaOrden').value) : null
    };

    if (!payload.nombre) return alert('El nombre es requerido');

    try {
      let res;
      if (id) {
        res = await fetch(`${API_BASE}/categorias/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE}/categorias`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error((err && err.message) ? err.message : 'Error en la operación');
      }
      await cargarCategorias();
      categoriaModal.hide();
    } catch (err) {
      console.error(err);
      alert('Error guardando la categoría: ' + err.message);
    }
  }

  async function eliminarCategoria(id) {
    if (!confirm('¿Eliminar esta categoría? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`${API_BASE}/categorias/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar la categoría');
      await cargarCategorias();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar la categoría');
    }
  }

  // pequeño helper para evitar inyección al insertar texto
  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

});
