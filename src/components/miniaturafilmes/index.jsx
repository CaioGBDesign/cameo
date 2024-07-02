import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";

const Miniaturafilmes = ({ capaminiatura, titulofilme, mostrarEstrelas = true }) => {

    return (
        <div className={styles.miniaturafilmes}>

            <div className={styles.capaminiatura}>
                <img src={capaminiatura} alt={titulofilme} />
            </div>

            { mostrarEstrelas && <div className={styles.tamanhoestrelas}>
                <Estrelas estrelas={"3"} starWidth={"10px"} />
            </div>}
        </div>
    );
};

export default Miniaturafilmes;