// ../assets/js/admin-estadisticas.js
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'http://127.0.0.1:8081/api';
  const btnReload = document.getElementById('btnReloadStats');
  const lastUpdatedEl = document.getElementById('lastUpdated');

  // Canvas elements
  const ctxProducts = document.getElementById('chartProductsByCategory').getContext('2d');
  const ctxStock = document.getElementById('chartStockByCategory').getContext('2d');
  const ctxRes = document.getElementById('chartReservationsByDay').getContext('2d');
  const ctxClients = document.getElementById('chartTopClients').getContext('2d');

  // Chart instances to destroy before re-creating
  const charts = {
    products: null,
    stock: null,
    reservations: null,
    clients: null
  };

  btnReload.addEventListener('click', loadAndRender);

  // initial load
  loadAndRender();

  async function loadAndRender() {
    try {
      btnReload.disabled = true;
      btnReload.textContent = 'Cargando...';

      // parallel fetches
      const [catsRes, prodsRes, reservasRes, clientesRes] = await Promise.all([
        fetch(`${API_BASE}/categorias`),
        fetch(`${API_BASE}/productos`),
        fetch(`${API_BASE}/reservas`),
        fetch(`${API_BASE}/clientes`)
      ]);

      if (!catsRes.ok || !prodsRes.ok || !reservasRes.ok || !clientesRes.ok) {
        throw new Error('Error al obtener datos del API. Revisa que el backend esté corriendo y CORS.');
      }

      const [categorias, productos, reservas, clientes] = await Promise.all([
        catsRes.json(),
        prodsRes.json(),
        reservasRes.json(),
        clientesRes.json()
      ]);

      renderProductsByCategory(categorias, productos);
      renderStockByCategory(categorias, productos);
      renderReservationsByDay(reservas);
      renderTopClientsBySpending(reservas, clientes);

      lastUpdatedEl.textContent = new Date().toLocaleString();
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
      alert('No se pudieron cargar las estadísticas. Revisa la consola.');
    } finally {
      btnReload.disabled = false;
      btnReload.textContent = 'Recargar estadísticas';
    }
  }

  // ---------- Helpers y renderers ----------

  function destroyChart(ref) {
    if (ref && typeof ref.destroy === 'function') ref.destroy();
  }

  function randomPalette(n) {
    // palette variada (repetible)
    const base = [
      '#42a5f5', '#66bb6a', '#ff7043', '#ab47bc', '#ffa726', '#26a69a',
      '#ef5350', '#7e57c2', '#8d6e63', '#29b6f6', '#9ccc65', '#f06292'
    ];
    const out = [];
    for (let i = 0; i < n; i++) out.push(base[i % base.length]);
    return out;
  }

  function renderProductsByCategory(categorias, productos) {
    // count of products per category (by categoriaNombre or idCategoria)
    const map = {};
    categorias.forEach(c => { map[c.nombre] = 0; }); // ensure categories show even when 0
    productos.forEach(p => {
      const catName = p.categoriaNombre || (categorias.find(c => c.idCategoria === p.idCategoria)?.nombre) || 'Sin categoría';
      map[catName] = (map[catName] || 0) + 1;
    });

    const labels = Object.keys(map);
    const data = Object.values(map);

    destroyChart(charts.products);
    charts.products = new Chart(ctxProducts, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: randomPalette(labels.length)
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { enabled: true }
        }
      }
    });
  }

  function renderStockByCategory(categorias, productos) {
    // sum stockActual grouped by category
    const stockMap = {};
    categorias.forEach(c => stockMap[c.nombre] = 0);
    productos.forEach(p => {
      const catName = p.categoriaNombre || (categorias.find(c => c.idCategoria === p.idCategoria)?.nombre) || 'Sin categoría';
      const stock = Number(p.stockActual || 0);
      stockMap[catName] = (stockMap[catName] || 0) + stock;
    });

    const labels = Object.keys(stockMap);
    const data = Object.values(stockMap);

    destroyChart(charts.stock);
    charts.stock = new Chart(ctxStock, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Stock total',
          data,
          backgroundColor: randomPalette(labels.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }

  function renderReservationsByDay(reservas) {
    // group reservations by date (day)
    const map = {};
    reservas.forEach(r => {
      // prefer fechaReserva; parse to local date string YYYY-MM-DD
      const d = r.fechaReserva ? new Date(r.fechaReserva) : null;
      const key = d ? d.toISOString().slice(0, 10) : 'Sin fecha';
      map[key] = (map[key] || 0) + 1;
    });

    // sort keys (chronological) but keep 'Sin fecha' last
    const keys = Object.keys(map).filter(k => k !== 'Sin fecha').sort();
    if (map['Sin fecha']) keys.push('Sin fecha');
    const data = keys.map(k => map[k]);

    destroyChart(charts.reservations);
    charts.reservations = new Chart(ctxRes, {
      type: 'line',
      data: {
        labels: keys,
        datasets: [{
          label: 'Reservas por día',
          data,
          tension: 0.25,
          fill: true,
          backgroundColor: 'rgba(66,165,245,0.12)',
          borderColor: '#42a5f5',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }

  function renderTopClientsBySpending(reservas, clientes) {
    // Calculate total spent per cliente (client id may be in reserva.cliente.idCliente)
    const spendMap = {};
    reservas.forEach(r => {
      const cliente = r.cliente;
      const id = cliente?.idCliente ?? cliente?.dni ?? 'Sin cliente';
      spendMap[id] = (spendMap[id] || 0) + Number(r.total || 0);
    });

    // Map ids to names using clientes array
    const result = Object.keys(spendMap).map(id => {
      const cli = clientes.find(c => String(c.idCliente) === String(id));
      return {
        id,
        name: cli ? `${cli.nombre}` : String(id),
        total: spendMap[id]
      };
    });

    // sort desc and take top 8 (no limit if user asked "no hay límite" — but UI wise we limit to 10)
    result.sort((a, b) => b.total - a.total);
    const top = result.slice(0, 10);

    const labels = top.map(r => r.name);
    const data = top.map(r => Number(r.total.toFixed(2)));

    destroyChart(charts.clients);
    charts.clients = new Chart(ctxClients, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Gasto total (S/.)',
          data,
          backgroundColor: randomPalette(labels.length)
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: { x: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }
});
