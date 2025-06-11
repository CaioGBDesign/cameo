import styles from "./index.module.scss";

const AvaliarFilme = () => {
  return (
    <div className={styles.avaliarFilme}>
      <div className={styles.avaliar}>
        Já assisti
        <img
          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Festrela-stroke.svg?alt=media&token=619155fa-3e6f-4d5b-9eff-0da7960c500a"
          alt="estrela de avaliação"
        />
      </div>
    </div>
  );
};

export default AvaliarFilme;
