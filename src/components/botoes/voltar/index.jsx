import styles from "./index.module.scss";
import { useRouter } from "next/navigation";

const Botaovoltar = ({ children }) => {
  const router = useRouter();

  function RouterBack() {
    router.back();
  }

  return (
    <button onClick={RouterBack} className={styles["botao-voltar"]}>
      <img src="icones/voltar.svg" />
      {children}
    </button>
  );
};

export default Botaovoltar;
