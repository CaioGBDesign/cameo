import styles from "./index.module.scss";

const Titulolistagem = ({ titulolistagem, configuracoes = true }) => {

    return (
        <div className={styles.titulolistagem}>
            <div className={styles.quantidade}>
                <span className={styles.contagem}>8</span>
                <span className={styles.tituloPagina}>{titulolistagem}</span>
            </div>
            
            { configuracoes && <div className={configuracoes}>
                <img src="/icones/configuracoes.svg"/>
            </div>}
        </div>
    );
};

export default Titulolistagem;