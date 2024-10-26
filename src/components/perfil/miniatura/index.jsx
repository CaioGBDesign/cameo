import styles from "./index.module.scss";
import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import Image from "next/image";
import DadosPessoaisModalDesktop from "@/components/dadospessoais-desktop";
import ModalLoginCadastro from "@/components/modais/ModalLoginCadastro";

const FotoPerfil = ({ href = "/perfil", children }) => {
  const { user } = useContext(AuthContext);
  const avatarUrl = user && user.avatarUrl;
  const nomeUsuario = user && user.nome ? user.nome : "Nome de Usuário";

  const isMobile = useIsMobile();

  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar o modal
  const [isClosing, setIsClosing] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false); // Estado para controle do modal de login

  const openModal = () => {
    if (user) {
      setIsLoginModal(false); // Se o usuário está logado, não precisamos do modal de login
      setModalOpen(true); // Abre o modal de dados pessoais
    } else {
      setIsLoginModal(true); // Se o usuário não está logado, abre o modal de login
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModalOpen(false); // Fecha após a animação
      setIsLoginModal(false); // Reseta o estado do modal de login
    }, 300);
  };

  return (
    <>
      {isMobile ? (
        <Link href={href} className={styles["foto-perfil"]}>
          <div className={styles.fotoPerfilMiniatura}>
            <Image
              src={avatarUrl || "/usuario/usuario.jpg"}
              alt={nomeUsuario}
              layout="fill"
              objectFit="cover"
              quality={50}
            />
          </div>
          {children}
        </Link>
      ) : (
        <div onClick={openModal} className={styles["foto-perfil"]}>
          <div className={styles.fotoPerfilMiniatura}>
            <Image
              src={avatarUrl || "/usuario/usuario.jpg"}
              alt={nomeUsuario}
              layout="fill"
              objectFit="cover"
              quality={50}
            />
          </div>
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
