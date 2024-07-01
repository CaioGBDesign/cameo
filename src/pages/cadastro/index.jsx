import { useState } from "react";
import styles from "./index.module.scss";
import EntrarCadastrar from "@/components/botoes/acesso";
import Header from "@/components/Header";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <main className={styles["background"]}>
      {/* Header */}
      <Header showMiniatura={true} showFotoPerfil={false} />

      <div className={styles.cadastro}>

        {/* form */}
        <div className={styles.formulario}>
          <form>
            <div className={styles.inputCameo}>
              <input type="name" placeholder="nome de usuário" id="name" name="name" required />
            </div>

            <div className={styles.inputCameo}>
              <input type="email" placeholder="e-mail" id="email" name="email" required />
            </div>

            <div className={styles.inputCameo}>
              <input type={showPassword ? "text" : "password"} placeholder="senha" id="password" name="password" required />
              <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
                <img
                  src={showPassword ? "/olhos/mostrar.svg" : "/olhos/esconder.svg"}
                  alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
                />
              </span>
            </div>

            <div className={styles.inputCameo}>
              <input type={showConfirmPassword ? "text" : "password"} placeholder="confirmação de senha" id="confirmPassword" name="confirmPassword" required />
              <span className={styles.eyeIcon} onClick={toggleConfirmPasswordVisibility}>
                <img
                  src={showConfirmPassword ? "/olhos/mostrar.svg" : "/olhos/esconder.svg"}
                  alt={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                />
              </span>
            </div>
            
            <div className={styles.inputCameo}>
              <select id="gender" name="gender" required>
                <option value="">Com qual gênero você se identifica?</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <EntrarCadastrar>Cadastrar</EntrarCadastrar>

            <div className={styles.loginCadastro}>
              <span>Já tenho cadastro. <a href="/login">Entrar.</a></span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;