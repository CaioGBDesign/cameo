// components/fundotitulos/index.jsx
import React from "react";
import Image from "next/image"; // Importa o componente Image do Next.js
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
      {exibirPlay && trailerLink && (
        <div className={styles.play}>
          <BotaoPlay linkTrailer={trailerLink}></BotaoPlay>
        </div>
      )}

      <div className={styles.capaAssistidos} style={{ opacity: opacidade }}>
        <div className={styles.imageContainer}>
          <Image
            src={capaAssistidos}
            alt={tituloAssistidos}
            layout="fill" // Usa o layout fill
            objectFit="cover" // Ajusta a imagem para cobrir o contêiner
            quality={50} // Ajuste a qualidade se necessário
          />
        </div>
      </div>
    </div>
  );
};

export default FundoTitulos;
