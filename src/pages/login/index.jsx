import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { auth } from "@/services/firebaseConection";
import { sendPasswordResetEmail } from "firebase/auth";
import Head from "next/head";
import Header from "@/components/Header";
import Link from "next/link";
import Button from "@/components/button";
import TextInput from "@/components/inputs/text-input";
import EyeIcon from "@/components/icons/EyeIcon";
import EyeOffIcon from "@/components/icons/EyeOffIcon";
import styles from "./index.module.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, loadingAuth } = useAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Por favor, preencha o campo de e-mail.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Um e-mail de redefinição de senha foi enviado.");
      setEmail("");
    } catch {
      setError("Erro ao enviar e-mail. Verifique se o e-mail está correto.");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await signIn(email, senha);
    } catch (err) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("E-mail ou senha incorretos, tente novamente.");
      } else {
        setError("Erro ao tentar fazer login. Tente novamente.");
      }
    }
  };

  return (
    <main className={styles.background}>
      <Head>
        <title>Cameo - Login</title>
        <meta
          name="description"
          content="Acesse sua conta Cameo para gerenciar suas listas de filmes, receber recomendações e muito mais. Entre agora e descubra o que assistir!"
        />
      </Head>
      <Header showBuscar={false} showFotoPerfil={false} />
      <div className={styles.login}>
        <div className={styles.contFormulario}>
          <div className={styles.formulario}>
            <div className={styles.tituloSenha}>
              <span>Vamos começar</span>
              <h1>Acesse sua conta</h1>
            </div>
            <form onSubmit={handleSignIn}>
              <div className={styles.inputCont}>
                <TextInput
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  width="100%"
                />
                <TextInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  width="100%"
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className={styles.passwordToggle}
                    >
                      {showPassword ? (
                        <EyeOffIcon size={20} color="rgba(255,255,255,0.4)" />
                      ) : (
                        <EyeIcon size={20} color="rgba(255,255,255,0.4)" />
                      )}
                    </button>
                  }
                />
                {error && <p className={styles.errorMsg}>{error}</p>}
                {successMessage && (
                  <p className={styles.successMsg}>{successMessage}</p>
                )}
                <div className={styles.contSenha}>
                  <button type="button" onClick={handleResetPassword}>
                    Esqueci minha senha
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="solid"
                label={loadingAuth ? "Carregando..." : "Acessar"}
                width="100%"
                disabled={loadingAuth}
              />

              <div className={styles.loginCadastro}>
                <span>
                  Ainda não tem cadastro?{" "}
                  <Link href="/cadastro">Crie imediatamente.</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
