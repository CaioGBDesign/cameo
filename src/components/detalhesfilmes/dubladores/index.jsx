import React from "react";
import styles from "./index.module.scss";
import Image from "next/image";

const Dubladores = ({ fotoDublador, NomeDublador, Personagem }) => {
  return (
    <div className={styles.cardsDubladores}>
      <div className={styles.contDubladores}>
        <div className={styles.setaLink}>
          <img src="/icones/seta-link.svg" />
        </div>

        <div className={styles.dublador}>
          <div className={styles.fotoDublador}>
            <Image
              src={fotoDublador}
              alt={NomeDublador}
              fill
              quality={50} // Ajuste a qualidade se necessário
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.objectFit}
            />
          </div>
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
