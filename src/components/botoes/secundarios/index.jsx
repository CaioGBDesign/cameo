import styles from "./index.module.scss"

const BotaoSecundario = ({ textoBotaoSecundario, idBsecundario, typeBsecundario }) => {
    return (
        <button type={typeBsecundario} id={idBsecundario} className={styles['botao-secundario']}>
            {textoBotaoSecundario}
        </button>
    );
};

export default BotaoSecundario