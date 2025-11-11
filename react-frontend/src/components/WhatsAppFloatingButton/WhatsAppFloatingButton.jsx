import React from "react";
import styles from "./WhatsAppFloatingButton.module.css";

export default function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/519222684873"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappFloat}
      aria-label="Contacto WhatsApp"
    >
      <img
        src="/assets/icons/chat.svg"
        alt="WhatsApp"
        width={48}
        height={48}
        className={styles.myFloat}
      />
    </a>
  );
}
