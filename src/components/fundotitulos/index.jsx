// components/fundotitulos/index.jsx
import React from "react";
import styles from "./index.module.scss";
import BotaoPlay from "@/components/botoes/play";

const FundoTitulos = ({
  exibirPlay = true,
  capaAssistidos,
  tituloAssistidos,
  trailerLink,
  opacidade = 1,
}) => {
  return (
    <div className={styles.contCapa}>
      {exibirPlay &&
        trailerLink && ( // Verifica se exibirPlay é true e se há trailerLink
          <div className={styles.play}>
            <BotaoPlay linkTrailer={trailerLink}></BotaoPlay>
          </div>
        )}

      <div className={styles.capaAssistidos} style={{ opacity: opacidade }}>
        <img src={capaAssistidos} alt={tituloAssistidos} />
      </div>
    </div>
  );
};

export default FundoTitulos;
