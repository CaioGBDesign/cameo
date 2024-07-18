import styles from "./index.module.scss";

const Avaliacao = ({ avaliador }) => {
  return (
    <div className={styles.avaliacao}>
      <div className={styles.tituloAvaliacao}>
        <h3>Avaliação •</h3>
        <p>{avaliador}</p>
      </div>

      <div className={styles.avaliacaoCompleta}>
        <p>
          Super Mario Bros o filme é brilhante para quem é fã, por ser repleto
          de referências aos games clássicos. O filme é extremamente lindo, cada
          detalhe é uma nova pizza visual, mas infeliz...
        </p>
      </div>
    </div>
  );
};

export default Avaliacao;
