import { useContext } from "react";
import { AuthContext } from "@/contexts/auth";
import styles from "./index.module.scss";

const NomeUsuario = () => {
  const { user } = useContext(AuthContext);

  // Verifica se o usuário está definido e se tem um nome
  const nomeUsuario = user && user.nome ? user.nome : "Nome de Usuário";

  return (
    <div className={styles.nomeUsuario}>
      <h1 className={styles.nome}>{nomeUsuario}</h1>
    </div>
  );
};

export default NomeUsuario;
