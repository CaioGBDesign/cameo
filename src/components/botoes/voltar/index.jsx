import styles from "./index.module.scss";
import { useRouter } from "next/router";

const Botaovoltar = ({ children }) => {
  const router = useRouter();

  function routerBack() {
    router.back();
  }

  return (
    <button onClick={routerBack} className={styles["botao-voltar"]}>
      <img src="/icones/voltar.svg" alt="Voltar" />
      {children}
    </button>
  );
};

export default Botaovoltar;
