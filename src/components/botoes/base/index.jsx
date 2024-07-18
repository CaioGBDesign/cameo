import styles from "./index.module.scss";
import BotaoPrimario from "@/components/botoes/primarios";
import BotaoSecundario from "@/components/botoes/secundarios";

const BaseBotoes = ({
  TextoBotao,
  botaoPrimario = true,
  botaoSecundario = true,
  onClick,
  onClickModal,
}) => {
  return (
    <div className={styles.baseBotoes}>
      <div className={styles.contBotoes}>
        {botaoPrimario && (
          <div className={styles.botaoPrimario}>
            <BotaoPrimario
              textoBotaoPrimario={TextoBotao}
              idBprimario={"Salvar"}
              onClick={onClick} // Adicione esta linha
            />
          </div>
        )}

        {botaoSecundario && (
          <div className={styles.botaoSecundario}>
            <BotaoSecundario
              textoBotaoSecundario={"Filtros"}
              fonteSecundaria={"14px"}
              onClick={onClickModal} // Adiciona onClickModal para abrir o modal
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseBotoes;
