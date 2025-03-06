import styles from "./index.module.scss";

const AvaliarFilme = () => {
  return (
    <div className={styles.avaliarFilme}>
      <div className={styles.avaliar}>
        Já assisti
        <img src="/icones/estrela-stroke.svg" />
      </div>
    </div>
  );
};

export default AvaliarFilme;
