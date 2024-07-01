import styles from "./index.module.scss";

const TitulosFilmes = ({ titulofilme, generofilme, duracaofilme }) => {

    return (
        <div className={styles.titulosFilmes}>
            <h1>{titulofilme}</h1>

            <div className={styles.generoDuracao}>
                <span>{generofilme}</span>
                <span> • </span>
                <span>{duracaofilme}</span>
            </div>
        </div>
    );
}

export default TitulosFilmes;