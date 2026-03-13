import styles from "./index.module.scss";
import Link from "next/link";

const Miniatura = ({ children }) => (
  <Link href="/filme-aleatorio" className={styles.miniatura}>
    <img src="/logo-cameo.svg" alt="Cameo logo" />
    {children}
  </Link>
);

export default Miniatura;
