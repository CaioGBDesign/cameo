// components/fundotitulos/index.jsx
import React from "react";
import Image from "next/image"; // Importa o componente Image do Next.js
import styles from "./index.module.scss";

const FundoTitulosDesktop = ({
  capaAssistidos,
  tituloAssistidos,
  opacidade = 1,
}) => {
  return (
    <div className={styles.contCapa}>
      <div className={styles.capaAssistidos} style={{ opacity: opacidade }}>
        <div
          className={styles.imageContainer}
          style={{ position: "relative", width: "80%", aspectRatio: "16/9" }}
        >
          <div className={styles.fundoA}></div>
          <div className={styles.fundoB}></div>
          <div className={styles.fundoC}></div>
          <Image
            src={capaAssistidos}
            alt={tituloAssistidos}
            width={1600}
            height={860}
            quality={50} // Ajuste a qualidade se necessário
            className={styles.objectFit}
          />
        </div>
      </div>
    </div>
  );
};

export default FundoTitulosDesktop;
