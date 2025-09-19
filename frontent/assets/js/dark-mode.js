const toggleBtn = document.getElementById("darkModeToggle");
const body = document.body;

if (localStorage.getItem("dark-mode") === "true") {
body.classList.add("dark-mode");
}
toggleBtn.addEventListener("click", () => {
body.classList.toggle("dark-mode");

// Por qué carajos no funcionaaaaaaaaAAAAAAAAAAAAAAAA ah ya entendi por qué ups EKISDE EKISDE
if (body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode", "true");
} else {
    localStorage.setItem("dark-mode", "false");
}
});