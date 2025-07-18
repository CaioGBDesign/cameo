import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import EntrarCadastrar from "@/components/botoes/acesso";
import { AuthContext } from "@/contexts/auth";

const CadastroDesktop = ({ closeModal }) => {
  const [handle, setHandle] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [handleError, setHandleError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { signUp, loadingAuth } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();

    // Limpa mensagens de erro ao tentar submeter
    setError("");
    setHandleError("");
    setEmailError("");
    setErrorPassword("");

    if (nome !== "" && email !== "" && senha !== "" && handle !== "") {
      try {
        await signUp(email, senha, nome, handle);
        closeModal(); // Fecha o modal após o cadastro bem-sucedido
        // Redireciona ou exibe uma mensagem de sucesso aqui, se necessário
      } catch (err) {
        console.log("Erro recebido:", err);
        if (err.message.includes("Esse nome de usuário já está em uso")) {
          setHandleError("Esse nome de usuário já está em uso. Escolha outro.");
        } else if (err.message.includes("Email inválido")) {
          setEmailError("O e-mail fornecido é inválido.");
        } else if (
          err.message.includes("A senha deve ter pelo menos 8 caracteres.")
        ) {
          setErrorPassword("A senha deve ter pelo menos 8 caracteres.");
        } else {
          setError("Ocorreu um erro ao cadastrar. Tente novamente.");
        }
      }
    } else {
      setError("Todos os campos são obrigatórios.");
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className={styles["background"]}>
      <div className={styles.cadastro}>
        <div className={styles.formulario}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputCameo}>
              <div className={styles.imgHandle}>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fhandle-cadastro.svg?alt=media&token=80384928-1f15-40c9-80d7-02d04ec943da"
                  alt="@"
                />
              </div>
              <input
                type="handle" // Corrigido para "text"
                placeholder="usuário"
                value={handle}
                onChange={(e) => {
                  const lowerCaseHandle = e.target.value.toLowerCase();
                  setHandle(lowerCaseHandle);
                  setHandleError(""); // Limpa o erro ao começar a digitar
                }}
                required
              />
            </div>
            {handleError && (
              <div className={styles.error}>
                <p>{handleError}</p>
              </div>
            )}

            <div className={styles.inputCameo}>
              <input
                type="name" // Corrigido para "text"
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(""); // Limpa o erro ao começar a digitar
                }}
                required
              />
            </div>
            {emailError && (
              <div className={styles.error}>
                <p>{emailError}</p>
              </div>
            )}

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
                      ? "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fver-senha.svg?alt=media&token=5912f675-7fdd-400c-bef7-623002f35fa4"
                      : "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fesconder-senha.svg?alt=media&token=139f4e7c-7b25-4719-9bbb-ea8387de6183"
                  }
                  alt="Toggle Password"
                />
              </button>
            </div>
            {errorPassword && (
              <div className={styles.error}>
                <p>{errorPassword}</p>
              </div>
            )}

            <EntrarCadastrar onClick={handleSubmit}>
              {loadingAuth ? "Carregando..." : "Cadastrar"}
            </EntrarCadastrar>

            {error && (
              <div className={styles.errorDesconhecido}>
                <p>{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
};

export default CadastroDesktop;
