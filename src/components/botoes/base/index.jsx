import styles from "./index.module.scss";
import BotaoPrimario from "@/components/botoes/primarios";
import BotaoSecundario from "@/components/botoes/secundarios";

const BaseBotoes = ({ botaoSecundario = true }) => {

    return (
        <div className={styles.baseBotoes}>

            <div className={styles.contBotoes}>
                <div className={styles.botaoPrimario}>
                    <BotaoPrimario textoBotaoPrimario={"Salvar alterações"} idBprimario={"Salvar"} />
                </div>

                { botaoSecundario && <div className={styles.botaoSecundario}>
                    <BotaoSecundario textoBotaoSecundario={"Filtros"} idBsecundario={"filtros"} />
                </div>}
            </div>
            
        </div>
    );
}

export default BaseBotoes;