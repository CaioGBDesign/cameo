import styles from "./index.module.scss";
import Link from "next/link"; 

const CardsPerfil = ({ linkDadosPerfil, imagemPerfil = true, DadosdoPerfil, mostrarSegundoSpan = true }) => {
    return (
        <Link href={linkDadosPerfil} className={styles.linkDados}>
            <div className={styles.botaoPerfil}>
                {imagemPerfil && <div className={styles.iconePerfil}>
                    <img src={imagemPerfil} alt="Ícone do perfil" />
                </div>}
                <div className={styles.dadosPerfil}>
                    <p>{DadosdoPerfil}</p>
                    <span>{mostrarSegundoSpan ? 'e-mail, senha...' : ''}</span>
                </div>
            </div>
        </Link>
    );
}

export default CardsPerfil;