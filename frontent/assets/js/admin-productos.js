document.addEventListener("DOMContentLoaded", function () {
  // Verificar autenticación
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  if (!user || user.role !== "admin") {
    window.location.href = "../index.html";
    return;
  }

  // Configurar logout
  document.getElementById("logoutBtn").onclick = function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../index.html";
  };

  // Sincronizar pestañas entre sidebar normal y móvil
  const desktopTabs = document.querySelectorAll("#adminSidebarTabs .nav-link");
  const mobileTabs = document.querySelectorAll("#adminSidebarTabsMobile .nav-link");
  const offcanvasEl = document.getElementById("adminSidebarNavMobile");
  let offcanvasInstance = null;
  if (window.bootstrap && offcanvasEl) {
    offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
  }

  const panels = {
    "panel-productos": "../admin/panel-productos.html",
    "panel-categorias": "../admin/panel-categorias.html",
    "panel-lotes": "../admin/panel-lotes.html",
    "panel-clientes": "../admin/panel-clientes.html",
    "panel-estadisticas": "../admin/panel-estadisticas.html"
  };

  // Cargar panel inicial
  loadPanel("panel-productos");

  // Manejar clics en pestañas
  desktopTabs.forEach((btn, idx) => {
    btn.addEventListener("click", function () {
      mobileTabs.forEach((b, i) => b.classList.toggle("active", i === idx));
      loadPanel(btn.getAttribute("data-bs-target").substring(1));
    });
  });

  mobileTabs.forEach((btn, idx) => {
    btn.addEventListener("click", function () {
      if (desktopTabs[idx]) desktopTabs[idx].click();
      if (offcanvasInstance) offcanvasInstance.hide();
    });
  });

  function loadPanel(panelId) {
    const panelContainer = document.getElementById(panelId);
    fetch(panels[panelId])
      .then(response => {
        if (!response.ok) throw new Error("Error al cargar el panel");
        return response.text();
      })
      .then(html => {
        panelContainer.innerHTML = html;
        // Cargar script específico del panel si es necesario
        if (panelId === "panel-productos") {
          const script = document.createElement("script");
          script.src = "../assets/js/panel-productos.js";
          script.async = true;
          document.body.appendChild(script);
        }
      })
      .catch(error => {
        console.error("Error cargando panel:", error);
        panelContainer.innerHTML = `<div class="alert alert-danger">Error al cargar el panel: ${error.message}</div>`;
      });
  }
});