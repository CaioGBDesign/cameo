import React from "react";
import Image from "next/image";
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
            alt={"O filme sugerido é " + tituloAssistidos}
            width={1280}
            height={720}
            quality={75}
            priority
            className={styles.objectFit}
          />
        </div>
      </div>
    </div>
  );
};

export default FundoTitulosDesktop;
