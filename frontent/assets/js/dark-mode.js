// Botón que activa/desactiva el modo oscuro
const toggleBtn = document.getElementById("darkModeToggle");
// Se obtiene el elemento <body> para aplicar la clase
const body = document.body;

// Al cargar la página: si en localStorage está guardado el dark-mode en "true", se activa
if (localStorage.getItem("dark-mode") === "true") {
body.classList.add("dark-mode");
}

// Evento de click en el botón → alterna entre modo claro/oscuro
toggleBtn.addEventListener("click", () => {
body.classList.toggle("dark-mode");

// Se guarda en localStorage el estado actual (true = oscuro, false = claro)
if (body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode", "true");
} else {
    localStorage.setItem("dark-mode", "false");
}
});