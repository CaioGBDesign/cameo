import styles from "./index.module.scss";
import Link from "next/link";

const BotaoBuscarDesktop = ({ children }) => {
  return (
    <Link href="/busca" className={styles.miniatura}>
      <img src="/icones/search.svg" />
      {children}
      <p>Buscar filmes</p>
    </Link>
  );
};

export default BotaoBuscarDesktop;
