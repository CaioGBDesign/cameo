import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import EntrarCadastrar from "@/components/botoes/acesso";
import Header from "@/components/Header";
import { AuthContext } from "@/contexts/auth";

const Cadastro = () => {
  const [handle, setHandle] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { signUp, loadingAuth } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();

    if (nome !== "" && (email !== "") & (senha !== "")) {
      await signUp(email, senha, nome, handle);
    }
  }

  return (
    <main className={styles["background"]}>
      <Header showMiniatura={true} showFotoPerfil={false} />

      <div className={styles.cadastro}>
        <div className={styles.formulario}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputCameo}>
              <input
                type="handle"
                placeholder="@"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputCameo}>
              <input
                type="name"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputCameo}>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputCameo}>
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <EntrarCadastrar onClick={handleSubmit}>
              {loadingAuth ? "Carregando..." : "Cadastrar"}
            </EntrarCadastrar>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.loginCadastro}>
              <span>
                Já tenho cadastro. <a href="/login">Entrar.</a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Cadastro;
