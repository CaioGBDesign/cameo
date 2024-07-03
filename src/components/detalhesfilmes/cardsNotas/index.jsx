import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";

const CardsNotas = ({ NomeAvaliador, estrelas, fotoAvaliador }) => {

    return (
        <div className={styles.cardsNotas}>

            <div className={styles.contNotas}>

                <div className={styles.avaliador}>
                    <img src={fotoAvaliador} alt="Nome do usuario" />
                </div>

                <p>{NomeAvaliador}</p>

                <Estrelas estrelas={estrelas} starWidth={"10px"}></Estrelas>

            </div>

        </div>
    );
}

export default CardsNotas;