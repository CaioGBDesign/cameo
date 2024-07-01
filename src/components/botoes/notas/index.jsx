import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";

const NotasFilmes = ({ estrelas }) => {
    return (
        <div className={styles.notasFilmes}>
            <div className={styles.estrelas}>
                <Estrelas estrelas={estrelas} starWidth={"15px"}></Estrelas>
            </div>
            <div className={styles.medianotas}>
                <span>Média {estrelas}</span>
            </div>
        </div>
    );
};

export default NotasFilmes;