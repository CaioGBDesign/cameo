import styles from "./index.module.scss";
import Link from "next/link"; 

const FotoPerfil = ({ href = '/perfil', children }) => {
  return (
    <Link href={href} className={styles['foto-perfil']}>
      <img src="/usuario/usuario.jpeg" alt="Nome do usuario" />
      {children}
    </Link>
  );
};

export default FotoPerfil;