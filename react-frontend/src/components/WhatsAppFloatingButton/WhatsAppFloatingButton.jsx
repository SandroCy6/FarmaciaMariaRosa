import React from "react";
import styles from "./WhatsAppFloatingButton.module.css";

export default function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/51922684873"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappFloat}
      aria-label="Contacto WhatsApp"
    >
      <i className="fa fa-whatsapp" aria-hidden="true"></i>
    </a>
  );
}
