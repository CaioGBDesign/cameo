import styles from "./index.module.scss";
import Link from "next/link";

const Rede = ({ linkRede, titulo, valor, iconePerfil }) => {
  return (
    <Link href={linkRede} style={{ textDecoration: "none" }}>
      <div className={styles.rede}>
        <img src={iconePerfil} />
        <h1>{titulo}</h1>
        <p>{valor}</p>
      </div>
    </Link>
  );
};

export default Rede;
