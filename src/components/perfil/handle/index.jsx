import { useContext } from "react";
import { AuthContext } from "@/contexts/auth";
import styles from "./index.module.scss";

const Handle = () => {
  const { user } = useContext(AuthContext);

  // Verifica se o usuário está definido e se tem um nome
  const handleUsuario = user && user.handle ? user.handle : "Nome de Usuário";

  return (
    <div className={styles.handle}>
      <span>@{handleUsuario}</span>
    </div>
  );
};

export default Handle;
