import styles from "./index.module.scss";

const Atores = ({ NomeAtor, fotoAtor, Personagem }) => {
  return (
    <div className={styles.cardsAtores}>
      <div className={styles.contAtores}>
        <div className={styles.dublador}>
          <img src={fotoAtor} alt="Nome do usuario" />
        </div>

        <div className={styles.nomePersonagem}>
          <p>{NomeAtor}</p>
          <span>{Personagem}</span>
        </div>
      </div>
    </div>
  );
};

export default Atores;
