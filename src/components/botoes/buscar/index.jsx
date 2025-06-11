import styles from "./index.module.scss";
import Link from "next/link";

const BotaoBuscar = ({ children }) => {
  return (
    <Link href="/busca" className={styles.miniatura}>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fsearch.svg?alt=media&token=7c5d22d6-7e4e-42d4-ab53-f0f1f3d3acbd"
        alt="buscar filme"
      />
      {children}
    </Link>
  );
};

export default BotaoBuscar;
