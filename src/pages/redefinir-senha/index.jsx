import React, { useState } from "react";
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { useRouter } from "next/router"; // Importar o useRouter
import { useIsMobile } from "@/components/DeviceProvider";
import styles from "./index.module.scss";
import Head from "next/head";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";

const RedefinirSenha = () => {
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState(""); // Novo estado para senha de confirmação
  const [erro, setErro] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // Inicializar o useRouter
  const { oobCode } = router.query; // Extrair o oobCode da URL
  const isMobile = useIsMobile();

  const handleRedefinicao = async () => {
    if (!novaSenha || !senhaConfirmacao) {
      setErro("Por favor, preencha ambos os campos de senha.");
      return;
    }

    if (novaSenha !== senhaConfirmacao) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      // Verifique o código
      await verifyPasswordResetCode(getAuth(), oobCode);
      // Confirme a redefinição
      await confirmPasswordReset(getAuth(), oobCode, novaSenha);

      toast.success("Senha redefinida com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark", // Mude para "dark" se quiser o fundo escuro
      });

      // Redirecionar após a redefinição de senha
      router.push("/"); // Ajuste conforme necessário
    } catch (error) {
      setErro("Erro ao redefinir a senha:");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className={styles.background}>
      <Head>
        <title>Cameo - redefinir senha</title>
        <meta
          name="description"
          content="Recupere o acesso à sua conta com facilidade. Insira seu e-mail e siga as instruções para redefinir sua senha e voltar a explorar o universo cinematográfico do Cameo!"
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

      <div className={styles.RedefinirSenha}>
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
                <h2>Redefinir senha!</h2>
                <p>Escolha uma senha com o mínimo de 8 caracteres.</p>
              </div>
            )}

            <div className={styles.inputsSenha}>
              <div className={styles.inputCameo}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Nova Senha"
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
              <div className={styles.inputCameo}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={senhaConfirmacao}
                  onChange={(e) => setSenhaConfirmacao(e.target.value)} // Atualizar o estado da senha de confirmação
                  placeholder="Confirme a senha"
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
            </div>

            <button onClick={handleRedefinicao}>Redefinir Senha</button>
          </div>
          <div className={styles.erroDefinicao}>
            {erro && <p className={styles.error}>{erro}</p>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default RedefinirSenha;
