// components/detalhesfilmes/nomeservico/index.jsx
import React from "react";
import styles from "./index.module.scss";

const NomeServico = ({ streaming, nomeServico }) => {
  return (
    <div className={styles.nomeServico}>
      <div className={styles.contServicos}>
        {streaming && (
          <img
            src={`https://image.tmdb.org/t/p/w200${streaming}`}
            alt={nomeServico}
          />
        )}
      </div>
    </div>
  );
};

export default NomeServico;
