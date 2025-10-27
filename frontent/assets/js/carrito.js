// === carrito.js ===

class Carrito {
    constructor() {
        this.items = JSON.parse(localStorage.getItem("carrito")) || [];
        this.sidebar = null;
        this.init();
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.sidebar = this.crearSidebarCarrito();
            document.body.appendChild(this.sidebar);

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

        // Agregar event listeners para los botones de cantidad
        contenedor.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const change = e.target.classList.contains('plus') ? 1 : -1;
                this.actualizarCantidad(index, change);
            });
        });

        // Detalles: abrir modal con más información
        contenedor.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const item = this.items[index];
                if (!item) return;
                this.showProductModal(item, true);
            });
        });

        // Remove button in cart items
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
        // Confirmación antes de eliminar un producto individual
        const confirmado = window.confirm("¿Estás seguro que deseas eliminar este producto del carrito?");
        if (!confirmado) return;

        this.items.splice(index, 1);
        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarBadge();
    }

    // agregarProducto: si toggle === true abre/cierra el sidebar (comportamiento por defecto)
    agregarProducto(producto, toggle = true) {
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
        // Confirm before clearing (user requested exact text)
        const confirmado = window.confirm("Esas seguro?");
        if (!confirmado) return;

        this.items = [];
        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarBadge();
    }

    // Muestra el modal de producto (usa modal ya existente en productos.html)
    // fromCart: si true oculta el botón 'Agregar al carrito' en el modal
    showProductModal(product, fromCart = false) {
        // Poblar modal
        const modalEl = document.getElementById('productModal');
        if (!modalEl) return;

        document.getElementById('modalImagen').src = product.imagen || product.imagenPrincipal || '';
        document.getElementById('modalImagen').alt = product.nombre || '';
        document.getElementById('modalNombre').textContent = product.nombre || '';
        document.getElementById('modalDescripcion').textContent = product.descripcion || '';
        document.getElementById('modalCategoria').textContent = product.categoria || '';
        document.getElementById('modalStock').textContent = product.stock || product.stockActual || 0;
        document.getElementById('modalPrecio').textContent = `S/ ${Number(product.precio || 0).toFixed(2)}`;
        document.getElementById('modalRating').textContent = product.rating ? `⭐ ${product.rating}` : '';

        // Ajustar comportamiento del botón "Agregar al carrito" en el modal.
        // Mostrar el botón siempre; si viene del carrito, al agregar no se toggleará el sidebar.
        const addBtn = document.getElementById('modalAddToCart');
        if (addBtn) {
            addBtn.style.display = '';
            addBtn.onclick = () => {
                // agregar sin togglear el sidebar para no cerrarlo cuando venimos desde el carrito
                this.agregarProducto(product, false);
                const mb = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                mb.hide();
            };
        }
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    async realizarReserva() {
        if (this.items.length === 0) {
            alert("Tu carrito está vacío");
            return;
        }
        // If user is not logged in, show login modal
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        if (!loggedInUser) {
            const modal = new bootstrap.Modal(document.getElementById('loginModal'));
            modal.show();
            return;
        }

        // Helper: try to find clientId by email via API
        const findClientIdByEmail = async (email) => {
            try {
                const res = await fetch('http://localhost:8080/api/clientes');
                if (!res.ok) return null;
                const clientes = await res.json();
                // Try common id fields
                const found = clientes.find(c => (c.email || c.mail || '').toLowerCase() === (email || '').toLowerCase());
                if (!found) return null;
                return found.idCliente || found.id || found.id_cliente || null;
            } catch (e) {
                console.error('Error buscando cliente por email:', e);
                return null;
            }
        };

        // Helper: create cliente in backend using a modal (better UX)
        const createClienteIfNeeded = async (user) => {
            return new Promise((resolve) => {
                const modalEl = document.getElementById('createClienteModal');
                if (!modalEl) { resolve(null); return; }

                const form = modalEl.querySelector('#createClienteForm');
                const emailInput = modalEl.querySelector('#createClienteEmail');
                const nombreInput = modalEl.querySelector('#createClienteNombre');
                const dniInput = modalEl.querySelector('#createClienteDni');
                const telefonoInput = modalEl.querySelector('#createClienteTelefono');
                const direccionInput = modalEl.querySelector('#createClienteDireccion');
                const cancelBtn = modalEl.querySelector('#createClienteCancel');

                // Prefill email
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

                    const clienteDTO = {
                        nombre: nombre,
                        email: emailInput.value || '',
                        dni: dni,
                        telefono: telefono,
                        direccion: direccion,
                        fechaNacimiento: null,
                        tieneCondicionCronica: false,
                        notasEspeciales: '',
                        aceptaNotificaciones: true
                    };

                    try {
                        const res = await fetch('http://localhost:8080/api/clientes', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(clienteDTO)
                        });
                        if (!res.ok) {
                            const text = await res.text();
                            alert('No se pudo crear el cliente: ' + text);
                            cleanup();
                            bsModal.hide();
                            resolve(null);
                            return;
                        }

                        const created = await res.json();
                        cleanup();
                        bsModal.hide();
                        const createdId = created.idCliente || created.id || null;
                        if (createdId) {
                            resolve(createdId);
                            return;
                        }
                        // If backend didn't return id, try to find by email
                        const found = await findClientIdByEmail(emailInput.value);
                        resolve(found);
                    } catch (err) {
                        console.error('Error creando cliente:', err);
                        cleanup();
                        bsModal.hide();
                        resolve(null);
                    }
                };

                form.addEventListener('submit', onSubmit);
                cancelBtn.addEventListener('click', onCancel);
                bsModal.show();
            });
        };

        try {
            let clientId = loggedInUser.idCliente || loggedInUser.clientId || null;

            if (!clientId) {
                clientId = await findClientIdByEmail(loggedInUser.email);
            }

            if (!clientId) {
                // Try to create a cliente record (will ask user for minimal info)
                clientId = await createClienteIfNeeded(loggedInUser);
            }

            // If still no clientId, fallback to local-only success message and clear cart
            if (!clientId) {
                // Show success message but note backend was not notified
                const contenedor = document.getElementById('listaCarrito');
                contenedor.innerHTML = `<div class="alert alert-success">Se realizó la reserva localmente. Si quieres que se registre en la farmacia, por favor contacta con el personal.</div>`;
                this.items = [];
                this.guardarCarrito();
                this.actualizarBadge();
                setTimeout(() => { this.renderizarCarrito(); }, 2000);
                return;
            }

            // Build reservation DTO
            const reservaDTO = {
                idCliente: clientId,
                estado: 'PENDIENTE',
                detalles: this.items.map(item => ({
                    idProducto: item.idProducto,
                    cantidad: item.cantidad,
                    precioUnitario: item.precio,
                    subtotal: item.precio * item.cantidad,
                    disponible: true
                }))
            };

            const response = await fetch('http://localhost:8080/api/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservaDTO)
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Error al procesar la reserva, server replied:', text);
                throw new Error('Error al procesar la reserva');
            }

            // Success: show message in the cart and clear
            const contenedor = document.getElementById('listaCarrito');
            contenedor.innerHTML = `<div class="alert alert-success">¡Tu reserva se ha realizado con éxito! Acércate a la farmacia para recogerla.</div>`;
            this.items = [];
            this.guardarCarrito();
            this.actualizarBadge();
            setTimeout(() => { this.renderizarCarrito(); }, 2500);

        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al procesar tu reserva. Por favor intenta de nuevo.');
        }
    }
}

// Crear una instancia global del carrito
const carrito = new Carrito();