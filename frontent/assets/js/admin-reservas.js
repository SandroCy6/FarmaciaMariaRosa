document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user || user.role !== 'admin') {
        window.location.href = '../index.html';
        return;
    }
    
    // Token simulado para las llamadas a la API
    const token = 'dummy-token';

    // Referencias a elementos DOM
    const reservasTable = document.getElementById('reservasTable');
    const searchClienteInput = document.getElementById('searchClienteInput');
    const statusFilter = document.getElementById('statusFilter');
    const btnCompletarReserva = document.getElementById('btnCompletarReserva');
    const btnCancelarReserva = document.getElementById('btnCancelarReserva');

    let reservas = [];
    let reservaActual = null;

    // Cargar reservas al iniciar
    cargarReservas();

    // Event Listeners
    searchClienteInput.addEventListener('input', filtrarReservas);
    statusFilter.addEventListener('change', filtrarReservas);
    btnCompletarReserva.addEventListener('click', completarReserva);
    btnCancelarReserva.addEventListener('click', cancelarReserva);

    // Funciones
    function cargarReservas() {
    fetch('http://127.0.0.1:8081/api/reservas', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar reservas');
            return response.json();
        })
        .then(data => {
            reservas = data;
            mostrarReservas(reservas);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar las reservas');
        });
    }

    function mostrarReservas(reservasArray) {
        const tbody = reservasTable.querySelector('tbody');
        tbody.innerHTML = '';

        if (!reservasArray || reservasArray.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="7" class="text-center py-4">
                    <div class="d-flex flex-column align-items-center">
                        <i class="bi bi-inbox text-muted" style="font-size: 3rem;"></i>
                        <p class="h5 mt-3 mb-0 text-muted">No hay reservas disponibles</p>
                        <p class="text-muted">Las reservas realizadas por los clientes aparecerán aquí</p>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
            return;
        }

        reservasArray.forEach(reserva => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${reserva.numeroReserva || reserva.idReserva}</td>
                <td>${reserva.cliente.nombre}</td>
                <td>${new Date(reserva.fechaReserva).toLocaleString()}</td>
                <td>
                    <span class="badge bg-${getEstadoColor(reserva.estado)}">${reserva.estado}</span>
                </td>
                <td>S/ ${reserva.total.toFixed(2)}</td>
                <td>${reserva.detalles.length} productos</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verDetalles(${reserva.idReserva})">
                        <i class="bi bi-eye"></i> Ver
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function getEstadoColor(estado) {
        switch (estado.toLowerCase()) {
            case 'pendiente': return 'warning';
            case 'completada': return 'success';
            case 'cancelada': return 'danger';
            default: return 'secondary';
        }
    }

    window.verDetalles = (reservaId) => {
        reservaActual = reservas.find(r => r.idReserva === reservaId);
        if (!reservaActual) return;

        // Actualizar información en el modal
        document.getElementById('modalClienteNombre').textContent = `Cliente: ${reservaActual.cliente.nombre}`;
        document.getElementById('modalClienteEmail').textContent = `Email: ${reservaActual.cliente.email}`;
        document.getElementById('modalClienteTelefono').textContent = `Teléfono: ${reservaActual.cliente.telefono || 'No especificado'}`;
        
        document.getElementById('modalReservaId').textContent = `ID Reserva: ${reservaActual.numeroReserva || reservaActual.idReserva}`;
        document.getElementById('modalReservaFecha').textContent = `Fecha: ${new Date(reservaActual.fechaReserva).toLocaleString()}`;
        document.getElementById('modalReservaEstado').textContent = `Estado: ${reservaActual.estado}`;
        
        if (reservaActual.fechaLimiteRetiro) {
            document.getElementById('modalReservaFecha').textContent += `\nLímite de retiro: ${new Date(reservaActual.fechaLimiteRetiro).toLocaleString()}`;
        }
        if (reservaActual.fechaEntrega) {
            document.getElementById('modalReservaFecha').textContent += `\nEntregada: ${new Date(reservaActual.fechaEntrega).toLocaleString()}`;
        }

        // Mostrar productos
        const productosTableBody = document.getElementById('modalProductosTable');
        productosTableBody.innerHTML = '';

        reservaActual.detalles.forEach(detalle => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${detalle.producto.nombre}</td>
                <td>${detalle.cantidad}</td>
                <td>S/ ${detalle.precioUnitario.toFixed(2)}</td>
                <td>S/ ${(detalle.cantidad * detalle.precioUnitario).toFixed(2)}</td>
            `;
            productosTableBody.appendChild(tr);
        });

        document.getElementById('modalTotal').textContent = `S/ ${reservaActual.total.toFixed(2)}`;

        // Habilitar/deshabilitar botones según el estado
        btnCompletarReserva.style.display = reservaActual.estado === 'PENDIENTE' ? 'block' : 'none';
        btnCancelarReserva.style.display = reservaActual.estado === 'PENDIENTE' ? 'block' : 'none';

        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('reservaModal'));
        modal.show();
    };

    function filtrarReservas() {
        const searchTerm = searchClienteInput.value.toLowerCase();
        const statusValue = statusFilter.value.toLowerCase();

        if (!reservas || reservas.length === 0) {
            mostrarReservas([]);
            return;
        }

        const reservasFiltradas = reservas.filter(reserva => {
            const matchesSearch = reserva.cliente.nombre.toLowerCase().includes(searchTerm);
            const matchesStatus = statusValue === 'all' || reserva.estado.toLowerCase() === statusValue;
            return matchesSearch && matchesStatus;
        });

        mostrarReservas(reservasFiltradas);
    }

    function completarReserva() {
        if (!reservaActual) return;

    fetch(`http://127.0.0.1:8081/api/reservas/${reservaActual.idReserva}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...reservaActual,
                estado: 'ENTREGADA',
                fechaEntrega: new Date().toISOString(),
                detalles: reservaActual.detalles.map(d => ({
                    idReserva: reservaActual.idReserva,
                    idProducto: d.producto.idProducto,
                    cantidad: d.cantidad,
                    precioUnitario: d.precioUnitario,
                    subtotal: d.precioUnitario * d.cantidad,
                    disponible: d.disponible,
                    notas: d.notas
                }))
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al completar la reserva');
            return response.json();
        })
        .then(() => {
            alert('Reserva completada exitosamente');
            cargarReservas();
            bootstrap.Modal.getInstance(document.getElementById('reservaModal')).hide();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al completar la reserva');
        });
    }

    function cancelarReserva() {
        if (!reservaActual) return;

        if (!confirm('¿Está seguro de que desea cancelar esta reserva?')) {
            return;
        }

    fetch(`http://127.0.0.1:8081/api/reservas/${reservaActual.idReserva}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...reservaActual,
                estado: 'CANCELADA',
                detalles: reservaActual.detalles.map(d => ({
                    idReserva: reservaActual.idReserva,
                    idProducto: d.producto.idProducto,
                    cantidad: d.cantidad,
                    precioUnitario: d.precioUnitario,
                    subtotal: d.precioUnitario * d.cantidad,
                    disponible: d.disponible,
                    notas: d.notas
                }))
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al cancelar la reserva');
            return response.json();
        })
        .then(() => {
            alert('Reserva cancelada exitosamente');
            cargarReservas();
            bootstrap.Modal.getInstance(document.getElementById('reservaModal')).hide();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cancelar la reserva');
        });
    }
});