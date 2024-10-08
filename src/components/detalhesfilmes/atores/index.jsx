// components/detalhesfilmes/atores/index.jsx
import React from "react";
import styles from "./index.module.scss";
import Image from "next/image";

const Atores = ({ NomeAtor, fotoAtor, Personagem }) => {
  return (
    <div className={styles.cardsAtores}>
      <div className={styles.contAtores}>
        <div className={styles.dublador}>
          <div className={styles.fotoAtor}>
            <Image
              src={fotoAtor}
              alt={NomeAtor}
              layout="fill" // Usa o layout fill
              objectFit="cover" // Ajusta a imagem para cobrir o contêiner
              quality={50} // Ajuste a qualidade se necessário
            />
          </div>
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
