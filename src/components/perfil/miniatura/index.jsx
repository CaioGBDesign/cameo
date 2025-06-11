import styles from "./index.module.scss";
import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import Image from "next/image";
import DadosPessoaisModalDesktop from "@/components/dadospessoais-desktop";
import ModalLoginCadastro from "@/components/modais/ModalLoginCadastro";

const FotoPerfil = ({ href = "/perfil", children }) => {
  const { user } = useContext(AuthContext); // Pega as informações do usuário
  const avatarUrl = user && user.avatarUrl; // URL da imagem de avatar
  const nomeUsuario = user && user.nome ? user.nome : "Nome de Usuário"; // Nome do usuário (se houver)

  const isMobile = useIsMobile(); // Verifica se o dispositivo é mobile

  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar o modal
  const [isClosing, setIsClosing] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false); // Estado para controle do modal de login

  const openModal = () => {
    if (user) {
      setIsLoginModal(false); // Se o usuário está logado, abre o modal de dados pessoais
      setModalOpen(true);
    } else {
      setIsLoginModal(true); // Se o usuário não está logado, abre o modal de login
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModalOpen(false); // Fecha o modal após a animação
      setIsLoginModal(false); // Reseta o estado do modal de login
    }, 300);
  };

  return (
    <>
      {isMobile ? (
        // Para dispositivos móveis, sempre renderiza o link com foto de perfil
        <Link href={href} className={styles["foto-perfil"]}>
          {user ? (
            <div className={styles.fotoPerfilMiniatura}>
              <Image
                src={avatarUrl}
                alt={nomeUsuario}
                layout="fill"
                objectFit="cover"
                quality={50}
              />
            </div>
          ) : (
            // Se o usuário não estiver logado, renderiza o texto "Login"
            <div className={styles.entrar}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fseta-direita.svg?alt=media&token=7cc2c37f-f8d8-4643-aefb-c5190b01e3e3"
                alt="seta  usuário não logado"
              />
              <span>Entrar</span>
            </div>
          )}
          {children}
        </Link>
      ) : (
        // Para dispositivos desktop, ao clicar na foto de perfil ou no botão "Login"
        <div onClick={openModal} className={styles["foto-perfil"]}>
          {user ? (
            <div className={styles.fotoPerfilMiniatura}>
              <Image
                src={avatarUrl}
                alt={nomeUsuario}
                layout="fill"
                objectFit="cover"
                quality={50}
              />
            </div>
          ) : (
            // Se o usuário não estiver logado, renderiza o texto "Login"
            <div className={styles.entrar}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fseta-direita.svg?alt=media&token=7cc2c37f-f8d8-4643-aefb-c5190b01e3e3"
                alt="seta  usuário não logado"
              />
              <span>Entrar</span>
            </div>
          )}
          {children}
        </div>
      )}

      {isModalOpen && !isLoginModal && (
        <DadosPessoaisModalDesktop
          closeModal={closeModal}
          isClosing={isClosing}
        />
      )}
      {isModalOpen && isLoginModal && (
        <ModalLoginCadastro closeModal={closeModal} isClosing={isClosing} />
      )}
    </>
  );
};

export default FotoPerfil;
