import React, { useState, useEffect } from "react";
import { DarkModeContext } from "./DarkModeContext";

export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Al montar, leer estado guardado en localStorage
  useEffect(() => {
    const stored = localStorage.getItem("dark-mode");
    if (stored === "true") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  // Actualiza body y localStorage si cambia darkMode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("dark-mode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "false");
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
