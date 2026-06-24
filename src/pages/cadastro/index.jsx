import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import Link from "next/link";
import Head from "next/head";
import Header from "@/components/Header";
import Button from "@/components/button";
import TextInput from "@/components/inputs/text-input";
import AtIcon from "@/components/icons/AtIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import EyeOffIcon from "@/components/icons/EyeOffIcon";
import bgDesktop from "@/components/background/background-desktop.jpg";
import bgMobile from "@/components/background/background-mobile.jpg";
import styles from "./index.module.scss";

const Cadastro = () => {
  const [handle, setHandle] = useState("");
  const [primeiroNome, setPrimeiroNome] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState({ field: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { signUp, loadingAuth } = useAuth();

  const clearError = () => setError({ field: "", message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();

    if (!primeiroNome || !nome || !email || !senha || !handle) {
      setError({
        field: "geral",
        message: "Todos os campos são obrigatórios.",
      });
      return;
    }

    try {
      await signUp(email, senha, `${primeiroNome} ${nome}`.trim(), handle);
    } catch (err) {
      if (err.message.includes("Esse nome de usuário já está em uso")) {
        setError({
          field: "handle",
          message: "Esse nome de usuário já está em uso. Escolha outro.",
        });
      } else if (err.message.includes("Email inválido")) {
        setError({ field: "email", message: "O e-mail fornecido é inválido." });
      } else if (
        err.message.includes("A senha deve ter pelo menos 8 caracteres")
      ) {
        setError({
          field: "senha",
          message: "A senha deve ter pelo menos 8 caracteres.",
        });
      } else {
        setError({
          field: "geral",
          message: "Ocorreu um erro ao cadastrar. Tente novamente.",
        });
      }
    }
  }

  return (
    <div className={styles.background}>
      <Head>
        <title>Criar conta | Cameo</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Junte-se à comunidade Cameo! Crie sua conta para receber sugestões personalizadas de filmes, gerenciar suas listas e compartilhar suas avaliações. É rápido e fácil—comece sua jornada cinematográfica hoje!"
        />
        <link
          rel="preload"
          as="image"
          href={bgDesktop.src}
          media="(min-width: 600px)"
        />
        <link
          rel="preload"
          as="image"
          href={bgMobile.src}
          media="(max-width: 599px)"
        />
      </Head>
      <Header showBuscar={false} showFotoPerfil={false} />
      <main className={styles.cadastro}>
        <div className={styles.contFormulario}>
          <div className={styles.formulario}>
            <div className={styles.tituloSenha}>
              <h1>Crie sua conta</h1>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.inputCont}>
                <TextInput
                  id="handle"
                  name="username"
                  aria-label="Usuário"
                  autoComplete="username"
                  type="text"
                  placeholder="usuário"
                  value={handle}
                  onChange={(e) => {
                    setHandle(e.target.value.toLowerCase());
                    clearError();
                  }}
                  required
                  width="100%"
                  prefix={<AtIcon size={18} color="rgba(255,255,255,0.4)" />}
                />
                {error.field === "handle" && (
                  <p className={styles.errorMsg}>{error.message}</p>
                )}

                <TextInput
                  id="primeiroNome"
                  name="given-name"
                  aria-label="Primeiro nome"
                  autoComplete="given-name"
                  type="text"
                  placeholder="Primeiro nome"
                  value={primeiroNome}
                  onChange={(e) => setPrimeiroNome(e.target.value)}
                  required
                  width="100%"
                />

                <TextInput
                  id="nome"
                  name="family-name"
                  aria-label="Nome completo"
                  autoComplete="family-name"
                  type="text"
                  placeholder="Nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  width="100%"
                />

                <TextInput
                  id="email"
                  name="email"
                  aria-label="E-mail"
                  autoComplete="email"
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                  required
                  width="100%"
                />
                {error.field === "email" && (
                  <p className={styles.errorMsg}>{error.message}</p>
                )}

                <TextInput
                  id="senha"
                  name="password"
                  aria-label="Senha"
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha (mínimo 8 caracteres)"
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
                {error.field === "senha" && (
                  <p className={styles.errorMsg}>{error.message}</p>
                )}
                {error.field === "geral" && (
                  <p className={styles.errorMsg}>{error.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="solid"
                label={loadingAuth ? "Carregando..." : "Cadastrar"}
                width="100%"
                disabled={loadingAuth}
              />

              <div className={styles.loginCadastro}>
                <span>
                  Já tenho cadastro. <Link href="/login">Entrar.</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cadastro;