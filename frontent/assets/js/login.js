document.addEventListener("DOMContentLoaded", function () {
  // User store (demo only)
  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
  }
  function saveUser(email, password) {
    const users = getUsers();
    users.push({ email, password, role: "user" });
    localStorage.setItem("users", JSON.stringify(users));
  }
  function findUser(email, password) {
    if (email === "admin@farmacia.com" && password === "123456") {
      return { email, role: "admin" };
    }
    return getUsers().find(u => u.email === email && u.password === password);
  }
  function userExists(email) {
    return (
      email === "admin@farmacia.com" ||
      getUsers().some(u => u.email === email)
    );
  }

  // Save logged-in user
  function setLoggedInUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  }
  function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser") || "null");
  }
  function logoutUser() {
    localStorage.removeItem("loggedInUser");
  }

  // Login
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      const user = findUser(email, password);
      if (user) {
        loginError.style.display = "none";
        setLoggedInUser(user);
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        if (user.role === "admin") {
          // Detect if current page is inside /pages or /admin
          const isInPages = window.location.pathname.includes("/pages/");
          const isInAdmin = window.location.pathname.includes("/admin/");
          if (isInPages || isInAdmin) {
            window.location.href = "../admin/admin.html";
          } else {
            window.location.href = "./admin/admin.html";
          }
        } else {
          alert("¡Bienvenido, " + email + "!");
          // Optionally redirect normal users to their profile page
          // window.location.href = ...;
        }
      } else {
        loginError.style.display = "block";
      }
    });
  }

  // Register
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
      saveUser(email, password);
      registerSuccess.style.display = "block";
      registerForm.reset();
    });
  }

  // Profile button behavior
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      const user = getLoggedInUser();
      if (user) {
        e.preventDefault();
        // Detect if current page is inside /pages or /admin
        const isInPages = window.location.pathname.includes("/pages/");
        const isInAdmin = window.location.pathname.includes("/admin/");
        if (user.role === "admin") {
          // Go to admin panel
          if (isInPages || isInAdmin) {
            window.location.href = "../admin/admin.html";
          } else {
            window.location.href = "./admin/admin.html";
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
        // Show login modal (default behavior)
        // If not using data-bs-toggle, open manually:
        // const modal = new bootstrap.Modal(document.getElementById('loginModal'));
        // modal.show();
      }
    });
  }
});