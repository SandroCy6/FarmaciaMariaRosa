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
        this.sidebar.classList.toggle("active");
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

            const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.nombre}</div>
                        <div class="cart-item-price">S/ ${item.precio.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span>${item.cantidad}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
            `;
            contenedor.innerHTML += itemHTML;
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

    agregarProducto(producto) {
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
        this.toggleSidebar();
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
        this.items = [];
        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarBadge();
    }

    async realizarReserva() {
        if (this.items.length === 0) {
            alert("Tu carrito está vacío");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            const modal = new bootstrap.Modal(document.getElementById('loginModal'));
            modal.show();
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: this.items.map(item => ({
                        productoId: item.idProducto,
                        cantidad: item.cantidad
                    }))
                })
            });

            if (response.ok) {
                alert("¡Tu reserva de tu pedido se ha realizado con éxito! Acércate a la farmacia para poder recogerlo.");
                this.vaciarCarrito();
                this.toggleSidebar();
            } else {
                throw new Error('Error al procesar la reserva');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al procesar tu reserva. Por favor intenta de nuevo.');
        }
    }
}

// Crear una instancia global del carrito
const carrito = new Carrito();