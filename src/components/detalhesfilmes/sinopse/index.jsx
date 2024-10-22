import { useIsMobile } from "@/components/DeviceProvider";
import styles from "./index.module.scss";

const Sinopse = ({ sinopse }) => {
  const isMobile = useIsMobile(); // Chame o hook aqui

  return (
    <div className={styles.sinopse}>
      <div className={styles.contSinopse}>
        {isMobile ? <h3>Sinopse</h3> : null}

        <div className={styles.sinopseCompleta}>
          <p>{sinopse}</p>
        </div>
      </div>
    </div>
  );
};

export default Sinopse;
