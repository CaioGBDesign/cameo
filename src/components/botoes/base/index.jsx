import styles from "./index.module.scss";
import BotaoPrimario from "@/components/botoes/primarios";
import BotaoSecundario from "@/components/botoes/secundarios";

const BaseBotoes = ({
  TextoBotao,
  botaoPrimario = true,
  botaoSecundario = true,
}) => {
  return (
    <div className={styles.baseBotoes}>
      <div className={styles.contBotoes}>
        {botaoPrimario && (
          <div className={styles.botaoPrimario}>
            <BotaoPrimario
              textoBotaoPrimario={TextoBotao}
              idBprimario={"Salvar"}
            />
          </div>
        )}

        {botaoSecundario && (
          <div className={styles.botaoSecundario}>
            <BotaoSecundario
              textoBotaoSecundario={"Filtros"}
              idBsecundario={"filtros"}
              fonteSecundaria={"14px"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseBotoes;
