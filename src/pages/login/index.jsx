import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Logo from "@/components/logo";
import EntrarCadastrar from "@/components/botoes/acesso";
import Header from "@/components/Header";
import styles from "./index.module.scss";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Aqui você pode realizar validações do formulário, se necessário

    // Exibe o e-mail registrado no console antes do redirecionamento
    console.log(`E-mail registrado: ${email}`);

    // Redireciona para a página inicial ("/")
    router.push("/");
  };

  return (
    <main className={styles["background"]}>
      <Header showMiniatura={false} showFotoPerfil={false} />

      <div className={styles.login}>
        <Logo />

        <div className={styles.formulario}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputCont}>
              <div className={styles.inputCameo}>
                <input
                  type="email"
                  placeholder="E-mail"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <div className={styles.inputCameo}>
                <input
                  type="password"
                  placeholder="Senha"
                  id="password"
                  name="password"
                  required
                />
                <div className={styles.contSenha}>
                  <Link href="#" className={styles.esqueciSenha}>
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>
            </div>

            <EntrarCadastrar onClick={() => console.log(123)}>
              Entrar
            </EntrarCadastrar>

            <div className={styles.loginCadastro}>
              <span>
                Ainda não tem cadastro?{" "}
                <Link href="/cadastro">Crie imediatamente.</Link>
              </span>
            </div>

            <span>Ou</span>

            <div className={styles.loginButtons}>
              <button>
                <img src="/social/google.png" alt="Login Google" />
              </button>
              <button>
                <img src="/social/facebook.png" alt="Login Facebook" />
              </button>
              <button>
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
