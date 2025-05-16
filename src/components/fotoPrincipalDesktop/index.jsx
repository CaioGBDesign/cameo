// components/fundotitulos/index.jsx
import React from "react";
import Image from "next/image";
import styles from "./index.module.scss";
import { useIsMobile } from "@/components/DeviceProvider";
import dynamic from "next/dynamic";

// Lazy-load play button and classification
const BotaoPlay = dynamic(() => import("@/components/botoes/play"), {
  ssr: false,
});

const FundoTitulosDesktop = ({
  capaAssistidos,
  capaAssistidosMobile,
  tituloAssistidos,
  trailerLink,
  opacidade = 1,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={styles.contCapa}>
      <div className={styles.capaAssistidos} style={{ opacity: opacidade }}>
        <div
          className={styles.imageContainer}
          style={{ position: "relative", width: "80%", aspectRatio: "16/9" }}
        >
          {isMobile ? null : <div className={styles.fundoA}></div>}
          {isMobile ? null : <div className={styles.fundoB}></div>}
          {isMobile ? null : <div className={styles.fundoC}></div>}

          {isMobile && trailerLink && (
            <div className={styles.botaoTrailer}>
              <BotaoPlay linkTrailer={trailerLink} />
            </div>
          )}

          {isMobile ? (
            <Image
              src={capaAssistidosMobile}
              alt={"O filme sugerido é " + tituloAssistidos}
              width={1600}
              height={860}
              quality={0} // Ajuste a qualidade se necessário
              className={styles.objectFit}
            />
          ) : (
            <Image
              src={capaAssistidos}
              alt={"O filme sugerido é " + tituloAssistidos}
              width={1600}
              height={860}
              quality={0} // Ajuste a qualidade se necessário
              className={styles.objectFit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FundoTitulosDesktop;
