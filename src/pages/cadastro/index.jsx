import { useState, useEffect, useRef } from "react";

function maskEmail(email) {
  const at = email.indexOf("@");
  const local = email.slice(0, at);
  const domain = email.slice(at);
  const visible = Math.min(3, local.length);
  const masked = local.slice(0, visible) + "*".repeat(Math.max(local.length - visible, 3));
  return masked + domain;
}
import { useAuth } from "@/contexts/auth";
import Link from "next/link";
import Head from "next/head";
import Header from "@/components/Header";
import Button from "@/components/button";
import TextInput from "@/components/inputs/text-input";
import OtpInput from "@/components/inputs/otp-input";
import AtIcon from "@/components/icons/AtIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import EyeOffIcon from "@/components/icons/EyeOffIcon";
import bgDesktop from "@/components/background/background-desktop.jpg";
import bgMobile from "@/components/background/background-mobile.jpg";
import styles from "./index.module.scss";

const RESEND_COOLDOWN = 60;

const Cadastro = () => {
  const [handle, setHandle] = useState("");
  const [primeiroNome, setPrimeiroNome] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState({ field: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [step, setStep] = useState("form");
  const [uid, setUid] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef(null);

  const { signUp, signIn, loadingAuth } = useAuth();

  const clearError = () => setError({ field: "", message: "" });

  useEffect(() => {
    return () => clearInterval(cooldownRef.current);
  }, []);

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();

    if (!primeiroNome || !nome || !email || !senha || !handle) {
      setError({ field: "geral", message: "Todos os campos são obrigatórios." });
      return;
    }

    try {
      const nomeCompleto = `${primeiroNome} ${nome}`.trim();
      const retornoUid = await signUp(email, senha, nomeCompleto, handle);
      setUid(retornoUid);
      setStep("otp");
      startCooldown();
    } catch (err) {
      if (err.message.includes("Esse nome de usuário já está em uso")) {
        setError({ field: "handle", message: "Esse nome de usuário já está em uso. Escolha outro." });
      } else if (err.message.includes("Email inválido")) {
        setError({ field: "email", message: "O e-mail fornecido é inválido." });
      } else if (err.message.includes("A senha deve ter pelo menos 8 caracteres")) {
        setError({ field: "senha", message: "A senha deve ter pelo menos 8 caracteres." });
      } else {
        setError({ field: "geral", message: "Ocorreu um erro ao cadastrar. Tente novamente." });
      }
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setOtpError("");

    if (otpCode.length !== 6) {
      setOtpError("O código deve ter 6 dígitos.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, code: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.expired || data.tooManyAttempts) {
          setOtpCode("");
        }
        setOtpError(data.error || "Erro ao verificar código.");
        return;
      }

      // OTP válido — faz login automático com credenciais em memória
      await signIn(email, senha, { successMessage: "Conta criada com sucesso!" });
    } catch {
      setOtpError("Erro inesperado. Tente novamente.");
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setOtpError("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, email, nome: primeiroNome }),
      });

      if (!res.ok) {
        const data = await res.json();
        setOtpError(data.error || "Erro ao reenviar código.");
        return;
      }

      startCooldown();
    } catch {
      setOtpError("Erro ao reenviar. Tente novamente.");
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
        <link rel="preload" as="image" href={bgDesktop.src} media="(min-width: 600px)" />
        <link rel="preload" as="image" href={bgMobile.src} media="(max-width: 599px)" />
      </Head>
      <Header showBuscar={false} showFotoPerfil={false} />

      <main className={styles.cadastro}>
        <div className={styles.contFormulario}>
          <div className={styles.formulario}>

            {step === "form" && (
              <>
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
                      onChange={(e) => { setHandle(e.target.value.toLowerCase()); clearError(); }}
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
                      onChange={(e) => { setEmail(e.target.value); clearError(); }}
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
                          {showPassword
                            ? <EyeOffIcon size={20} color="rgba(255,255,255,0.4)" />
                            : <EyeIcon size={20} color="rgba(255,255,255,0.4)" />
                          }
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
              </>
            )}

            {step === "otp" && (
              <>
                <div className={styles.tituloSenha}>
                  <h1>Verifique seu e-mail</h1>
                </div>

                <form onSubmit={handleVerifyOtp}>
                  <div className={styles.inputCont}>
                    <p className={styles.otpInfo}>
                      Enviamos um código de 6 dígitos para{" "}
                      <strong>{maskEmail(email)}</strong>. Insira abaixo para ativar sua conta.
                    </p>

                    <OtpInput
                      value={otpCode}
                      onChange={(code) => { setOtpCode(code); setOtpError(""); }}
                      onComplete={(code) => setOtpCode(code)}
                      disabled={otpLoading}
                      error={!!otpError}
                    />

                    {otpError && <p className={styles.errorMsg}>{otpError}</p>}

                    <div className={styles.otpReenviar}>
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={cooldown > 0}
                        className={styles.otpReenviarBtn}
                      >
                        {cooldown > 0
                          ? `Reenviar código em ${cooldown}s`
                          : "Reenviar código"}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="solid"
                    label={otpLoading ? "Verificando..." : "Confirmar e entrar"}
                    width="100%"
                    disabled={otpLoading || otpCode.length !== 6}
                  />

                  <div className={styles.loginCadastro}>
                    <span>
                      <button
                        type="button"
                        className={styles.voltarBtn}
                        onClick={() => { setStep("form"); setOtpCode(""); setOtpError(""); }}
                      >
                        Voltar ao cadastro
                      </button>
                    </span>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default Cadastro;