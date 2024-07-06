import styles from "./index.module.scss";

const AvaliarFilme = () => {
  return (
    <div className={styles.avaliarFilme}>
      <div className={styles.avaliar}>
        Avaliar filme
        <img src="/icones/estrela-stroke.svg" />
      </div>
    </div>
  );
};

export default AvaliarFilme;
