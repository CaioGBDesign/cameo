import styles from "./index.module.scss"

const BotaoPrimario = ({ textoBotaoPrimario, idBprimario, typeBprimario }) => {
    return (
        <button type={typeBprimario} id={idBprimario} className={styles['botao-primario']}>
            {textoBotaoPrimario}
        </button>
    );
};

export default BotaoPrimario