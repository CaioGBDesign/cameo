// components/detalhesfilmes/atores/index.jsx
import React from "react";
import styles from "./index.module.scss";

const Atores = ({ NomeAtor, fotoAtor, Personagem }) => {
  return (
    <div className={styles.cardsAtores}>
      <div className={styles.contAtores}>
        <div className={styles.dublador}>
          <img src={fotoAtor} alt={NomeAtor} />
        </div>

        <div className={styles.nomePersonagem}>
          <p>{NomeAtor}</p>
          <span>{Personagem}</span>
        </div>
      </div>
    </div>
  );
};

export default Atores;
