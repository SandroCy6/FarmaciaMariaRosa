import React from "react";
import styles from "./ContactHeroSection.module.css";

export default function ContactHeroSection() {
  return (
    <section className={styles.contactoHero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.contactoTitle}>¡Contáctanos!</h1>
        <p className={styles.contactoDescription}>
          Llena el formulario y estaremos aquí para ayudarte en todo momento
        </p>
        <a
          href="/contacto"
          className={styles.contactoButton}
          aria-label="Contactar a Farmacia María Rosa"
        >
          ¡Contactanos aqui!
        </a>
      </div>
    </section>
  );
}
