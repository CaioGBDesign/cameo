import React from "react";
import { useIsMobile } from "@/components/DeviceProvider";
import styles from "./index.module.scss";

const Sinopse = ({ sinopse }) => {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <div className={styles.sinopse}>
      <div className={styles.contSinopse}>
        <div className={styles.sinopseCompleta}>
          <p>{sinopse}</p>
        </div>
      </div>
    </div>
  );
};

export default Sinopse;
