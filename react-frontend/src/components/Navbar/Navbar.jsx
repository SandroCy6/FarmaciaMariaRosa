import React from "react";
import DarkModeToggle from "./DarkModeToggle";
import styles from "./Navbar.module.css"; // Importa el módulo

export default function Navbar() {
  return (
    <nav className={`${styles.navbar} navbar navbar-expand-lg shadow-sm sticky-top`}>
      <div className="container">
        {/* Logo */}
        <a className={`${styles.navbarBrand} navbar-brand d-flex align-items-center`} href="#">
          <img
            src="/assets/img/logo2.jpeg"
            alt="Logo Farmacia"
            width="50"
            height="50"
            className={`${styles.logoAnimate} me-2`}
          />
          <span className="fw-bold">&nbsp;Farmacia María Rosa</span>
        </a>

        {/* Botón collapse para móvil */}
        <button
          className={`${styles.customToggler} navbar-toggler`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div className={`${styles.navbarCollapse} collapse navbar-collapse`} id="navbarNav">
          <ul className={`${styles.navbarNav} navbar-nav mx-auto d-flex align-items-center`}>
            <li className={`${styles.navItem} nav-item`}>
              <a className={`${styles.navBtn} ${styles.navBtnActivo} nav-link`} href="/">
                Inicio
                <span className={styles.navUnderline}></span>
              </a>
            </li>
            <li className={`${styles.navItem} nav-item`}>
              <a className={`${styles.navBtn} nav-link`} href="/productos">
                Productos
                <span className={styles.navUnderline}></span>
              </a>
            </li>
            <li className={`${styles.navItem} nav-item`}>
              <a className={`${styles.navBtn} nav-link`} href="/contacto">
                Contacto
                <span className={styles.navUnderline}></span>
              </a>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            <DarkModeToggle />
            <a
              id="shopCar"
              className={`${styles.btnCustomNav} btn`}
              href="/productos"
              aria-label="Ir a productos"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-shopping-cart h-5 w-5 icon-animate"
                aria-hidden="true"
              >
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
            </a>
            <button
              id="loginBtn"
              className={`${styles.btnCustomNav} btn`}
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
              aria-label="Iniciar sesión o registrarse"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-user-round-icon lucide-circle-user-round"
              >
                <path d="M18 20a6 6 0 0 0-12 0"></path>
                <circle cx="12" cy="10" r="4"></circle>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
