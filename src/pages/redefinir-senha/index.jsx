import React, { useState } from "react";
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import styles from "./index.module.scss";
import Header from "@/components/Header";

const RedefinirSenha = () => {
  const [novaSenha, setNovaSenha] = useState("");
  const [erro, setErro] = useState(null);
  const auth = getAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Extrair o código da URL
  const queryParams = new URLSearchParams(location.search);
  const codigo = queryParams.get("oobCode");

  const handleRedefinicao = async () => {
    if (!novaSenha) {
      setErro("Por favor, insira uma nova senha.");
      return;
    }

    try {
      // Verifique o código
      await verifyPasswordResetCode(auth, codigo);
      // Confirme a redefinição
      await confirmPasswordReset(auth, codigo, novaSenha);
      alert("Senha redefinida com sucesso!");
      // Redirecionar após a redefinição de senha
      // Exemplo de redirecionamento:
      window.location.href = "/login"; // Ajuste conforme necessário
    } catch (error) {
      setErro("Erro ao redefinir a senha: " + error.message);
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
          <div className={styles.inputCameo}>
            <input
              type={showPassword ? "text" : "password"} // Modificação aqui
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

          <button onClick={handleRedefinicao}>Redefinir Senha</button>
          {erro && <p className={styles.error}>{erro}</p>}
        </div>
      </div>
    </main>
  );
};

export default RedefinirSenha;
