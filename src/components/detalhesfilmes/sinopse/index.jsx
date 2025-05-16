// components/detalhesfilmes/sinopse/index.jsx
import React, { useState } from "react";
import { useIsMobile } from "@/components/DeviceProvider";
import styles from "./index.module.scss";

const Sinopse = ({ sinopse }) => {
  const isMobile = useIsMobile();
  // controla expansão em mobile
  const [expanded, setExpanded] = useState(false);

  // define limite de caracteres para mobile
  const CHAR_LIMIT = 200;
  const truncated =
    sinopse.length > CHAR_LIMIT
      ? sinopse.slice(0, CHAR_LIMIT) + "..."
      : sinopse;

  // no desktop sempre mostra completa
  const content = isMobile && !expanded ? truncated : sinopse;

  return (
    <div className={styles.sinopse}>
      <div className={styles.contSinopse}>
        {isMobile && <h3>Sinopse</h3>}

        <div className={styles.sinopseCompleta}>
          <p>{content}</p>

          {/* botão "Ver mais" apenas se mobile e truncado */}
          {isMobile && sinopse.length > CHAR_LIMIT && (
            <div className={styles.botaoVerMais}>
              <button
                className={styles.verMais}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Ver menos" : "Ver mais"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sinopse;
