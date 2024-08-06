import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "@/components/logo";
import EntrarCadastrar from "@/components/botoes/acesso";
import Header from "@/components/Header";
import styles from "./index.module.scss";
import { AuthContext } from "@/contexts/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const { signIn, loadingAuth } = useContext(AuthContext);

  async function handleSignIn(e) {
    e.preventDefault();

    if (email !== "" && senha !== "") {
      try {
        await signIn(email, senha);
      } catch (error) {
        console.error("Erro capturado no componente de login:", error);
        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          setErro("Credenciais inválidas. Verifique seu e-mail e senha.");
        } else {
          setErro("Erro ao tentar fazer login. Tente novamente.");
        }
      }
    } else {
      setErro("Por favor, preencha todos os campos.");
    }
  }

  return (
    <main className={styles["background"]}>
      <Header showMiniatura={false} showFotoPerfil={false} />

      <div className={styles.login}>
        <Logo />

        <div className={styles.formulario}>
          <form onSubmit={handleSignIn}>
            <div className={styles.inputCont}>
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
                <div className={styles.contSenha}>
                  <Link href="/" className={styles.esqueciSenha}>
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>
              {erro && <p className={styles.error}>{erro}</p>}{" "}
            </div>

            <EntrarCadastrar onClick={handleSignIn}>
              {loadingAuth ? "Carregando..." : "Acessar"}
            </EntrarCadastrar>

            <div className={styles.loginCadastro}>
              <span>
                Ainda não tem cadastro?{" "}
                <Link href="/cadastro">Crie imediatamente.</Link>
              </span>
            </div>

            <span>Ou</span>

            <div className={styles.loginButtons}>
              <button type="button">
                <img src="/social/google.png" alt="Login Google" />
              </button>
              <button type="button">
                <img src="/social/facebook.png" alt="Login Facebook" />
              </button>
              <button type="button">
                <img src="/social/apple.png" alt="Login Apple" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
