import React from "react";
import styles from "./index.module.scss";

const Titulolistagem = ({ quantidadeFilmes, titulolistagem }) => {
  return (
    <div className={styles.titulolistagem}>
      <div className={styles.quantidade}>
        <span className={styles.contagem}>{quantidadeFilmes}</span>
        <span className={styles.tituloPagina}>{titulolistagem}</span>
      </div>
    </div>
  );
};

export default Titulolistagem;
