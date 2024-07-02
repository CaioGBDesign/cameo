import styles from "./index.module.scss";

const FundoTitulos = ({ capaAssistidos, tituloAssistidos }) => {

    return (
        <div className={styles.contCapa}>
            <div className={styles.capaAssistidos}>
                <img src={capaAssistidos} alt={tituloAssistidos} />
            </div>
        </div>
    );
}

export default FundoTitulos;