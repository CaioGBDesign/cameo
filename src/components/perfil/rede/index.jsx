import styles from "./index.module.scss";
import Link from "next/link";

const Rede = ({ linkRede, titulo, valor, iconePerfil }) => {
    return (
        <Link href={linkRede} style={{ textDecoration: 'none' }}>
            <div className={styles.rede}>
                <img src={iconePerfil} />
                <span>{titulo}</span>
                <span>{valor}</span>
            </div>
        </Link>
    );
}

export default Rede;