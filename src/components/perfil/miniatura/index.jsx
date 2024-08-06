import styles from "./index.module.scss";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth";

const FotoPerfil = ({ href = "/perfil", children }) => {
  const { user } = useContext(AuthContext);
  const avatarUrl = user && user.avatarUrl;

  return (
    <Link href={href} className={styles["foto-perfil"]}>
      <img src={avatarUrl || "/usuario/usuario.jpg"} alt="Nome do usuário" />
      {children}
    </Link>
  );
};

export default FotoPerfil;
