import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const ADMIN_USER = { email: "admin@farmacia.com", password: "123456", role: "admin" };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
  }

  function saveUser(email, password) {
    const users = getUsers();
    users.push({ email, password, role: "user" });
    localStorage.setItem("users", JSON.stringify(users));
  }

  function findUser(email, password) {
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) return ADMIN_USER;
    return getUsers().find(u => u.email === email && u.password === password);
  }

  function userExists(email) {
    return email === ADMIN_USER.email || getUsers().some(u => u.email === email);
  }

  function login(email, password) {
    const found = findUser(email, password);
    if (found) {
      localStorage.setItem("loggedInUser", JSON.stringify(found));
      setUser(found);
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem("loggedInUser");
    setUser(null);
  }

  function register(email, password) {
    if (password.length < 6 || userExists(email)) return false;
    saveUser(email, password);
    return true;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
