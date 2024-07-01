import styles from "./index.module.scss";

const Titulolistagem = ({ titulolistagem, configuracoes = true }) => {

    return (
        <div className={styles.titulolistagem}>
            <span>{titulolistagem}</span>
            
            { configuracoes && <div className={configuracoes}>
                <img src="/icones/configuracoes.svg"/>
            </div>}
        </div>
    );
};

export default Titulolistagem;