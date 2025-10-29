// Variables globales
const API_URL = 'http://localhost:8081/api/lotes';
const API_PRODUCTOS = 'http://localhost:8081/api/productos';
let lotesData = [];
let currentLoteId = null;
let loteModal = null;

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando...');
    
    loteModal = new bootstrap.Modal(document.getElementById('loteModal'));
    
    loadProductos();
    loadLotes();
    setupEventListeners();
    setupSearch();
});

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    const btnAddLote = document.getElementById('btnAddLote');
    const loteForm = document.getElementById('loteForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const lotesTable = document.getElementById('lotesTable');
    
    if (btnAddLote) {
        btnAddLote.addEventListener('click', openAddLoteModal);
    }
    if (loteForm) {
        loteForm.addEventListener('submit', handleFormSubmit);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Event delegation para botones de tabla
    if (lotesTable) {
        lotesTable.addEventListener('click', function(e) {
            const btnEditar = e.target.closest('.btn-editar');
            const btnEliminar = e.target.closest('.btn-eliminar');
            
            if (btnEditar) {
                const fila = btnEditar.closest('tr');
                const idLote = fila.getAttribute('data-lote-id');
                console.log('ID extraído para editar desde data-lote-id:', idLote, 'tipo:', typeof idLote);
                editarLote(idLote);
            }
            
            if (btnEliminar) {
                const fila = btnEliminar.closest('tr');
                const idLote = fila.getAttribute('data-lote-id');
                console.log('ID extraído para eliminar desde data-lote-id:', idLote, 'tipo:', typeof idLote);
                eliminarLote(idLote);
            }
        });
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchLoteInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterLotes(searchTerm);
        });
    }
}

// ==================== CARGAR LOTES ====================
async function loadLotes() {
    try {
        console.log('Cargando lotes desde:', API_URL);
        
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        lotesData = await response.json();
        console.log('Lotes cargados:', lotesData);
        
        renderLotesTable(lotesData);
        updateLotesCount();
    } catch (error) {
        console.error('Error al cargar lotes:', error);
        showAlert('Error al cargar los lotes: ' + error.message, 'danger');
        renderLotesTable([]);
    }
}

// ==================== CARGAR PRODUCTOS ====================
async function loadProductos() {
    try {
        console.log('Cargando productos desde:', API_PRODUCTOS);
        
        const response = await fetch(API_PRODUCTOS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const productos = await response.json();
        console.log('Productos cargados:', productos);
        populateProductoSelect(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showAlert('Error al cargar los productos', 'danger');
    }
}

// ==================== RENDERIZAR TABLA ====================
function renderLotesTable(lotes) {
    const tbody = document.querySelector('#lotesTable tbody');
    
    if (!tbody) {
        console.error('No se encontró el tbody de la tabla');
        return;
    }
    
    tbody.innerHTML = '';

    if (!lotes || lotes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No hay lotes registrados</td></tr>';
        return;
    }

    lotes.forEach(lote => {
        const row = document.createElement('tr');
        const estado = getEstadoClass(lote.estado);
        const idLote = lote.idLote;
        
        console.log('Agregando lote a tabla con ID:', idLote, 'tipo:', typeof idLote);
        
        // Guardar el ID en un atributo data de la fila
        row.setAttribute('data-lote-id', idLote);
        
        row.innerHTML = `
            <td>${idLote || 'N/A'}</td>
            <td><strong>${lote.numeroLote || 'N/A'}</strong></td>
            <td>${lote.nombreProducto || 'N/A'}</td>
            <td>${lote.stockActual || 0}/${lote.stockInicial || 0}</td>
            <td>${formatDate(lote.fechaVencimiento)}</td>
            <td>${formatDate(lote.fechaIngreso)}</td>
            <td>
                <span class="badge ${estado}">
                    ${lote.estado || 'N/A'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-warning me-1 btn-editar" type="button">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger btn-eliminar" type="button">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ==================== LLENAR SELECT DE PRODUCTOS ====================
function populateProductoSelect(productos) {
    const select = document.getElementById('loteProducto');
    if (!select) {
        console.error('No se encontró select loteProducto');
        return;
    }
    
    select.innerHTML = '<option value="">Selecciona un producto...</option>';
    
    if (!Array.isArray(productos)) {
        console.error('Productos no es un array:', productos);
        return;
    }
    
    productos.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.idProducto;
        option.textContent = producto.nombre;
        select.appendChild(option);
    });
}

// ==================== ABRIR MODAL AGREGAR ====================
function openAddLoteModal() {
    console.log('Abriendo modal para agregar lote');
    currentLoteId = null;
    
    const form = document.getElementById('loteForm');
    if (form) {
        form.reset();
    }
    
    document.getElementById('loteModalLabel').textContent = 'Agregar Lote';
    document.getElementById('loteId').value = '';
    
    loteModal.show();
}

// ==================== EDITAR LOTE ====================
function editarLote(idLote) {
    idLote = parseInt(idLote);
    console.log('Editando lote con ID:', idLote);
    
    fetch(`${API_URL}/${idLote}`)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar lote');
            return response.json();
        })
        .then(lote => {
            console.log('Lote obtenido:', lote);
            
            document.getElementById('loteId').value = lote.idLote || '';
            document.getElementById('loteNumero').value = lote.numeroLote || '';
            document.getElementById('loteProducto').value = lote.idProducto || '';
            document.getElementById('loteCantidad').value = lote.stockActual || '';
            document.getElementById('loteFechaFabricacion').value = lote.fechaIngreso || '';
            document.getElementById('loteFechaVencimiento').value = lote.fechaVencimiento || '';
            document.getElementById('loteEstado').value = lote.estado || 'ACTIVO';
            
            document.getElementById('loteModalLabel').textContent = 'Editar Lote';
            currentLoteId = idLote;
            
            loteModal.show();
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Error al cargar el lote', 'danger');
        });
}

// ==================== ELIMINAR LOTE ====================
function eliminarLote(idLote) {
    idLote = parseInt(idLote);
    console.log('Eliminando lote con ID:', idLote);
    
    if (!confirm('¿Estás seguro de que deseas eliminar este lote?')) {
        return;
    }
    
    fetch(`${API_URL}/${idLote}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) throw new Error('Error al eliminar');
            console.log('Lote eliminado');
            loadLotes();
            showAlert('Lote eliminado exitosamente', 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Error al eliminar el lote', 'danger');
        });
}

// ==================== MANEJAR ENVÍO DE FORMULARIO ====================
function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Enviando formulario...');

    const idProducto = document.getElementById('loteProducto').value;
    const numeroLote = document.getElementById('loteNumero').value;
    const fechaVencimiento = document.getElementById('loteFechaVencimiento').value;
    const stockActual = parseInt(document.getElementById('loteCantidad').value);
    const fechaIngreso = document.getElementById('loteFechaFabricacion').value;
    const estado = document.getElementById('loteEstado').value;

    if (!idProducto || !numeroLote || !fechaVencimiento || !stockActual || !fechaIngreso) {
        showAlert('Por favor completa todos los campos requeridos', 'warning');
        return;
    }

    const formData = {
        idProducto: parseInt(idProducto),
        numeroLote: numeroLote,
        fechaVencimiento: fechaVencimiento,
        stockInicial: stockActual,
        stockActual: stockActual,
        fechaIngreso: fechaIngreso,
        estado: estado,
        observaciones: ''
    };

    console.log('Datos a enviar:', formData);

    if (currentLoteId) {
        // Actualizar
        fetch(`${API_URL}/${currentLoteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al actualizar');
                return response.json();
            })
            .then(data => {
                console.log('Lote actualizado:', data);
                loteModal.hide();
                loadLotes();
                showAlert('Lote actualizado exitosamente', 'success');
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Error al actualizar el lote', 'danger');
            });
    } else {
        // Crear
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al crear');
                return response.json();
            })
            .then(data => {
                console.log('Lote creado:', data);
                loteModal.hide();
                loadLotes();
                showAlert('Lote creado exitosamente', 'success');
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('Error al crear el lote', 'danger');
            });
    }
}

// ==================== FILTRAR LOTES ====================
function filterLotes(searchTerm) {
    const filtered = lotesData.filter(lote => 
        (lote.numeroLote && lote.numeroLote.toLowerCase().includes(searchTerm)) ||
        (lote.producto && lote.producto.nombre && lote.producto.nombre.toLowerCase().includes(searchTerm))
    );
    renderLotesTable(filtered);
}

// ==================== ACTUALIZAR CONTADOR ====================
function updateLotesCount() {
    const countBadge = document.getElementById('lotesCount');
    if (countBadge) {
        countBadge.textContent = lotesData.length;
    }
}

// ==================== UTILIDADES ====================
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (error) {
        return 'N/A';
    }
}

function getEstadoClass(estado) {
    const estadoMap = {
        'ACTIVO': 'bg-success',
        'VENCIDO': 'bg-danger',
        'AGOTADO': 'bg-warning',
        'INACTIVO': 'bg-secondary'
    };
    return estadoMap[estado] || 'bg-secondary';
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '80px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

function handleLogout() {
    localStorage.removeItem('authToken');
    window.location.href = '../index.html';
}