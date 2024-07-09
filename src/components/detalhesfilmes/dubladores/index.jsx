import React from "react";
import styles from "./index.module.scss";

const Dubladores = ({ fotoDublador, NomeDublador, Personagem }) => {
  return (
    <div className={styles.cardsDubladores}>
      <div className={styles.contDubladores}>
        <div className={styles.dublador}>
          <img
            src={fotoDublador}
            alt={NomeDublador}
            className={styles.fotoDublador}
          />
        </div>

        <div className={styles.nomePersonagem}>
          <p className={styles.nome}>{NomeDublador}</p>
          <span className={styles.personagem}>{Personagem}</span>
        </div>
      </div>
    </div>
  );
};

export default Dubladores;
