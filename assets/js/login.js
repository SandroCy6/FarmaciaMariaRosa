document.addEventListener("DOMContentLoaded", function () {
  // Simple localStorage user store (demo only)
  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
  }
  function saveUser(email, password) {
    const users = getUsers();
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
  }
  function findUser(email, password) {
    return getUsers().find(u => u.email === email && u.password === password);
  }
  function userExists(email) {
    return getUsers().some(u => u.email === email);
  }

  // Login
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      // Demo: Hardcoded admin + registered users
      if (
        (email === "admin@farmacia.com" && password === "123456") ||
        findUser(email, password)
      ) {
        loginError.style.display = "none";
        alert("¡Bienvenido, " + email + "!");
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
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
});