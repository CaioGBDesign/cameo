import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/auth";
import { auth } from "@/services/firebaseConection";
import { sendPasswordResetEmail } from "firebase/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import Head from "next/head";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import Link from "next/link";
import EntrarCadastrar from "@/components/botoes/acesso";
import styles from "./index.module.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile();

  const { signIn, loadingAuth } = useContext(AuthContext);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Por favor, preencha o campo de e-mail.");
      return;
    }

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

  async function handleSignIn(e) {
    e.preventDefault();

    if (email !== "" && senha !== "") {
      try {
        await signIn(email, senha);
      } catch (error) {
        console.error("Erro capturado no componente de login:", error);
        if (error.code === "auth/user-not-found") {
          setErro("E-mail não encontrado. Faça o cadastro ou tente novamente.");
        } else if (error.code === "auth/wrong-password") {
          setErro("Senha incorreta. Verifique e tente novamente.");
        } else if (error.code === "auth/invalid-credential") {
          setErro(
            "Usuário não encontrado. Verifique seu e-mail ou faça seu registro."
          );
        } else {
          setErro(
            error.message || "Erro ao tentar fazer login. Tente novamente."
          );
        }
      }
    } else {
      setErro("Por favor, preencha todos os campos.");
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className={styles["background"]}>
      <Head>
        <title>Cameo - Login</title>
        <meta
          name="description"
          content="Acesse sua conta Cameo para gerenciar suas listas de filmes, receber recomendações e muito mais. Entre agora e descubra o que assistir!"
        />
      </Head>
      {isMobile ? (
        <Header showBuscar={false} showFotoPerfil={false} />
      ) : (
        <HeaderDesktop
          showBuscar={false}
          showMenu={false}
          showFotoPerfil={false}
        />
      )}
      <div className={styles.login}>
        {isMobile ? null : (
          <div className={styles.fundoFilmes}>
            <img
              src="/background/background-cameo-desktop.jpg"
              alt="background cameo"
            />
          </div>
        )}
        <div className={styles.contFormulario}>
          <div className={styles.formulario}>
            {isMobile ? null : (
              <div className={styles.tituloSenha}>
                <h2>Login!</h2>
              </div>
            )}
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
                {errorMessage && !email && (
                  <p style={{ color: "red" }}>{errorMessage}</p>
                )}
                {erro && <p>{erro}</p>}
                <div className={styles.inputCameo}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={styles.passwordToggle}
                  >
                    <img
                      src={
                        showPassword
                          ? "/icones/ver-senha.svg"
                          : "/icones/esconder-senha.svg"
                      }
                      alt="Toggle Password"
                    />
                  </button>
                </div>
                <div className={styles.contSenha}>
                  <button type="button" onClick={handleResetPassword}>
                    Esqueci minha senha
                  </button>
                </div>
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
            </form>
            {successMessage && (
              <p style={{ color: "green" }}>{successMessage}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
