import styles from "./index.module.scss";

const Diretores = ({ NomeDiretor, fotoDiretor, Personagem }) => {
  return (
    <div className={styles.cardsDiretores}>
      <div className={styles.contDiretores}>
        <div className={styles.diretor}>
          <img src={fotoDiretor} alt="Nome do usuario" />
        </div>

        <div className={styles.nomePersonagem}>
          <p>{NomeDiretor}</p>
        </div>
      </div>
    </div>
  );
};

export default Diretores;
