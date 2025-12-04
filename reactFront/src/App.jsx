import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import Perfil from "./pages/Perfil";
import Admin from "./pages/admin/Admin";

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pages/productos" element={<Productos />} />
            <Route path="/pages/contacto" element={<Contacto />} />
            <Route path="/pages/perfil" element={<Perfil />} />

            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
          <WhatsAppButton />
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
