import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";

const NotasFilmes = ({ estrelas }) => {
    return (
        <div className={styles.notasFilmes}>
            <div className={styles.estrelas}>
                <Estrelas estrelas={estrelas} starWidth={"14px"}></Estrelas>
            </div>
        </div>
    );
};

export default NotasFilmes;