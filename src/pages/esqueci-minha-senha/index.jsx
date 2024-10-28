// pages/forgot-password.js
import React, { useState } from "react";
import { auth } from "@/services/firebaseConection";
import { sendPasswordResetEmail } from "firebase/auth";
import styles from "./index.module.scss";
import Head from "next/head";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Um e-mail de redefinição de senha foi enviado.");
      setEmail(""); // Limpa o campo após o envio
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição de senha:", error);
      setErrorMessage(
        "Erro ao enviar e-mail. Verifique se o e-mail está correto."
      );
    }
  };

  return (
    <>
      <Head>
        <title>Cameo - Esqueci minha senha</title>
        <meta
          name="description"
          content="Esqueceu sua senha? Redefina-a facilmente e volte a acessar sua conta no Cameo para continuar aproveitando suas recomendações de filmes."
        />
      </Head>
      <div className={styles.container}>
        <h1>Recuperar Senha</h1>
        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            required
          />
          <button type="submit">Enviar e-mail de redefinição</button>
        </form>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </>
  );
};

export default ForgotPassword;
