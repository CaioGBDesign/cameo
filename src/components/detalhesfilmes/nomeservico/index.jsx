import styles from "./index.module.scss";

const NomeServico = ({ streaming }) => {

    return (
        <div className={styles.nomeServico}>

            <div className={styles.contServicos}>
                <img src={streaming} alt="Nome do streaming" />
            </div>

        </div>
    );
}

export default NomeServico;