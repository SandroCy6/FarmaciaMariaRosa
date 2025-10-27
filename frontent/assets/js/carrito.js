class Carrito {
    constructor() {
        this.items = JSON.parse(localStorage.getItem("carrito")) || [];
        this.sidebar = null;
        this.clienteModal = null;
        this.init();
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.sidebar = this.crearSidebarCarrito();
            document.body.appendChild(this.sidebar);

            // Crear modal de cliente dinámicamente solo si no existe
            if (!document.getElementById('createClienteModal')) {
                this.clienteModal = this.crearClienteModal();
                document.body.appendChild(this.clienteModal);
            } else {
                this.clienteModal = document.getElementById('createClienteModal');
            }

            // Crear backdrop para oscurecer la página cuando el carrito esté abierto
            this.backdrop = document.createElement('div');
            this.backdrop.className = 'cart-backdrop';
            document.body.appendChild(this.backdrop);
            this.backdrop.addEventListener('click', () => this.toggleSidebar());

            const btnCarrito = document.querySelector("#btnCarrito");
            if (btnCarrito) {
                btnCarrito.addEventListener("click", () => this.toggleSidebar());
            }

            this.actualizarBadge();
            this.renderizarCarrito();
        });
    }

    crearClienteModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'createClienteModal';
        modal.tabIndex = -1;
        modal.setAttribute('aria-labelledby', 'createClienteModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createClienteModalLabel">Completar Datos de Cliente</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="createClienteForm">
                            <div class="mb-3">
                                <label for="createClienteEmail" class="form-label">Correo electrónico</label>
                                <input type="email" class="form-control" id="createClienteEmail" readonly autocomplete="email">
                            </div>
                            <div class="mb-3">
                                <label for="createClienteNombre" class="form-label">Nombre *</label>
                                <input type="text" class="form-control" id="createClienteNombre" required autocomplete="name">
                            </div>
                            <div class="mb-3">
                                <label for="createClienteDni" class="form-label">DNI (8 dígitos) *</label>
                                <input type="text" class="form-control" id="createClienteDni" required autocomplete="off">
                            </div>
                            <div class="mb-3">
                                <label for="createClienteTelefono" class="form-label">Teléfono</label>
                                <input type="text" class="form-control" id="createClienteTelefono" autocomplete="tel">
                            </div>
                            <div class="mb-3">
                                <label for="createClienteDireccion" class="form-label">Dirección</label>
                                <input type="text" class="form-control" id="createClienteDireccion" autocomplete="street-address">
                            </div>
                            <button type="submit" class="btn btn-primary w-100 mt-2">Guardar</button>
                            <button type="button" class="btn btn-secondary w-100 mt-2" id="createClienteCancel">Cancelar</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    crearSidebarCarrito() {
        const div = document.createElement("div");
        div.id = "sidebarCarrito";
        div.className = "cart-sidebar";
        div.innerHTML = `
            <div class="cart-header">
                <h3>Tu Carrito</h3>
                <button class="cart-close">✖</button>
            </div>
            <div id="listaCarrito" class="cart-items"></div>
            <div class="cart-total">Total: S/ 0.00</div>
            <div class="cart-actions">
                <button class="cart-button checkout-btn">Realizar Reserva</button>
                <button class="cart-button clear-cart-btn">Vaciar Carrito</button>
            </div>
        `;

        div.querySelector(".cart-close").addEventListener("click", () => this.toggleSidebar());
        div.querySelector(".checkout-btn").addEventListener("click", () => this.realizarReserva());
        div.querySelector(".clear-cart-btn").addEventListener("click", () => this.vaciarCarrito());

        return div;
    }

    toggleSidebar() {
        const opening = !this.sidebar.classList.contains('active');
        this.sidebar.classList.toggle("active");
        if (this.backdrop) this.backdrop.classList.toggle('active', opening);
    }

    renderizarCarrito() {
        const contenedor = document.getElementById("listaCarrito");
        const totalElement = this.sidebar.querySelector(".cart-total");
        contenedor.innerHTML = "";

        if (this.items.length === 0) {
            contenedor.innerHTML = "<div class='cart-empty'>El carrito está vacío</div>";
            totalElement.textContent = "Total: S/ 0.00";
            return;
        }

        let total = 0;
        this.items.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const imagen = item.imagen || item.imagenPrincipal || 'https://via.placeholder.com/80';

            const itemHTML = `
                <div class="cart-item d-flex align-items-start" data-index="${index}">
                    <img src="${imagen}" alt="${item.nombre}" />
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.nombre}</div>
                        <div class="cart-item-price">S/ ${item.precio.toFixed(2)}</div>
                        <div class="mt-2 d-flex align-items-center">
                            <button class="btn btn-sm details-btn" data-index="${index}">Más detalles</button>
                            <button class="remove-btn ms-2" data-index="${index}" title="Eliminar del carrito"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                    <div class="cart-item-quantity ms-auto">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span>${item.cantidad}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
            `;
            contenedor.insertAdjacentHTML('beforeend', itemHTML);
        });

        totalElement.textContent = `Total: S/ ${total.toFixed(2)}`;

        contenedor.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const change = e.target.classList.contains('plus') ? 1 : -1;
                this.actualizarCantidad(index, change);
            });
        });

        contenedor.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const item = this.items[index];
                if (!item) return;
                this.showProductModal(item, true);
            });
        });

        contenedor.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.eliminarPorIndex(index);
            });
        });
    }

    actualizarCantidad(index, change) {
        const item = this.items[index];
        const nuevaCantidad = item.cantidad + change;

        if (nuevaCantidad > 0) {
            item.cantidad = nuevaCantidad;
        } else {
            this.items.splice(index, 1);
        }

        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarBadge();
    }

    eliminarPorIndex(index) {
        if (index < 0 || index >= this.items.length) return;
        const confirmado = window.confirm("¿Estás seguro que deseas eliminar este producto del carrito?");
        if (!confirmado) return;

        this.items.splice(index, 1);
        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarBadge();
    }

    agregarProducto(producto, toggle = true) {
        if (producto.requiereReceta) {
            const notas = prompt('Este producto requiere receta médica. Por favor, indique detalles:');
            if (!notas) return;
            producto.notas = notas;
        }

        const productoExistente = this.items.find(item => item.idProducto === producto.idProducto);

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            this.items.push({
                ...producto,
                cantidad: 1
            });
        }

        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarBadge();
        if (toggle) this.toggleSidebar();
    }

    actualizarBadge() {
        const badge = document.querySelector(".cart-badge");
        if (badge) {
            const totalItems = this.items.reduce((sum, item) => sum + item.cantidad, 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? "block" : "none";
        }
    }

    guardarCarrito() {
        localStorage.setItem("carrito", JSON.stringify(this.items));
    }

    vaciarCarrito() {
        const confirmado = window.confirm("¿Estás seguro?");
        if (!confirmado) return;

        this.items = [];
        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarBadge();
    }

    showProductModal(product, fromCart = false) {
        const modalEl = document.getElementById('productModal');
        if (!modalEl) return;

        modalEl.setAttribute('inert', '');

        document.getElementById('modalImagen').src = product.imagen || product.imagenPrincipal || '';
        document.getElementById('modalNombre').textContent = product.nombre || '';
        document.getElementById('modalDescripcion').textContent = product.descripcion || '';
        document.getElementById('modalCategoria').textContent = product.categoria || product.categoriaNombre || '';
        document.getElementById('modalStock').textContent = product.stock || product.stockActual || 0;
        document.getElementById('modalPrecio').textContent = `S/ ${Number(product.precio || 0).toFixed(2)}`;
        document.getElementById('modalRating').textContent = product.rating ? `⭐ ${product.rating}` : '';

        const addBtn = document.getElementById('modalAddToCart');
        if (addBtn) {
            addBtn.style.display = '';
            addBtn.onclick = () => {
                this.agregarProducto(product, false);
                const mb = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                mb.hide();
            };
        }

        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
        modalEl.removeAttribute('inert');
    }

    async realizarReserva() {
        if (this.items.length === 0) {
            alert("Tu carrito está vacío");
            return;
        }
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        if (!loggedInUser) {
            const modal = new bootstrap.Modal(document.getElementById('loginModal'));
            modal.show();
            return;
        }

        const token = 'dummy-token';

        const findClientIdByEmail = async (email) => {
            try {
                console.log(`Buscando cliente por email: ${email}`);
                const res = await fetch('http://127.0.0.1:8081/api/clientes', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!res.ok) {
                    console.error(`Error ${res.status} al buscar clientes por email`);
                    return null;
                }
                const clientes = await res.json();
                const found = clientes.find(c => (c.email || c.mail || '').toLowerCase() === (email || '').toLowerCase());
                if (found) {
                    console.log(`Cliente encontrado por email: ${found.idCliente}`);
                }
                return found ? (found.idCliente || found.id || found.id_cliente || null) : null;
            } catch (e) {
                console.error('Error buscando cliente por email:', e);
                return null;
            }
        };

        const findClientIdByDni = async (dni) => {
            try {
                console.log(`Buscando cliente con DNI: ${dni}`);
                const res = await fetch(`http://127.0.0.1:8081/api/clientes/dni/${dni}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!res.ok) {
                    console.warn(`GET /api/clientes/dni/${dni} devolvió ${res.status}, intentando fallback`);
                    const resAll = await fetch('http://127.0.0.1:8081/api/clientes', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!resAll.ok) {
                        console.error(`Error ${resAll.status} al buscar todos los clientes`);
                        return null;
                    }
                    const clientes = await resAll.json();
                    const found = clientes.find(c => (c.dni || '').toLowerCase() === dni.toLowerCase());
                    if (found) {
                        console.log(`Cliente encontrado por DNI en fallback: ${found.idCliente}`);
                    }
                    return found ? (found.idCliente || found.id || found.id_cliente || null) : null;
                }
                const cliente = await res.json();
                console.log(`Cliente encontrado por DNI: ${cliente.idCliente}`);
                return cliente.idCliente || cliente.id || cliente.id_cliente || null;
            } catch (e) {
                console.error('Error buscando cliente por DNI:', e);
                return null;
            }
        };

        const createClienteIfNeeded = async (user) => {
            return new Promise((resolve) => {
                const modalEl = this.clienteModal;
                modalEl.setAttribute('inert', '');
                const form = modalEl.querySelector('#createClienteForm');
                const emailInput = modalEl.querySelector('#createClienteEmail');
                const nombreInput = modalEl.querySelector('#createClienteNombre');
                const dniInput = modalEl.querySelector('#createClienteDni');
                const telefonoInput = modalEl.querySelector('#createClienteTelefono');
                const direccionInput = modalEl.querySelector('#createClienteDireccion');
                const cancelBtn = modalEl.querySelector('#createClienteCancel');

                emailInput.value = user.email || '';
                nombreInput.value = '';
                dniInput.value = '';
                telefonoInput.value = '';
                direccionInput.value = '';

                const bsModal = new bootstrap.Modal(modalEl);

                const cleanup = () => {
                    form.removeEventListener('submit', onSubmit);
                    cancelBtn.removeEventListener('click', onCancel);
                };

                const onCancel = () => {
                    cleanup();
                    bsModal.hide();
                    modalEl.removeAttribute('inert');
                    resolve(null);
                };

                const onSubmit = async (e) => {
                    e.preventDefault();
                    const nombre = nombreInput.value.trim();
                    const dni = dniInput.value.trim();
                    const telefono = telefonoInput.value.trim();
                    const direccion = direccionInput.value.trim();

                    if (!nombre || !/^\d{8}$/.test(dni)) {
                        alert('Por favor ingresa un nombre y un DNI válido de 8 dígitos.');
                        return;
                    }

                    // Check if client exists by DNI
                    let clientId = await findClientIdByDni(dni);
                    if (clientId) {
                        console.log(`Cliente encontrado con DNI ${dni}, idCliente: ${clientId}`);
                        cleanup();
                        bsModal.hide();
                        modalEl.removeAttribute('inert');
                        resolve(clientId);
                        return;
                    }

                    // Try to create new client
                    const clienteDTO = {
                        nombre: nombre,
                        email: emailInput.value || null,
                        dni: dni,
                        telefono: telefono || null,
                        direccion: direccion || null,
                        fechaNacimiento: null,
                        tieneCondicionCronica: false,
                        notasEspeciales: null,
                        aceptaNotificaciones: true
                    };

                    try {
                        console.log('Creando nuevo cliente:', clienteDTO);
                        const res = await fetch('http://127.0.0.1:8081/api/clientes', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(clienteDTO)
                        });
                        if (!res.ok && res.status !== 200) {
                            const errorData = await res.json();
                            console.error('Error en POST /api/clientes:', errorData);
                            alert('No se pudo crear el cliente: ' + (errorData.message || 'Error desconocido'));
                            cleanup();
                            bsModal.hide();
                            modalEl.removeAttribute('inert');
                            resolve(null);
                            return;
                        }

                        const created = await res.json();
                        console.log('Respuesta de POST /api/clientes:', created);
                        cleanup();
                        bsModal.hide();
                        modalEl.removeAttribute('inert');
                        const createdId = created.idCliente || created.id || null;
                        resolve(createdId || await findClientIdByDni(dni));
                    } catch (err) {
                        console.error('Error creando cliente:', err);
                        alert('Error al crear el cliente: ' + err.message);
                        cleanup();
                        bsModal.hide();
                        modalEl.removeAttribute('inert');
                        resolve(null);
                    }
                };

                form.addEventListener('submit', onSubmit);
                cancelBtn.addEventListener('click', onCancel);
                bsModal.show();
                modalEl.removeAttribute('inert');
            });
        };

        try {
            let clientId = loggedInUser.idCliente || loggedInUser.clientId || null;

            if (!clientId) {
                clientId = await findClientIdByEmail(loggedInUser.email);
            }

            if (!clientId) {
                clientId = await createClienteIfNeeded(loggedInUser);
            }

            if (!clientId) {
                const contenedor = document.getElementById('listaCarrito');
                contenedor.innerHTML = `<div class="alert alert-success">Se realizó la reserva localmente. Si quieres que se registre en la farmacia, por favor contacta con el personal.</div>`;
                this.items = [];
                this.guardarCarrito();
                this.actualizarBadge();
                setTimeout(() => { this.renderizarCarrito(); }, 2000);
                return;
            }

            const reservaDTO = {
                cliente: { idCliente: clientId },
                estado: 'PENDIENTE',
                metodoNotificacion: 'EMAIL',
                fechaLimiteRetiro: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                detalles: this.items.map(item => ({
                    producto: { idProducto: item.idProducto },
                    cantidad: item.cantidad,
                    precioUnitario: item.precio.toFixed(2),
                    subtotal: (item.precio * item.cantidad).toFixed(2),
                    disponible: true,
                    notas: item.notas || ''
                }))
            };

            console.log('Enviando reserva:', reservaDTO);

            const response = await fetch('http://127.0.0.1:8081/api/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reservaDTO)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error al procesar la reserva, server replied:', errorData);
                throw new Error(errorData.message || 'Error al procesar la reserva');
            }

            const contenedor = document.getElementById('listaCarrito');
            contenedor.innerHTML = `<div class="alert alert-success">¡Tu reserva se ha realizado con éxito! Acércate a la farmacia para recogerla.</div>`;
            this.items = [];
            this.guardarCarrito();
            this.actualizarBadge();
            setTimeout(() => { this.renderizarCarrito(); }, 2500);

        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al procesar tu reserva: ' + error.message);
        }
    }
}

const carrito = new Carrito();