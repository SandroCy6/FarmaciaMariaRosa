// Obtener usuarios registrados
export const getUsers = () => {
  return JSON.parse(localStorage.getItem("users") || "[]");
};

// Guardar nuevo usuario
export const saveUser = (email, password) => {
  const users = getUsers();
  users.push({ email, password, role: "user" });
  localStorage.setItem("users", JSON.stringify(users));
};

// Buscar usuario por email y password
export const findUser = (email, password) => {
  if (email === "admin@farmacia.com" && password === "123456") {
    return { email, role: "admin" };
  }
  return getUsers().find(u => u.email === email && u.password === password);
};

// Verificar si email existe
export const userExists = (email) => {
  return (
    email === "admin@farmacia.com" ||
    getUsers().some(u => u.email === email)
  );
};

// Manejo de sesión
export const setLoggedInUser = (user) => {
  localStorage.setItem("loggedInUser", JSON.stringify(user));
};

export const getLoggedInUser = () => {
  const saved = localStorage.getItem("loggedInUser");
  return saved ? JSON.parse(saved) : null;
};

export const logoutUser = () => {
  localStorage.removeItem("loggedInUser");
};

// Dark mode
export const getInitialDarkMode = () => {
  return localStorage.getItem("dark-mode") === "true";
};

export const toggleDarkModeStorage = (isDark) => {
  localStorage.setItem("dark-mode", isDark ? "true" : "false");
};

// Productos
export const getProducts = async () => {
  if (localStorage.getItem("adminProducts")) {
    return JSON.parse(localStorage.getItem("adminProducts"));
  } else {
    try {
      const res = await fetch("./data/products.json");
      return await res.json();
    } catch (error) {
      console.error("Error loading products:", error);
      return [];
    }
  }
};

export const pickBestRated = (products, count = 4) => {
  const sorted = products.slice().sort((a, b) => b.rating - a.rating);
  const top = sorted.slice(0, 8);
  // Shuffle
  for (let i = top.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [top[i], top[j]] = [top[j], top[i]];
  }
  return top.slice(0, count);
};

export const getCategories = () => {
  return JSON.parse(localStorage.getItem("adminCategories") || "[]");
};

export const saveCategories = (categories) => {
  localStorage.setItem("adminCategories", JSON.stringify(categories));
};

// CLIENTES
export const getClients = () => {
  return JSON.parse(localStorage.getItem("adminClients") || "[]");
};

export const saveClients = (clients) => {
  localStorage.setItem("adminClients", JSON.stringify(clients));
};

// LOTES
export const getLotes = () => {
  return JSON.parse(localStorage.getItem("adminLotes") || "[]");
};

export const saveLotes = (lotes) => {
  localStorage.setItem("adminLotes", JSON.stringify(lotes));
};

// RESERVAS
export const getReservas = () => {
  return JSON.parse(localStorage.getItem("adminReservas") || "[]");
};

export const saveReservas = (reservas) => {
  localStorage.setItem("adminReservas", JSON.stringify(reservas));
};

export const getReservations = () => getReservas();
export const saveReservations = (r) => saveReservas(r);
