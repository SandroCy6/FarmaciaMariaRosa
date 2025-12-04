import React from "react";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "productos", label: "Productos" },
    { id: "categorias", label: "Categorías" },
    { id: "lotes", label: "Lotes" },
    { id: "clientes", label: "Clientes" },
    { id: "reservas", label: "Reservas" },
    { id: "estadisticas", label: "Estadísticas" },
    { id: "mensajes", label: "Mensajes" },
  ];

  return (
    <>
      {/* Sidebar desktop */}
      <nav className="sidebar me-3 d-none d-lg-block">
        <div className="position-sticky pt-3">
          <ul
            className="nav flex-column nav-pills gap-2"
            id="adminSidebarTabs"
            role="tablist"
          >
            {menuItems.map((item) => (
              <li className="nav-item" key={item.id} role="presentation">
                <button
                  className={`nav-link w-100 text-start ${
                    activeTab === item.id ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(item.id)}
                  role="tab"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Sidebar móvil */}
      <div
        className="offcanvas offcanvas-start d-lg-none"
        tabIndex="-1"
        id="adminSidebarNavMobile"
        aria-labelledby="adminSidebarNavMobileLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="adminSidebarNavMobileLabel">
            Menú administración
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul
            className="nav flex-column nav-pills gap-2"
            id="adminSidebarTabsMobile"
            role="tablist"
          >
            {menuItems.map((item) => (
              <li className="nav-item" key={item.id} role="presentation">
                <button
                  className={`nav-link w-100 text-start ${
                    activeTab === item.id ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(item.id)}
                  role="tab"
                  data-bs-dismiss="offcanvas"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;