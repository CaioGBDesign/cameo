import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import BotaoPrimario from "@/components/botoes/primarios";
import BotaoSecundario from "@/components/botoes/secundarios";

const BaseBotoes = ({
  TextoBotao,
  botaoPrimario = true,
  botaoSecundario = true,
  onClick,
  onClickModal,
  filtrosCount,
}) => {
  // Estado para controlar se o botão primário deve ser exibido
  const [exibirBotaoPrimario, setExibirBotaoPrimario] = useState(true);
  // Estado para controlar se a div 'resgateFiltro' deve ser exibida
  const [exibirResgateFiltro, setExibirResgateFiltro] = useState(false);

  // useEffect para verificar a presença de "movieSearchUrl" no localStorage
  useEffect(() => {
    const movieSearchUrl = localStorage.getItem("movieSearchUrl");
    if (movieSearchUrl) {
      setExibirBotaoPrimario(false); // Não exibir o botão primário se existir "movieSearchUrl"
      setExibirResgateFiltro(true); // Exibir a div "resgateFiltro" se existir "movieSearchUrl"
    }
  }, []);

  return (
    <div className={styles.baseBotoes}>
      <div className={styles.contBotoes}>
        <BotaoPrimario
          textoBotaoPrimario={TextoBotao}
          idBprimario={"Salvar"}
          onClick={onClick} // Ação para o botão primário
        />

        {botaoSecundario && (
          <div className={styles.botaoSecundario}>
            <div>
              {filtrosCount > 0 && (
                <div className={styles.notificacaoFiltros}>{filtrosCount}</div>
              )}
            </div>

            <BotaoSecundario
              textoBotaoSecundario={"Filtros"}
              fonteSecundaria={"14px"}
              onClick={onClickModal} // Ação para o botão secundário (modal)
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseBotoes;
