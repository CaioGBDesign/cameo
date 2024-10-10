// components/Classificacao.js
import React from "react";
import styles from "./index.module.scss";

const certificationMap = {
  L: <div className={styles.livre}>Livre</div>,
  10: <div className={styles.dezAnos}>10 anos</div>,
  12: <div className={styles.dozeAnos}>12 anos</div>,
  14: <div className={styles.quatorzeAnos}>14 anos</div>,
  16: <div className={styles.dezesseisAnos}>16 anos</div>,
  18: <div className={styles.dezoitoAnos}>18 anos</div>,
};

const Classificacao = ({ releaseDates }) => {
  if (!releaseDates) return null;

  const brRelease = releaseDates.find((result) => result.iso_3166_1 === "BR");

  if (
    brRelease &&
    brRelease.release_dates.length > 0 &&
    brRelease.release_dates[0].certification
  ) {
    const certification = brRelease.release_dates[0].certification;
    const certificationDisplay = certificationMap[certification] || (
      <p>Classificação não disponível</p>
    );

    return (
      <div className={styles.detalhes}>
        <h3>Classificação Indicativa</h3>
        {certificationDisplay}
      </div>
    );
  }

  return null; // Não exibe nada se não houver classificação
};

export default Classificacao;
