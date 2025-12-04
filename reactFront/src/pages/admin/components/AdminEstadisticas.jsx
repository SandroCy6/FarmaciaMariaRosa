import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  obtenerCategorias,
  obtenerProductos,
  obtenerReservas,
  obtenerClientes,
} from "../services/adminService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminEstadisticas = () => {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [chartData, setChartData] = useState({
    products: null,
    stock: null,
    reservations: null,
    clients: null,
  });

  useEffect(() => {
    cargarEstadisticas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
      const [categorias, productos, reservas, clientes] = await Promise.all([
        obtenerCategorias(),
        obtenerProductos(),
        obtenerReservas(),
        obtenerClientes(),
      ]);

      console.log("Datos cargados para estadísticas");

      const productsChart = renderProductsByCategory(categorias, productos);
      const stockChart = renderStockByCategory(categorias, productos);
      const reservationsChart = renderReservationsByDay(reservas);
      const clientsChart = renderTopClientsBySpending(reservas, clientes);

      setChartData({
        products: productsChart,
        stock: stockChart,
        reservations: reservationsChart,
        clients: clientsChart,
      });

      setLastUpdated(new Date().toLocaleString("es-ES"));
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
      alert("Error cargando estadísticas: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const randomPalette = (n) => {
    const base = [
      "#42a5f5", "#66bb6a", "#ff7043", "#ab47bc", "#ffa726", "#26a69a",
      "#ef5350", "#7e57c2", "#8d6e63", "#29b6f6", "#9ccc65", "#f06292",
    ];
    const out = [];
    for (let i = 0; i < n; i++) out.push(base[i % base.length]);
    return out;
  };

  const renderProductsByCategory = (categorias, productos) => {
    const map = {};
    (categorias || []).forEach((c) => {
      map[c.nombre] = 0;
    });
    (productos || []).forEach((p) => {
      const catName =
        p.categoriaNombre ||
        (categorias?.find((c) => c.idCategoria === p.idCategoria)?.nombre) ||
        "Sin categoría";
      map[catName] = (map[catName] || 0) + 1;
    });

    const labels = Object.keys(map);
    const data = Object.values(map);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: randomPalette(labels.length),
        },
      ],
    };
  };

  const renderStockByCategory = (categorias, productos) => {
    const stockMap = {};
    (categorias || []).forEach((c) => (stockMap[c.nombre] = 0));
    (productos || []).forEach((p) => {
      const catName =
        p.categoriaNombre ||
        (categorias?.find((c) => c.idCategoria === p.idCategoria)?.nombre) ||
        "Sin categoría";
      const stock = Number(p.stockActual || 0);
      stockMap[catName] = (stockMap[catName] || 0) + stock;
    });

    const labels = Object.keys(stockMap);
    const data = Object.values(stockMap);

    return {
      labels,
      datasets: [
        {
          label: "Stock total",
          data,
          backgroundColor: randomPalette(labels.length),
          borderWidth: 1,
        },
      ],
    };
  };

  const renderReservationsByDay = (reservas) => {
    const map = {};
    (reservas || []).forEach((r) => {
      const d = r.fechaReserva ? new Date(r.fechaReserva) : null;
      const key = d ? d.toISOString().slice(0, 10) : "Sin fecha";
      map[key] = (map[key] || 0) + 1;
    });

    const keys = Object.keys(map)
      .filter((k) => k !== "Sin fecha")
      .sort();
    if (map["Sin fecha"]) keys.push("Sin fecha");
    const data = keys.map((k) => map[k]);

    return {
      labels: keys,
      datasets: [
        {
          label: "Reservas por día",
          data,
          tension: 0.25,
          fill: true,
          backgroundColor: "rgba(66,165,245,0.12)",
          borderColor: "#42a5f5",
          pointRadius: 4,
        },
      ],
    };
  };

  const renderTopClientsBySpending = (reservas, clientes) => {
    const spendMap = {};
    (reservas || []).forEach((r) => {
      const cliente = r.cliente;
      const id = cliente?.idCliente ?? cliente?.dni ?? "Sin cliente";
      spendMap[id] = (spendMap[id] || 0) + Number(r.total || 0);
    });

    const result = Object.keys(spendMap).map((id) => {
      const cli = (clientes || []).find(
        (c) => String(c.idCliente) === String(id)
      );
      return {
        id,
        name: cli ? `${cli.nombre}` : String(id),
        total: spendMap[id],
      };
    });

    result.sort((a, b) => b.total - a.total);
    const top = result.slice(0, 10);

    const labels = top.map((r) => r.name);
    const data = top.map((r) => Number(r.total.toFixed(2)));

    return {
      labels,
      datasets: [
        {
          label: "Gasto total (S/.)",
          data,
          backgroundColor: randomPalette(labels.length),
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { enabled: true },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  const horizontalBarOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { x: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3">Estadísticas</h2>
      <p className="small text-muted">
        Resúmenes rápidos basados en los datos del backend. Los gráficos aparecen
        solo si hay datos.
      </p>

      <div className="mb-3 d-flex gap-2 align-items-center">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={cargarEstadisticas}
        >
          <i className="bi bi-arrow-clockwise"></i> Recargar estadísticas
        </button>
        <div className="small text-muted ms-3">
          Última actualización: <strong>{lastUpdated || "—"}</strong>
        </div>
      </div>

      <div
        className="row"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Productos por categoría */}
        {chartData.products && (
          <div className="card" style={{ borderRadius: "12px" }}>
            <div className="card-body">
              <h6 className="card-title fw-600 mb-3">Productos por categoría</h6>
              <div style={{ minHeight: "260px" }}>
                <Pie data={chartData.products} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Stock por categoría */}
        {chartData.stock && (
          <div className="card" style={{ borderRadius: "12px" }}>
            <div className="card-body">
              <h6 className="card-title fw-600 mb-3">Stock total por categoría</h6>
              <div style={{ minHeight: "260px" }}>
                <Bar data={chartData.stock} options={barOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Reservas por día */}
        {chartData.reservations && (
          <div className="card" style={{ borderRadius: "12px" }}>
            <div className="card-body">
              <h6 className="card-title fw-600 mb-3">Reservas (por día)</h6>
              <div style={{ minHeight: "260px" }}>
                <Line data={chartData.reservations} options={lineOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Top clientes */}
        {chartData.clients && (
          <div className="card" style={{ borderRadius: "12px" }}>
            <div className="card-body">
              <h6 className="card-title fw-600 mb-3">Top clientes por gasto</h6>
              <div style={{ minHeight: "260px" }}>
                <Bar data={chartData.clients} options={horizontalBarOptions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEstadisticas;