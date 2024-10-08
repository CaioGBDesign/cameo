import styles from "./index.module.scss";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth";
import Image from "next/image";

const FotoPerfil = ({ href = "/perfil", children }) => {
  const { user } = useContext(AuthContext);
  const avatarUrl = user && user.avatarUrl;
  const nomeUsuario = user && user.nome ? user.nome : "Nome de Usuário";

  return (
    <Link href={href} className={styles["foto-perfil"]}>
      <div className={styles.fotoPerfilMiniatura}>
        <Image
          src={avatarUrl || "/usuario/usuario.jpg"}
          alt={nomeUsuario}
          layout="fill" // Usa o layout fill
          objectFit="cover" // Ajusta a imagem para cobrir o contêiner
          quality={50} // Ajuste a qualidade se necessário
        />
      </div>
      {children}
    </Link>
  );
};

export default FotoPerfil;
