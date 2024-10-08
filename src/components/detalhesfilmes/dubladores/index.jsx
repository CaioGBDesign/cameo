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
              layout="fill" // Usa o layout fill
              objectFit="cover" // Ajusta a imagem para cobrir o contêiner
              quality={50} // Ajuste a qualidade se necessário
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
