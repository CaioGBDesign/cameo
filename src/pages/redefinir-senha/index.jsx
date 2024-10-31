import React, { useState } from "react";
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { useRouter } from "next/router"; // Importar o useRouter
import styles from "./index.module.scss";
import Header from "@/components/Header";

const RedefinirSenha = () => {
  const [novaSenha, setNovaSenha] = useState("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState(""); // Novo estado para senha de confirmação
  const [erro, setErro] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // Inicializar o useRouter
  const { oobCode } = router.query; // Extrair o oobCode da URL

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
      alert("Senha redefinida com sucesso!");
      // Redirecionar após a redefinição de senha
      router.push("/login"); // Ajuste conforme necessário
    } catch (error) {
      setErro("Erro ao redefinir a senha:");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className={styles.background}>
      <Header showMiniatura={true} showFotoPerfil={false} />
      <div className={styles.RedefinirSenha}>
        <div className={styles.formulario}>
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
    </main>
  );
};

export default RedefinirSenha;
