document.addEventListener("DOMContentLoaded", function () {
  // ===== Manejo de usuarios en localStorage =====
  function getUsers() {
        // Obtiene usuarios registrados (excepto admin, que está hardcodeado)
    return JSON.parse(localStorage.getItem("users") || "[]");
  }
  function saveUser(email, password) {
        // Guarda un nuevo usuario en localStorage
    const users = getUsers();
    users.push({ email, password, role: "user" });
    localStorage.setItem("users", JSON.stringify(users));
  }
  function findUser(email, password) {
        // Si es el admin, se valida con credenciales fijas
    if (email === "admin@farmacia.com" && password === "123456") {
      return { email, role: "admin" };
    }
        // Sino, busca en los usuarios guardados
    return getUsers().find(u => u.email === email && u.password === password);
  }
  function userExists(email) {
        // Verifica si el email ya existe (incluyendo admin)
    return (
      email === "admin@farmacia.com" ||
      getUsers().some(u => u.email === email)
    );
  }

  // ===== Manejo de sesión =====
  function setLoggedInUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  }
  function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser") || "null");
  }
  function logoutUser() {
    localStorage.removeItem("loggedInUser");
  }

  // ===== Login =====
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      const user = findUser(email, password);
      if (user) {
                // Usuario válido → guardar sesión y redirigir
        loginError.style.display = "none";
        setLoggedInUser(user);
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        if (user.role === "admin") {
          // Redirigir al panel de admin (ajustando según ruta actual)
          const isInPages = window.location.pathname.includes("/pages/");
          const isInAdmin = window.location.pathname.includes("/admin/");
          if (isInPages || isInAdmin) {
            window.location.href = "../admin/admin-productos.html";
          } else {
            window.location.href = "./admin/admin-productos.html";
          }
        } else {
          alert("¡Bienvenido, " + email + "!");
                    // Aquí se podría redirigir a perfil de usuario
        }
      } else {
                // Usuario no encontrado → mostrar error
        loginError.style.display = "block";
      }
    });
  }

  // ===== Registro =====
  const registerForm = document.getElementById("registerForm");
  const registerError = document.getElementById("registerError");
  const registerSuccess = document.getElementById("registerSuccess");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      const password2 = document.getElementById("registerPassword2").value;

      registerError.style.display = "none";
      registerSuccess.style.display = "none";

            // Validaciones: contraseñas coinciden y email único
      if (password !== password2) {
        registerError.textContent = "Las contraseñas no coinciden.";
        registerError.style.display = "block";
        return;
      }
      if (userExists(email)) {
        registerError.textContent = "El correo ya está registrado.";
        registerError.style.display = "block";
        return;
      }
            // Guardar nuevo usuario
      saveUser(email, password);
      registerSuccess.style.display = "block";
      registerForm.reset();
    });
  }

  // ===== Botón de login/perfil =====
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      const user = getLoggedInUser();
      if (user) {
                // Si ya está logueado, redirigir según rol
        e.preventDefault();
        const isInPages = window.location.pathname.includes("/pages/");
        const isInAdmin = window.location.pathname.includes("/admin/");
        if (user.role === "admin") {
          // Go to admin panel
          if (isInPages || isInAdmin) {
            window.location.href = "../admin/admin-productos.html";
          } else {
            window.location.href = "./admin/admin-productos.html";
          }
        } else {
          // Go to profile page
          if (isInPages || isInAdmin) {
            window.location.href = "../pages/perfil.html";
          } else {
            window.location.href = "./pages/perfil.html";
          }
        }
      } else {
        // Si no hay usuario logueado, se abrirá el modal de login
        // (funciona con data-bs-toggle o se puede abrir manualmente con JS)
      }
    });
  }
});