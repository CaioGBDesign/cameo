// components/detalhesfilmes/nomeservico/index.jsx
import React from "react";
import styles from "./index.module.scss";

const NomeServico = ({ streaming, nomeServico }) => {
  return (
    <div className={styles.nomeServico}>
      <div className={styles.contServicos}>
        {streaming && (
          <img
            src={`https://image.tmdb.org/t/p/w200${streaming}`} // ajuste o tamanho da imagem conforme necessário
            alt={nomeServico} // atribui o nome do serviço ao atributo alt da imagem
          />
        )}
      </div>
    </div>
  );
};

export default NomeServico;
