document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products-container");

  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(producto => {
        const col = document.createElement("div");
        col.classList.add("col-md-4");

        col.innerHTML = `
          <div class="card shadow-sm h-100">
            <img src="${producto.imagen}" class="card-img-top p-3" alt="${producto.nombre}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text text-muted">${producto.descripcion}</p>
              <p class="mb-1"><strong>Categoría:</strong> ${producto.categoria}</p>
              <p class="mb-1"><strong>Stock:</strong> ${producto.stock}</p>
              <div class="mt-auto">
                <p class="fw-bold text-success">S/ ${producto.precio.toFixed(2)}</p>
                <small class="text-warning">⭐ ${producto.rating}</small>
              </div>
            </div>
          </div>
        `;

        container.appendChild(col);
      });
    })
    .catch(error => console.error("Error cargando JSON:", error));
});
