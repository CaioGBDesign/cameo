import React, { useState, useRef, useEffect } from "react";
import styles from "./index.module.scss";
import LoginDesktop from "@/components/login-desktop";
import CadastroDesktop from "@/components/cadastro-desktop";
import Logo from "@/components/logo";

const ModalLoginCadastro = ({ closeModal }) => {
  const [isLogin, setIsLogin] = useState(true);
  const modalRef = useRef(null); // Referência para o modal

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  // Efeito para fechar o modal ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    // Adiciona o event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Remove o event listener ao desmontar o componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  return (
    <div className={styles.modalLC}>
      <div className={styles.contModalLC} ref={modalRef}>
        <div className={styles.LoginCadastroModal}>
          <div className={styles.fecharDesktop}>
            <button onClick={closeModal}>
              {" "}
              {/* Adicione o onClick aqui */}
              <img src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Ffechar-filtros.svg?alt=media&token=acbd8385-64e1-4a68-96a1-748bb560ca46" />
            </button>
          </div>

          <Logo />

          <div
            className={styles.slideModalLC}
            style={{ height: isLogin ? "340px" : "500px" }}
          >
            <div
              className={styles.contLoginCadastroM}
              style={{ left: isLogin ? "5px" : "2px" }}
            >
              {isLogin ? (
                <div className={styles.loginDesktopM}>
                  <LoginDesktop closeModal={closeModal} />
                  <div className={styles.slideLoginCadastro}>
                    <p>
                      Ainda não tem cadastro?{" "}
                      <span onClick={toggleMode}>Crie imediatamente.</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className={styles.cadastroDesktopM}>
                  <CadastroDesktop closeModal={closeModal} />
                  <div className={styles.slideLoginCadastro}>
                    <p>
                      Já tenho cadastro.{" "}
                      <span onClick={toggleMode}>Entrar.</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLoginCadastro;
