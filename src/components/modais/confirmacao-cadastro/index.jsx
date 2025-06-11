import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

const Modal = ({ message, onClose }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContainer}>
        <div className={styles.contModal}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fconfirmacao-cadastro.svg?alt=media&token=363389e5-7513-4ccf-95cc-e050866ed110"
            alt="Confirmação"
          />
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
