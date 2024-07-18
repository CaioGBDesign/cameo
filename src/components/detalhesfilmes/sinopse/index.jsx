import styles from "./index.module.scss";

const Sinopse = ({ sinopse }) => {
  return (
    <div className={styles.sinopse}>
      <div className={styles.contSinopse}>
        <h3>Sinopse</h3>

        <div className={styles.sinopseCompleta}>
          <p>{sinopse}</p>
        </div>
      </div>
    </div>
  );
};

export default Sinopse;
