// components/ModalRedefinirSenha.js
import React, { useState } from "react";
import styles from "./index.module.scss";
import { auth } from "@/services/firebaseConection";
import { sendPasswordResetEmail } from "firebase/auth";

const ModalRedefinirSenha = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Email de redefinição de senha enviado com sucesso!");
      setTimeout(onClose, 5000); // Fecha o modal após 5 segundos
    } catch (err) {
      setError("Erro ao enviar email de redefinição: " + err.message);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContainer}>
        <div className={styles.contModal}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fconfirmacao-cadastro.svg?alt=media&token=363389e5-7513-4ccf-95cc-e050866ed110"
            alt="Confirmação"
          />
          <div className={styles.tituloModal}>
            <p>Link de redefinição de senha enviado para seu e-mail.</p>
          </div>

          <button onClick={onClose}>Ok</button>
        </div>
      </div>
    </div>
  );
};

export default ModalRedefinirSenha;
