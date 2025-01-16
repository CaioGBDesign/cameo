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
  style = {},
}) => {
  return (
    <div className={styles.contCapa} style={style}>
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
            fill
            quality={50} // Ajuste a qualidade se necessário
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.objectFit}
          />
        </div>
      </div>
    </div>
  );
};

export default FundoTitulos;
