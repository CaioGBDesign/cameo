import styles from "./index.module.scss";
import CardsNotas from "@/components/detalhesfilmes/cardsNotas";

const NotasCameo = () => {

    const simulacaoBack = [
        {
            url:"/usuario/usuario.jpeg",
            nome:"Caio Goulart",
            nota:"3"
        },
        {
            url:"/usuario/usuario.jpeg",
            nome:"Caio Goulart",
            nota:"3"
        }
    ]

    return (
        <div className={styles.notasCameo}>

            <div className={styles.contNotas}>
                <h3>Notas do time</h3>

                <div className={styles.notas}>
                    { simulacaoBack.map((avaliadores) => <CardsNotas fotoAvaliador={avaliadores.url} NomeAvaliador={avaliadores.nome} estrelas={avaliadores.nota}></CardsNotas> )}
                </div>
            </div>

        </div>
    );
}

export default NotasCameo;