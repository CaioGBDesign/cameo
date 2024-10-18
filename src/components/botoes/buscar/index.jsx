import styles from "./index.module.scss";
import Link from "next/link";

const BotaoBuscar = ({ children }) => {
  return (
    <Link href="/busca" className={styles.miniatura}>
      <img src="/icones/search.svg" />
      {children}
    </Link>
  );
};

export default BotaoBuscar;