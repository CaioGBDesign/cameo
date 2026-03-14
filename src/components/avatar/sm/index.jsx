import styles from "./index.module.scss";
import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import Image from "next/image";

const AvatarSm = ({ href = "/perfil", children }) => {
  const { user } = useContext(AuthContext);
  const isMobile = useIsMobile();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);

  const openModal = () => {
    setIsLoginModal(!user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setTimeout(() => {
      setModalOpen(false);
      setIsLoginModal(false);
    }, 300);
  };

  const conteudo = user ? (
    <div className={styles.fotoPerfilMiniatura}>
      <Image unoptimized
        src={user.avatarUrl}
        alt={user.nome ?? "Usuário"}
        layout="fill"
        objectFit="cover"
        quality={50}
      />
    </div>
  ) : (
    <div className={styles.entrar}>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fseta-direita.svg?alt=media&token=7cc2c37f-f8d8-4643-aefb-c5190b01e3e3"
        alt="seta usuário não logado"
      />
      <span>Entrar</span>
    </div>
  );

  return isMobile ? (
    <Link href={href} className={styles["foto-perfil"]}>
      {conteudo}
      {children}
    </Link>
  ) : (
    <div onClick={openModal} className={styles["foto-perfil"]}>
      {conteudo}
      {children}
    </div>
  );
};

export default AvatarSm;