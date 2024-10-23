import styles from "./index.module.scss";
import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import Image from "next/image";
import DadosPessoaisModalDesktop from "@/components/dadospessoais-desktop";

const FotoPerfil = ({ href = "/perfil", children }) => {
  const { user } = useContext(AuthContext);
  const avatarUrl = user && user.avatarUrl;
  const nomeUsuario = user && user.nome ? user.nome : "Nome de Usuário";

  const isMobile = useIsMobile();

  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar o modal
  const [isClosing, setIsClosing] = useState(false);

  const openModal = () => {
    setModalOpen(true); // Abre o modal
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModalOpen(false); // Fecha após a animação
    }, 300); // Duração da animação
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

      {isModalOpen && (
        <DadosPessoaisModalDesktop
          closeModal={closeModal}
          isClosing={isClosing}
        />
      )}
    </>
  );
};

export default FotoPerfil;
