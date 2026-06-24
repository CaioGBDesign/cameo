import styles from "./index.module.scss";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth";
import Image from "next/image";

const AvatarSm = ({ href = "/perfil", children }) => {
  const { user } = useContext(AuthContext);

  const conteudo = user ? (
    <div className={styles.fotoPerfilMiniatura}>
      {user.avatarUrl ? (
        <Image unoptimized
          src={user.avatarUrl}
          alt={user.nome ?? "Usuário"}
          layout="fill"
          objectFit="cover"
          quality={50}
        />
      ) : (
        <div className={styles.avatarPlaceholder} aria-label={user.nome ?? "Usuário"} />
      )}
    </div>
  ) : (
    <div className={styles.entrar}>
      <span>Entrar</span>
    </div>
  );

  const destino = user ? href : "/login";

  return (
    <Link href={destino} className={styles["foto-perfil"]}>
      {conteudo}
      {children}
    </Link>
  );
};

export default AvatarSm;