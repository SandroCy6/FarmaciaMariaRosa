import { useState } from "react";

export function useLogin() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("loggedInUser")) || null;
    }
    return null;
  });

  const getUsers = () => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("users") || "[]");
  };

  const saveUser = (email, password) => {
    const users = getUsers();
    users.push({ email, password, role: "user" });
    localStorage.setItem("users", JSON.stringify(users));
  };

  const findUser = (email, password) => {
    if (email === "admin@farmacia.com" && password === "123456") {
      return { email, role: "admin" };
    }
    return getUsers().find((u) => u.email === email && u.password === password);
  };

  const userExists = (email) => {
    return (
      email === "admin@farmacia.com" || getUsers().some((u) => u.email === email)
    );
  };

  const login = (email, password) => {
    const user = findUser(email, password);
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      setLoggedInUser(user);
      return { success: true, user };
    } else {
      return { success: false, error: "Usuario o contraseña incorrectos." };
    }
  };

  const register = (email, password, password2) => {
    if (password !== password2) {
      return { success: false, error: "Las contraseñas no coinciden." };
    }
    if (userExists(email)) {
      return { success: false, error: "El correo ya está registrado." };
    }
    saveUser(email, password);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
  };

  return {
    loggedInUser,
    login,
    register,
    logout,
  };
}
