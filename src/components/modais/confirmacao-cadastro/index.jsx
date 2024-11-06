import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

const Modal = ({ message, onClose }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContainer}>
        <div className={styles.contModal}>
          <img src="/icones/confirmacao-cadastro.svg" alt="Confirmação" />
          <div className={styles.tituloModal}>
            <p>Verifique seu e-mail antes de fazer login.</p>
          </div>

          <button onClick={onClose}>Ir para login</button>
        </div>
      </div>
    </div>
  );
};

export default Modal; // Exportação padrão
